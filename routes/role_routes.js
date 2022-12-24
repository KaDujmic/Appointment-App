const express = require('express');
const role_controller = require('./../controllers/role_controller');
const authentication_controller = require('./../controllers/authentication_controller');

const router = express.Router({ mergeParams: true });

router.use(authentication_controller.protect);

router
	.route('/')
	.get(role_controller.get_all_roles)
	.post(role_controller.create_role);

router
	.route('/:id')
	.get(role_controller.get_role)
	.put(role_controller.update_role);

module.exports = router;
