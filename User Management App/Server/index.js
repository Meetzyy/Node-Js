const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express();
const JWT_SECRET = "super_secret_key";



app.listen(3000, async () => {
    await connectDB();
    console.log('Server is running on port 3000');
});



app.use(cors());
app.use(express.json());



app.post('/register', async (req, res) => {
  const { name, email, department, role, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    department,
    role,
    password: hashedPassword
  });

  await user.save();
  res.json({ message: "Employee registered" });
});



app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});



app.get('/', (req, res) => {
    res.send('Welcome to the User Management App API');
});

app.post("/add", async (req, res) => {
    try {
        const { name, email, department, role, password } = req.body;
        const newUser = new User({ name, email, department, role, password });
        await newUser.save();
        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}); 

app.get("/employees", async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.put("/update/:id", async (req,res) => {
    try{
        const { id } = req.params;
        const { name, email, department, role, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, department, role, password }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    }
    catch(error){
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.delete("/delete/:id", async (req,res) => {
    try{
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    }
    catch(error){
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})