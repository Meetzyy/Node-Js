const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")

const app = express()

app.use(express.json())

app.use(express.static("public"))

app.use("/api/users", userRoutes)

connectDB()

const PORT = 1815
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
