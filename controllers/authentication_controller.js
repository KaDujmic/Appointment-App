const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

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

	// res.cookie('jwt', token, cookie_options);

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

exports.protect = async (req, res, next) => {
	try {
		// 1) Getting the token and check if it's there
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			token = req.headers.authorization.split(' ')[1];
		}
		// Else if statment where we set cookie but commented out to test Bearer Token from postman
		// } else if (req.cookies.jwt) {
		// 	token = req.cookies.jwt;
		// 	console.log(`${token} Cookies`)
		// }
		if (!token) throw new Error('You are not logged in. Please log in!')
	
		// 2) Verification of the token
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	
		// 3) Check if the user still exists
		const current_user = await User.findById(decoded.id);
		if (!current_user) throw new Error('The user no longer exists!');
	
		// 4) Set local storage and req.user to current_user
		req.user = current_user;
		res.locals.user = current_user;
		next();

	} catch (err) {
		res.status(401).json({
			stats: 'fail',
			msg: err.message,
		});
	}
};


exports.is_logged_in = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verifies the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if the user still exists
      const current_user = await User.findById(decoded.id);
      if (!current_user) {
        return next();
      }

      // 3) CHeck if the user changed passowrd afther the token was issued
      if (current_user.changed_password_after(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = current_user;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
