const mongoose = require("mongoose");
const RoleType = require("../utils/constant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [true, "Please provide user"],
    },
    email :{
        type: String,
        unique:true,
        required: [true, "Please provide user"]
    },
    password : {
        type: String,
        required: [true, "Please provide user"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "Please provide user"],
        //works for save and create not update
        validate: {
            validator: function(val){
                return val === this.password;
            },
            mesaage: "Password Provided does not match"
        }
    },
    profilePic: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        // enum: [RoleType.USER, RoleType.MODERATOR],
        // default: RoleType.USER
    },
    showProperty:{
        type: Boolean,
        default: true
    },
    //   dateCreated: {
    //     type: String,
    //     default: new Date().toJSON()
    // },
    // dateUpdated: {
    //     type: String,
    //     default: new Date().toJSON()
    // },

}, 
  { timestamps: true }
  );

userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();

    //encrypt the password before saving it
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    this.confirmPassword = undefined;
    //Another Means
   // this.password = await bcrypt.hash(this.password, 10);

    //this.confirmPassword = undefined;
    next()
});

userSchema.methods.createJWT = function () {
  return jwt.sign({
    userId: this._id, username: this.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME
    })
}

userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User =  mongoose.model("user", userSchema);

module.exports = User

// module.exports = mongoose.model("user", userSchema)

