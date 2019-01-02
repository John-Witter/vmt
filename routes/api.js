const express = require('express')
const router = express.Router()
const controllers = require('../controllers')
const middleware = require('../middleware/api');
const errors = require('../middleware/errors');
const multer = require('multer')
const upload = multer({dest: '/uploads'})

router.param('resource', middleware.validateResource)
router.param('id', middleware.validateId);

router.get('/:resource', (req, res, next) => {
	let controller = controllers[req.params.resource];

  controller.get(req.query.params)
    .then(results => res.json({ results }))
	  .catch(err => {
			console.error(`Error get ${resource}: ${err}`);
			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}
			return errors.sendError.InternalError(msg, res)
		})
})

// router.get('/:resource/ids', (req, res, next) => {
// 	let resource = req.params.resource;
// 	let controller = controllers[resource];
// 	if (controller == null){
// 		return res.status(400).json(defaultError)
// 	}
// 	controller.get(req.query.params).then(res => {
// 		res.json({
// 			confirmation: 'success',
// 			results: results
// 		})
// 	})
// 	.catch(err => {
// 		res.status(404).json({
// 			confirmation: 'fail',
// 			errorMessage: err
// 		})
// 	})
// })

router.get('/:resource/:id', middleware.validateUser, (req, res, next) => {
  let { id, resource } = req.params;
	let controller = controllers[resource];
	controller.getById(id)
	  .then(result => res.json({ result }))
	  .catch(err => {
			console.error(`Error get ${resource}/${id}: ${err}`);
			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}

			return errors.sendError.InternalError(msg, res)
		})
})

router.post('/:resource', upload.single('ggbFiles'), middleware.validateUser, middleware.validateNewRecord, (req, res, next) => {
	let controller = controllers[req.params.resource]
	controller.post(req.body)
	  .then(result => res.json({ result }))
	  .catch(err => {
			console.error(`Error post ${req.params.resource}: ${err}`);

			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}

			return errors.sendError.InternalError(msg, res)
		})
})

router.put('/:resource/:id/add', middleware.validateUser, (req, res, next) => {
	let { resource, id } = req.params;
	let controller = controllers[resource];

	return middleware.canModifyResource(req)
	  .then((results) => {
			let { canModify, doesRecordExist, details } = results;

			if (!doesRecordExist) {
				return errors.sendError.NotFoundError(null, res);
			}

			if (!canModify) {
				return errors.sendError.NotAuthorizedError('You do not have permission to modify this resource', res);
			}
			let prunedBody = middleware.prunePutBody(req.user, id, req.body, details)
			return controller.add(id, prunedBody)
		})
		.then((result) => res.json(result))
		.catch((err) => {
			console.error(`Error put ${resource}/${id}: ${err}`);

			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}

			return errors.sendError.InternalError(msg, res)
		});
})

router.put('/:resource/:id/remove', middleware.validateUser, (req, res, next) => {
	let { resource, id } = req.params;
	let controller = controllers[resource];

  return middleware.canModifyResource(req)
	  .then((results) => {
			let { canModify, doesRecordExist, details } = results;

			if (!doesRecordExist) {
				return errors.sendError.NotFoundError(null, res);
			}

			if (!canModify) {
				return errors.sendError.NotAuthorizedError('You do not have permission to modify this resource', res);
			}
			let prunedBody = middleware.prunePutBody(req.user, id, req.body, details)
			return controller.remove(id, prunedBody)
		})
		.then((result) => res.json(result))
		.catch((err) => {
			console.error(`Error put ${resource}/${id}: ${err}`);

			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}

			return errors.sendError.InternalError(msg, res)
		});
})

router.put('/:resource/:id', middleware.validateUser, (req, res, next) => {
	let { resource, id } = req.params
	let controller = controllers[resource];

	if (resource === 'events') {
		return errors.sendError.BadMethodError('Events cannot be modified!', res);
	}
	return middleware.canModifyResource(req)
	  .then((results) => {
			let { canModify, doesRecordExist, details } = results;

			if (!doesRecordExist) {
				return errors.sendError.NotFoundError(null, res);
			}

			if (!canModify) {
				return errors.sendError.NotAuthorizedError('You do not have permission to modify this resource', res);
			}
			let prunedBody = middleware.prunePutBody(req.user, id, req.body, details)
			return controller.put(id, prunedBody)
		})
		.then((result) => res.json(result))
		.catch((err) => {
			console.error(`Error put ${resource}/${id}: ${err}`);

			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}

			return errors.sendError.InternalError(msg, res)
		});
	})

router.delete('/:resource/:id', middleware.validateUser, (req, res, next) => {
	// for now delete not supported
	// add isTrashed?
	return errors.sendError.BadMethodError('Sorry, DELETE is not supported for this resource.', res);

	let { resource, id } = req.params;
  let controller = controllers[resource];

  controller.delete(id)
    .then(result => res.json(result))
    .catch(err => {
			console.error(`Error delete ${resource}/${id}: ${err}`);

			let msg = null;

			if (typeof err === 'string') {
				msg = err;
			}

			return errors.sendError.InternalError(msg, res)
		})
})

module.exports = router;
