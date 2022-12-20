const User = require('../models/user_model');
const Appointment = require('../models/appointment_model');
const app = require('../app');

exports.expired_appointment = async () => {
	// Get all the appointments
	const appointments = await Appointment.find();

	// Filter out all the appointmets where the user does not exist, and appointments where the date is greater than the current date
	const active_appointments = appointments.filter(
		(el) =>
			el.visit_date.getTime() < new Date().getTime() &&
			el.patient !== null &&
			el.doctor !== null
	);

	// Update all the appointments which have passed to status "missed"
	active_appointments.forEach(async (appointment) => {
		if (appointment.status === 'Scheduled') {
			await Appointment.findByIdAndUpdate(appointment._id, {
				status: 'Missed',
			});
		}
	});
};
