const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    photo: String,
    password: {
        type: String,
        required: true,
        minlength: [8, 'A password should at least have 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password'],
        validate: {
            // THIS ONLY WORKS ON CREATE & SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password not match'
        }
    },
    passwordChangedAt: Date,
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    } 

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};


const User = mongoose.model('User', userSchema);

module.exports = User;