const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/Express_CRUD_DB"
        )
        console.log("MongoDB Connected to Express_CRUD_DB")
    } catch (error) {
        console.error("MongoDB connection failed", error)
        process.exit(1)
    }
}

module.exports = connectDB
