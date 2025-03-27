const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    console.log("Attempting to connect to the database...");
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("DB connected successfully");
        })
        .catch((error) => {
            console.log("DB connection failed");
            console.error(error);
            process.exit(1);
        });
};