const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    const { email, password, role } = req.body
    if (!email || !password || !role) {
        return res.status(400).json({ message: "please enter all data" })
    }
    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({ error: "Email is already exist" })
    }
    const hashPwd = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        email, password: hashPwd , role
    })
    let token = jwt.sign(
        { email: newUser.email, id: newUser._id, role: newUser.role },
        process.env.SECRET_KEY
    );

    return res.status(200).json({
        token,
        user: { email: newUser.email, role: newUser.role, id: newUser._id }
    });
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "please enter all your data" });
    }

    let user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        // Include role in JWT payload
        let token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.SECRET_KEY
        );

        return res.status(200).json({
            token,
            user: { email: user.email, role: user.role, id: user._id }
        });
    } else {
        return res.status(400).json({ error: "Invalid credentials" });
    }
};

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json({email:user.email})
}

module.exports = { userLogin, userSignUp, getUser }