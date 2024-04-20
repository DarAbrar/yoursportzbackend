const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        max: 10
    },
    dob: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: ""
    },
    otp: {
        type: String
    },
    verified: { type: Boolean, default: false },
    
    role:{
        type: String,
        default: "user"
    },
    isAdmin:{
        type: Boolean,
        default: false,
    }
},
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);
