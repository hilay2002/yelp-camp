const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')
const CampgroundModel = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

const sample = array =>( array[Math.floor(Math.random()*array.length)])

const seedDB = async()=>{
    await CampgroundModel.deleteMany({});
    for(let i = 0; i < 50; i++){
        
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 11; 
        const newCampground = new CampgroundModel({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            image: `https://media.istockphoto.com/id/1619037808/photo/empty-wooden-photo-frame-on-white-background.jpg?s=612x612&w=0&k=20&c=1KnJzURQKvLeTXPiQq-y-8wG1ZO07bcQYYfozCW5dOw=`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. At vitae qui veniam suscipit veritatis odit, tempore fugit, iste rerum voluptates facilis velit eligendi cumque ab obcaecati? Earum dolore voluptas animi.',
            price
        })
        await newCampground.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
    console.log('connection closed');
})
.catch((e)=>{
    console.log(e);
})