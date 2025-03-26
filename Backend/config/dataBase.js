const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)

    .then(()=> console.log("DB connected successfully"))

    .catch((error)=>{
        console.log("Db connection Failed");
        console.log(error);
        console.error(error);
        process.exit(1);
    });
};