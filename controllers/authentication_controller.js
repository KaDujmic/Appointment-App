const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user_model');

const sign_token = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
const correct_password = async function (candidate_password, user_password) {
	return await bcrypt.compare(candidate_password, user_password);
};

const create_send_token = (user, status_code, res) => {
	const token = sign_token(user._id);
	const cookie_options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	res.cookie('jwt', token, cookie_options);

	res.status(status_code).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.signup = async (req, res, next) => {
	try {
		const new_user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password_confirm: req.body.password_confirm,
			password_changed_at: req.body.password_changed_at,
			role: req.body.role,
		});
		create_send_token(new_user, 201, res);
	} catch (err) {
		res.status(400).json({
			stats: 'fail',
			msg: err.message,
		});
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		// If no email or password throw an error
		if (!email || !password) {
			throw new Error('Enter your email or password');
		}
		const user = await User.findOne({ email }).select('+password');
		console.log(user);

		// If no user or the password is incorrect throw error
		if (!user || !correct_password(password, user.password)) {
			throw new Error('Incorrect email or password!');
		}
		create_send_token(user, 200, res);
	} catch (err) {
		res.status(400).json({
			stats: 'fail',
			msg: err.message,
		});
	}
};
