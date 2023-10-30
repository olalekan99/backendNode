const User = require("../model/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")){
        token = req?.headers?.authorization?.spilit(" ")[1];
        try {
            if (token){
                const decoded = jwt.verify(token, process.env.JWT_LIFETIME);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next()
            }
        } catch (error) {
            throw new Error("Not Authorosed, Please Login again")
        }
    } else {
        throw new Error("There is no token attached to the header")
    }
});

const isAdmin = asyncHandler(async(req, res, next) => {
    const { email } = req.user;
    const isAdmin = await User.findOne({email: email});
    if (isAdmin.role !== "admin") {
        throw new Error("You are not an Admin.")
    } else{
        next()
    }
})

module.exports = {authMiddleware, isAdmin}