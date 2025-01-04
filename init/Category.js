const mongoose=require("mongoose");
const Category=require("../models/Category.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/SPORTSPHERE")
}

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})

const categories=[
    {
      "name": "Cricket",
      "description": "All cricket-related gear including bats, balls, pads, and accessories."
    },
    {
      "name": "Football",
      "description": "Football equipment including footballs, boots, jerseys, and more."
    },
    {
      "name": "Badminton",
      "description": "Badminton rackets, shuttlecocks, nets, and related accessories."
    },
    {
      "name": "Fitness",
      "description": "Gym and fitness equipment like dumbbells, yoga mats, resistance bands, etc."
    },
    {
      "name": "Cycling",
      "description": "Bicycles, helmets, cycling apparel, and other related accessories."
    },
    {
      "name": "Tennis",
      "description": "Tennis rackets, balls, and other court equipment."
    },
    {
      "name": "Swimming",
      "description": "Swimming gear such as swimsuits, goggles, caps, and accessories."
    },
    {
      "name": "Running",
      "description": "Running shoes, apparel, and accessories for all running enthusiasts."
    },
    {
      "name": "Hiking",
      "description": "Hiking gear like backpacks, trekking poles, boots, and more."
    },
    {
      "name": "Table Tennis",
      "description": "Table tennis paddles, balls, and nets for all levels of play."
    }
  ]
  
  const initDB=async()=>{
    await Category.deleteMany({});
    // initdata.data=initdata.data.map((obj)=>({...obj,owner:"6762d03d7c77fe81fde79065"}));
    await Category.insertMany(categories);
    console.log("data was initialized");
}

initDB();