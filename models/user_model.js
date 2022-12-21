const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
		validate: [
			validator.isEmail,
			'Please provide a valid email address!',
		],
	},
	role: {
		type: mongoose.Schema.ObjectId,
		ref: 'Role',
		default: '63a2d8431f8fb2a58aa7b492',
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
	password_changed_at: {
		type: Date,
	},
	password_reset_token: String,
	password_reset_expires: Date,
});

user_schema.pre(/^find/, function (next) {
	this.populate({
		path: 'role',
	});
	next();
});

user_schema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
		this.password_confirm = undefined;
	}

	return next();
});

const User = mongoose.model('User', user_schema);

module.exports = User;
