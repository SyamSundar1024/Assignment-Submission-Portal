const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], required: true}
});

userSchema.pre('save', async function (next) {                  //This function runs before every save operation on user documnet.
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);                      //Adding additional random data to the password hashing process for unique password.
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;