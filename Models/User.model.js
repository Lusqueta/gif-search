const { Schema, model } = require("mongoose");

const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({

    username: {
        type: String,
        required: [true, "Username is required."],
        trim: true,
        unique: true,
        minlength: 6
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        
        validate (value) {

            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid.");
            }

        }

    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    tokens: [{
        token : {
            type: String,
            required: true
        }
    }],

});


// Hides private data
UserSchema.methods.toJSON = function () {

    const user = this;

    const {
        username,
        email
    } = user.toObject();

    const public = {
        username,
        email
    }

    return public;

}

// Creates auth token
UserSchema.methods.generateAuthToken = function () {

    const user = this;

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});

    return token;

}

// Hash password
UserSchema.pre('save', async function ( next ) {

    const user = this;
    
    if(user.isModified("password"))
        user.password = await bcrypt.hash(user.password, 8);

    next();

});

// Get user by credentials

const UserModel = model("User", UserSchema);

module.exports = UserModel;