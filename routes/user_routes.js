const express = require('express');
const user_controller = require('./../controllers/user_controller');
const appointment_controller = require('../controllers/appointment_controller');

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(user_controller.get_all_users)
	.post(user_controller.create_user);

router
	.route('/:id')
	.get(user_controller.get_user)
	.put(user_controller.update_user)
	.delete(user_controller.delete_user);

router.route('/:id/appointments').get(user_controller.get_doctor_appointments);

module.exports = router;
