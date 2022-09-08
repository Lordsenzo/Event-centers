const mongoose = require('mongoose');
const cities = require('./cities'); // An array 
const { places, descriptors } = require('./seedHelpers');
const CampGround = require('../models/campground'); //accesses the parent elements (one level above)
// const campground = require('../models/campground');

async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("working finally mongo connection open");
}
main().catch((err) => console.log(err));

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// const db = mongoose;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

// function sample(array) {array[Math.floor(Math.random() * array.length)}
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await CampGround.deleteMany({});
    for (let i = 0; i < 50; i++) {
        
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new CampGround({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/2184453`',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, at quas laudantium maxime unde officiis eum optio dicta quia qui mollitia quo beatae odit deleniti soluta veniam obcaecati ullam placeat?',
            price
        })
        await camp.save();
    }
}

// const seedDB = async()=>{
//     await campground.deleteMany({})
// }

// It doesnt reseed the database except we ask it to - 
seedDB().then(() => {
    mongoose.connection.close();
})