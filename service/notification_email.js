const User = require('../models/user_model');
const Appointment = require('../models/appointment_model');
const nodemailer = require('nodemailer');

exports.notification_email = async () => {
	const appointments = await Appointment.find();

	const active_appointments = appointments.filter(
		(el) =>
			el.visit_date.toDateString() === new Date().toDateString() &&
			el.patient !== null &&
			el.doctor !== null
	);

	active_appointments.forEach(async (appointment) => {
		const doctor = await User.find(appointment.doctor);
		const patient = await User.find(appointment.patient);

		// Create a transporter with your service provider, and your auth info
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
			subject: 'Doctor Appointment',
			text: `${
				patient[0].name
			}, you have a scheduled appointment today with Dr.${
				doctor[0].name
			} at ${appointment.visit_date.toLocaleString('en-US', {
				dateStyle: 'medium',
				timeStyle: 'short',
				hour12: true,
			})}.`,
		};

		// Send email or catch the error e.g. no valid email to send
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	});
};
