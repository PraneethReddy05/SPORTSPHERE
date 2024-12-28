const mongoose=require("mongoose");
const Products=require("/Users/abhishekalli/Documents/SPORTSPHERE/models/Products.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/SPORTSPHERE")
}

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})

const products=[
    {
      "name": "SS Master 5000 Cricket Bat",
      "description": "Premium English willow cricket bat for professionals.",
      "price": 12500,
      "category": "676f92c5039cbe175727df63", // Cricket
      "images":"",
      "stock": 20,
      "reviews": []
    },
    {
      "name": "Adidas Football Boots",
      "description": "High-performance football boots designed for agility and speed.",
      "price": 7500,
      "category": "676f92c5039cbe175727df64", // Football
      "stock": 30,
      "reviews": []
    },
    {
      "name": "Yonex Nanoray 18i Badminton Racket",
      "description": "Lightweight graphite racket for advanced players.",
      "price": 3500,
      "category": "676f92c5039cbe175727df65", // Badminton
      "stock": 50,
      "reviews": []
    },
    {
      "name": "Dumbbell Set (20 kg)",
      "description": "Adjustable dumbbell set for home and gym workouts.",
      "price": 4500,
      "category": "676f92c5039cbe175727df66", // Fitness
      "stock": 15,
      "reviews": []
    },
    {
      "name": "Hercules Gear Cycle",
      "description": "21-speed mountain bicycle with durable frame and tires.",
      "price": 15000,
      "category": "676f92c5039cbe175727df67", // Cycling
      "stock": 10,
      "reviews": []
    },
    {
      "name": "Wilson US Open Tennis Balls (Pack of 3)",
      "description": "Official tennis balls for tournaments and practice sessions.",
      "price": 800,
      "category": "676f92c5039cbe175727df68", // Tennis
      "stock": 100,
      "reviews": []
    },
    {
      "name": "Speedo Swimming Goggles",
      "description": "Anti-fog and UV-protected goggles for professional swimmers.",
      "price": 1200,
      "category": "676f92c5039cbe175727df69", // Swimming
      "stock": 40,
      "reviews": []
    },
    {
      "name": "Nike Running Shoes",
      "description": "Lightweight and comfortable shoes for long-distance running.",
      "price": 8000,
      "category": "676f92c5039cbe175727df6a", // Running
      "stock": 25,
      "reviews": []
    },
    {
      "name": "Wildcraft Hiking Backpack (30L)",
      "description": "Compact and durable backpack for hiking and trekking.",
      "price": 3500,
      "category": "676f92c5039cbe175727df6b", // Hiking
      "stock": 12,
      "reviews": []
    },
    {
      "name": "Stiga Table Tennis Paddle",
      "description": "Professional-grade paddle for advanced table tennis players.",
      "price": 2200,
      "category": "676f92c5039cbe175727df6c", // Table Tennis
      "stock": 35,
      "reviews": []
    }
  ]

  
  const initDB=async()=>{
    await Products.deleteMany({});
    // initdata.data=initdata.data.map((obj)=>({...obj,owner:"6762d03d7c77fe81fde79065"}));
    await Products.insertMany(products);
    console.log("data was initialized");
}

initDB();