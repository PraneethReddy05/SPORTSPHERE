const mongoose=require("mongoose");
const Products=require("../models/Products.js");

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
      "stock": 20,
      "images": "https://imgs.search.brave.com/pqJDkrs3L7HNKRNAvoSSHn6YGqwDQK41-aCIG-CQSxc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAz/MzAvMjAxNC85ODk5/L3Byb2R1Y3RzL3Nz/LWNyaWNrZXQtYmF0/cy1zaG9ydC1oYW5k/LW1lZGl1bS0ybGJz/LThvei0ybGJzLTEw/b3otc3MtbWFzdGVy/LTUwMDAtc2VuaW9y/LWNyaWNrZXQtYmF0/LTM3ODczOTMyNjk3/ODUwLmpwZz92PTE2/NjI2ODE1NTQmd2lk/dGg9MTIwMA",
      "reviews": []
    },
    {
      "name": "Adidas Football Boots",
      "description": "High-performance football boots designed for agility and speed.",
      "price": 7500,
      "category": "676f92c5039cbe175727df64", // Football
      "stock": 30,
      "images": "https://imgs.search.brave.com/s9iawMGzG2k9T7bqh5p3jph0kuFJlsqSWUtIzWg9nXI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjEwZFFjLXF5TEwu/anBn",
      "reviews": []
    },
    {
      "name": "Yonex Nanoray 18i Badminton Racket",
      "description": "Lightweight graphite racket for advanced players.",
      "price": 3500,
      "category": "676f92c5039cbe175727df65", // Badminton
      "stock": 50,
      "images": "https://imgs.search.brave.com/7T6eMovBbGq-IQ1_DWNmdyAly8rrml4sXbodytrTFWw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3BvcnRzd2luZy5p/bi93cC1jb250ZW50/L3VwbG9hZHMvMjAy/MS8xMS9Zb25leC1O/YW5vcmF5LTE4SS1C/YWRtaW50b24tUmFj/cXVldC1CbGFjay1T/dHJ1bmctcDQuanBn",
      "reviews": []
    },
    {
      "name": "Dumbbell Set (20 kg)",
      "description": "Adjustable dumbbell set for home and gym workouts.",
      "price": 4500,
      "category": "676f92c5039cbe175727df66", // Fitness
      "stock": 15,
      "images": "https://imgs.search.brave.com/JFOYUPQC77aWculfe3HFWz0QkHhdgFQ5X23ZhCaOe40/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/d2Vic2hvcGFwcC5j/b20vc2hvcHMvMjgx/NjU0L2ZpbGVzLzMy/NDY2ODgxOS81MDB4/NTAweDIvcnViYmVy/LWR1bWJiZWxscy1z/ZXQuanBn",
      "reviews": []
    },
    {
      "name": "Hercules Gear Cycle",
      "description": "21-speed mountain bicycle with durable frame and tires.",
      "price": 15000,
      "category": "676f92c5039cbe175727df67", // Cycling
      "stock": 10,
      "images": "https://imgs.search.brave.com/Illfy1RdsKMyIidUs-gsS7dWh6oMo_Dypw-rQ4IWSOo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFqTkV4RTV5WUwu/anBn",
      "reviews": []
    },
    {
      "name": "Wilson US Open Tennis Balls (Pack of 3)",
      "description": "Official tennis balls for tournaments and practice sessions.",
      "price": 800,
      "category": "676f92c5039cbe175727df68", // Tennis
      "stock": 100,
      "images": "https://imgs.search.brave.com/urwlz4vEEVo0mGqlZZZqTtvwBmGmw_sYgx1w5IK1JYw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzE1TUVONjFhUEwu/anBn",
      "reviews": []
    },
    {
      "name": "Speedo Swimming Goggles",
      "description": "Anti-fog and UV-protected goggles for professional swimmers.",
      "price": 1200,
      "category": "676f92c5039cbe175727df69", // Swimming
      "stock": 40,
      "images": "https://imgs.search.brave.com/jTWkUqlVjUE6BwDpsnQsunhKc_YfYI_-QJ3tPWlHPpA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/eW91cnN3aW1sb2cu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE4LzA0L1NwZWVk/by1Td2VkaXNoLUdv/Z2dsZXMuanBn",
      "reviews": []
    },
    {
      "name": "Nike Running Shoes",
      "description": "Lightweight and comfortable shoes for long-distance running.",
      "price": 8000,
      "category": "676f92c5039cbe175727df6a", // Running
      "stock": 25,
      "images": "https://imgs.search.brave.com/BsZy0jk5L1z1ItVWDY6a0uKhKJrnK6SazfHsWwTyz5w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTF5VW16SExLQkwu/anBn",
      "reviews": []
    },
    {
      "name": "Wildcraft Hiking Backpack (30L)",
      "description": "Compact and durable backpack for hiking and trekking.",
      "price": 3500,
      "category": "676f92c5039cbe175727df6b", // Hiking
      "stock": 12,
      "images": "https://imgs.search.brave.com/fYZvMbn5ZrJ07FAoC84a4CnPtYNSZOwTbRiNsJWaG-w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFNWEMzMXZkVkwu/anBn",
      "reviews": []
    },
    {
      "name": "Stiga Table Tennis Paddle",
      "description": "Professional-grade paddle for advanced table tennis players.",
      "price": 2200,
      "category": "676f92c5039cbe175727df6c", // Table Tennis
      "stock": 35,
      "images": "https://imgs.search.brave.com/7r0l86svkTLw2NiiefS1qIiaesb00XsGt0HLmKah8eg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFVREJQUTczV0wu/anBn",
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