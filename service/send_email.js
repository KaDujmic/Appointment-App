const nodemailer = require('nodemailer');

exports.send_mail = (patient, doctor, subject, text) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// Fill out mail options with the infromation needed
	const mailOptions = {
		from: 'kdujmic10@gmail.com',
		to: `${patient[0].email}`,
		subject: subject,
		text: text,
	};

	// Send email or catch the error e.g. no valid email to send
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};