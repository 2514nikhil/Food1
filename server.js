import express from 'express'
const app = express();
import connectDB from './config/db.js'
import User from './model/userSchema.js';
import bcrypt from 'bcrypt'
connectDB()
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello User!")
})
app.post('/register', async (req, res) => {
    const { email, name, password } = req.body

    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.send({ message: "User Already Exist" })
        }

        const hashedpassword = await bcrypt.hash(password,10)
        console.log(hashedpassword);
        
        const userData = await User({ email, name, password:hashedpassword })
        userData.save();
        res.send({ message: "User Created Successfully" })
    }
    catch (err) {
        res.send(err)
    }

})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await User.findOne({ email })
        if (!userExist) {
            return res.send({ message: "User Not Found" })
        }
        const realpassword = await bcrypt.compare(password,userExist.password);
        console.log(req.body);
        
        res.send({ message: "Successfully login" })
    }
    catch (err) {
        res.send(err)
    }
})

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params

    try {
        const userExist = await User.findByIdAndDelete({ _id: id })
        if (!userExist) {
            return res.send({ message: "User not found " })
        }

        res.send({ message: "User Deleted Successfully " })

    }
    catch (err) {
        res.send(err)
    }


})

app.put('/update/:id', async (req, res) => {
    const { id } = req.params

    const updateId = req.body

    const userUpdate = await User.findByIdAndUpdate({ _id: id }, updateId, { new: true })
    if (userUpdate) {
        res.send({ message: "User updated successfully" })
    }
    else {
        res.send({ message: "User not Updated" })
    }
})

app.listen(4000, (req, res) => {
    console.log("Server is running")
})