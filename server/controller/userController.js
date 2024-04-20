const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function signup(req, res) {
    try {
        // Get the data off req body
        const { name, email, phone, gender, dob, aadhaarNo, password } = req.body;

        // Hash Password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Create a user with the data
        await User.create({ name, email, phone, gender, dob, aadhaarNo, password: hashedPassword });

        // respond
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

async function login(req, res) {
    // Get email and password off the req body
    try {
        const { email, password } = req.body;

        // Find the User with requested email
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendStatus(401);
        }

        // Compare sent in password with found user password hash
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.sendStatus(401);
        }

        // Create a jwt token
        const exp = Date.now() + 1000 * 60 * 60 * 24;
        // console.log(exp);
        const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);
        // console.log(token);

        // Set the cookie
        res.cookie("Authorization", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        })

        // Send it
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        return res.sendStatus(400);
    }

}

function logout(req, res) {
    try {
        res.clearCookie("Authorization");
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        return res.sendStatus(400);
    }
}

function checkAuth(req, res) {
    try {
        // console.log(req.user);
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        return res.sendStatus(401);
    }
}

module.exports = {
    signup,
    login,
    logout,
    checkAuth,
};
