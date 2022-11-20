const express = require('express');
const user_controller = require('./../controllers/user_controller');

const router = express.Router();

router
	.route('/')
	.get(user_controller.get_all_users)
	.post(user_controller.create_user);

router
	.route('/:id')
	.put(user_controller.update_user)
	.delete(user_controller.delete_user);

module.exports = router;
