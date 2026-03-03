const express = require("express")
const router = express.Router()
const User = require("../models/User")
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args))

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" })
    }
})

router.post("/register", async (req, res) => {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        )
        const users = await response.json()

        const formattedUsers = users.map(user => ({
            name: user.name,
            username: user.username,
            email: user.email
        }))

        await User.deleteMany()
        await User.insertMany(formattedUsers)

        res.json({ message: "Users fetched and stored in MongoDB" })
    } catch (error) {
        res.status(500).json({ message: "Failed to store users" })
    }
})

router.patch("/update/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        )

        res.json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: "Update failed" })
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: "User deleted" })
    } catch (error) {
        res.status(500).json({ message: "Delete failed" })
    }
})

module.exports = router
