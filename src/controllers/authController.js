import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";

const router = express.Router();

function generateToken(params){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post("/signup", async (req, res) => {
    const { email } = req.body;

    try{
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "User already exists" });

        const user = await User.create(req.body);

        user.password = undefined;
        const token = generateToken({ id: user.id });

        return res.send({user, token});
    }catch (error){
        return res.status(400).send({ error: `Registration failed - ${error.message}` });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: "User not found" });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: "Invalid password" });

    
    user.password = undefined;

    const token = generateToken({ id: user.id });

    res.send({ user, token }); 
});

export default app => app.use("/auth", router);

