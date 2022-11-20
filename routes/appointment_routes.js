const express = require('express');
const appointment_controller = require('./../controllers/appointment_controller');

const router = express.Router();

router
	.route('/')
	.get(appointment_controller.get_all_appointments)
	.post(appointment_controller.create_appointment);

router
	.route('/:id')
	.put(appointment_controller.update_appointment)
	.delete(appointment_controller.delete_appointment);

module.exports = router;
