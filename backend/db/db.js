const mongoose=require('mongoose');

// const mongoose = require('mongoose');
async function connectToDB(){
    try {
        let connect = await mongoose.connect(process.env.DB_CONNECT, {
            serverSelectionTimeoutMS: 30000 
        });
        console.log("Connected to database",connect);
        return connect;
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
}


module.exports=connectToDB;

