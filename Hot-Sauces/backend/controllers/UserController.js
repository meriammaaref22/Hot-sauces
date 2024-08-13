const UserModel =require('../models/UserModel') 
const bcrypt = require('bcrypt')
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
module.exports={
    signup: async (req, res) => {
        try {
            
            const userFound = await UserModel.findOne({ email: req.body.email });
            if (userFound) throw createError(409, "User already exists");

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = await UserModel.create({
                email: req.body.email,
                password: hashedPassword
            });
        
            res.status(201).json({
                message: 'User successfully signed up',
                user: newUser
            });
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }
    },
    login: async (req, res) => {
        try {
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) throw createError(401, "Authentication failed, User not found");
    
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (!isValidPassword) throw createError(401, "Authentication failed, Wrong password");
    
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.SECRET_TOKEN,
                { expiresIn: '1h' }
            );
    
            res.status(200).json({
                message: "Authentication successful!",
                userId: user._id,
                token: token
            });
        } catch (err) {
            res.status(err.status || 400).json({
                status: 'fail',
                message: err.message
            });
        }
    }
    
}
