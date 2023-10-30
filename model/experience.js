const mongoose = require("mongoose");

   const experienceSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "this is a required field"],
        minlength:[2, "Text must have at least 2 characters"],
        trim: true
    },
       username : {
        type: String,
        required: [true, "Please provide user"],
    },
    showProperty:{
        type: Boolean,
        default: true
    },

    // createdBy: {
    //     type:mongoose.Types.ObjectId,
    //     ref: "User",
    //     required: [true, "Please provide user"]
    // },
    // dateCreated: {
    //     type: String,
    //     default: new Date().toJSON()
    // }
},
  { timestamps: true }
);

const Experience = mongoose.model("experience", experienceSchema);

module.exports = Experience;