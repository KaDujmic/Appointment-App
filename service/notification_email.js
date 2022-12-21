const User = require('../models/user_model');
const Appointment = require('../models/appointment_model');
const nodemailer = require('nodemailer');

exports.reminder_email = async () => {
	const appointments = await Appointment.find();

	// Filter out the appointments that are scheduled for today
	const active_appointments = appointments.filter(
		(el) =>
			el.visit_date.toDateString() === new Date().toDateString() &&
			el.patient !== null &&
			el.doctor !== null
	);

	// Send email to every patient who has an appointment today
	active_appointments.forEach(async (appointment) => {
		const doctor = await User.find(appointment.doctor);
		const patient = await User.find(appointment.patient);
		const subject = 'Doctor appointment';
		const text = `${
			patient[0].name
		}, you have scheduled an appointment with Dr.${
			doctor[0].name
		} at ${this.visit_date.toLocaleString('en-US', {
			dateStyle: 'medium',
			timeZone: 'UTC',
			timeStyle: 'short',
			hour12: true,
		})}.`;

		this.send_mail(patient, doctor, subject, text);
	});
};

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
