const mongoose = require("mongoose");
const validateMongodbId = (id) => {
    const isValid = mongoose.Types.ObjectId(id);
    if(!isValid) throw new Error ("This Id is not valid or Not Found")
};

module.exports = {validateMongodbId}