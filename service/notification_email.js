const User = require('../models/user_model');
const Appointment = require('../models/appointment_model');
const mail = require('./send_email')

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
		} at ${appointment.visit_date.toLocaleString('en-US', {
			dateStyle: 'medium',
			timeZone: 'UTC',
			timeStyle: 'short',
			hour12: true,
		})}.`;

		mail.send_mail(patient, doctor, subject, text);
	});
};


