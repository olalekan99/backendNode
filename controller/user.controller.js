// const {generateToken} = require("../config/jwt");
const { validateMongodbId } = require("../config/ValidateMongodbid");
const User = require("../model/user");
const asyncHandler = require("express-async-handler")

const registerUser = asyncHandler(async (req, res) =>{
    // Get the mail from the req.body, check if it exists or not
    const email = req.body.email;
    const findUser = await User.findOne({email});
    if (!findUser){
        // create a user
    const createUser = await User.create(req.body);
    const token = createUser.createJWT() //generating a token
    //  res.status(200).json({ status:true, 
    //     message: "User Created successfully",
    //     data: createUser });
     res.status(200).json({ status:true, 
        message: "User Created successfully",
        data: {name: createUser.username}, token });
    }else{
       throw new Error("user already exist")
    }
   });

const loginUser = asyncHandler(async (req, res) => {
     const {email, password} = req.body;
    //    check if user exist or not
    const findUser = await User.findOne({email: email});
     const token = findUser.createJWT() //added another means
    if(findUser && (await findUser.isPasswordMatched(password))){
        res.status(200).json({
            status: true,
            message: "Logged in successfully",
            data: {name: findUser.username}, token,
            // token: generateToken(findUser?._id),
            role: findUser?.username
        });
    }else{
        throw new Error("invalid credentials")
    }
     });

     //Get all users
     const getAllUsers = asyncHandler(async (req, res) =>{
        try {
            const allUsers = await User.find();
            res.status(200).json({
                 status: true,
            message: "Fetched all users successfully",
            data: allUsers
            })
        } catch (error) {
             throw new Error(error)
        }
     });

     //Get a user
        const getAUser = asyncHandler(async (req, res) =>{
            const { id } = req.params;
             validateMongodbId(id);
        try {
            const getProfile = await User.find(id);
            res.status(200).json({
                 status: true,
            message: "User Found",
            getProfile
            })
        } catch (error) {
             throw new Error(error)
        }
     });

     //updating a user
       const updateUser = asyncHandler(async (req, res) =>{
        const { _id } = req.user;
        validateMongodbId(_id)
        try {
            const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
            res.status(200).json({
                 status: true,
                 message: "Updated Successfully",
            data: user
            })
        } catch (error) {
             throw new Error(error)
        }
     });

// Deleting a user
const deleteUser = asyncHandler(async (req, res) => {
   const { id } = req.params;
   validateMongodbId(id);
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({
            status: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = {
    registerUser,
    loginUser, 
    getAllUsers,
    getAUser,
    updateUser,
    deleteUser
}

