const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const AppError = require('./utilities/ExpressError')
const CatchAsync = require('./utilities/CatchAsync')
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const { campgroundSchema } = require("./schemas");
// const {join} = require('path')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
const campGround = require("./models/campground"); //accesses the sibling elements(same level)
const { join } = require("path");
const ExpressError = require("./utilities/ExpressError");
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("working finally mongo connection open");
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs',  ejsMate)
// getting things from forms
app.use(express.urlencoded({ extended: true }));

const validateCampground = (req, res, next)=>{
    // const campgroundSchema = Joi.object({
    //     campground:Joi.object({
    //         title:Joi.string().required(),
    //         price:Joi.number().required().min(0),
    //         // image:Joi.string().required(),
    //         // location:Joi.string().required(),
    //         // description:Joi.string().required()
    //     }).required()
    // })

    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

// Landing Route
app.get('/', (req, res)=>{
    res.render('home')
})

// Home Route
app.get('/campgrounds', async(req, res)=>{
    const campgrounds = await campGround.find({})
    res.render('campgrounds/index', {campgrounds})
})

// New Route
app.get('/campgrounds/new', async(req, res)=>{
    res.render('campgrounds/new')
})
// app.post('/campgrounds', CatchAsync(async(req, res, next)=>{
//     // check with postman first
//     if(!req.body.campground) throw new AppError('invalid campground data', 404) //postman
//     const campground = new campGround(req.body.campground)
//     await campground.save()
//     res.redirect(`/campgrounds/${campground._id}`)

// })
// )
app.post('/campgrounds', validateCampground, CatchAsync(async(req, res, next)=>{
    // const campgroundSchema = Joi.object({
    //     campground:Joi.object({
    //         title:Joi.string().required(),
    //         price:Joi.number().required().min(0),
    //         image:Joi.string().required(),
    //         location:Joi.string().required(),
    //         description:Joi.string().required()
    //     }).required()
    // })
    // const result = campgroundSchema.validate(req.body)
    // const {error} = campgroundSchema.validate(req.body)
    // // was expecting a value from this, something like below, but we are only destructuring the error alone.
    // // const {error, value} = campgroundSchema.validate(req.body)
    // if(error){
    //     // lastly
    //     const msg = error.details.map(el=>el.message).join(',')
    //    //map method allow you modify the content of the array
    //     throw new ExpressError(msg, 400)
    // }
    // console.log(error);
    // check with postman first
    // if(!req.body.compground).throw new expressError('invalid campground data', 400) //postman
    // the if statement above is no more needed
        const campground = new campGround(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
}))

// Show Route
app.get('/campgrounds/:id', CatchAsync(async(req, res)=>{
    const campground = await campGround.findById(req.params.id)
    if(!campground){
        return next(new AppError('product not found', 404))
    }
    res.render('campgrounds/show', {campground})
})
)

// Editing Route
app.get('/campgrounds/:id/edit', CatchAsync(async(req, res) => {
    const campground = await campGround.findById(req.params.id)
    console.log(campground);
    if(!campground){
        return next(new AppError('product not found', 404))
    }
    res.render('campgrounds/edit', {campground});
})
)
app.put('/campgrounds/:id', validateCampground, CatchAsync(async(req, res) => {
    // const { id } = req.params;
    // const campground = await campGround.findByIdAndUpdate(id, { ...req.body.campground });
    const campground = await campGround.findByIdAndUpdate(req.params.id, { ...req.body.campground}, {new:true})
    //The second parameter updates the first parameter in the findByIdAndUpdate(a, b)
    // if(!campground){
    //     return next(new AppError('product not found', 404))
    // }
    res.redirect(`/campgrounds/${campground._id}`)
    // console.log(req.body);
    console.log(req.body.campground);
    console.log(campground);
})
)

// Deleting Route
app.delete('/campgrounds/:id', CatchAsync(async(req, res) => {
    // const { id } = req.params;
    // await campGround.findByIdAndDelete(id);
    await campGround.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})
)

// Note 
// res.redirect works with/without a beginning slash while res.render does not work with a beginning slash

// Hits any route
app.all('*', (req, res, next)=>{
    // try a route that doesn't exist
    // res.send('404!')

    // throw new Error("page not seen")


    next(new AppError('page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500, message = "something went wrong"} = err
    // res.status(statusCode).send(message)
    // res.status(statusCode).render('errors')
    if(!err.message){err.message='oh noo, something went wrong'} 
    //this is the default message if it doesnt understand the kind of error it's bringing
    res.status(statusCode).render('errors', {err})
    // res.send('oh boy something went wrong')
})



app.listen(port, ()=>{
    console.log(`listening at port ${port}`)
})