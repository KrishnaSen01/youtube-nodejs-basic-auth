const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,

    },
    roles: {
        type: String,
        enum: ["user", "admin"], // only allow 'user' and 'admin' roles
        default: "user"
    }

},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);
//Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.
//https://mongoosejs.com/docs/models.html