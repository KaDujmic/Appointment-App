const mongoose = require('mongoose');
const validator = require('validator');

const user_schema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!'],
	},
	email: {
		type: String,
		required: [true, 'Please enter your email address!'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email address!'],
	},
	photo: {
		type: String,
	},
	role: {
		type: String,
		enum: ['admin', 'patient', 'doctor'],
		default: 'patient',
	},
	password: {
		type: String,
		required: [true, 'Please enter your password!'],
		minlength: 8,
		select: false,
	},
	password_confirm: {
		type: String,
		required: [true, 'Please confirm your password!'],
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords do not match! Please try again!',
		},
	},
});

const User = mongoose.model('User', user_schema);

module.exports = User;
