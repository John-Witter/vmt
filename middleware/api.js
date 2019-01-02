const utils = require('./utils/request');
const controllers = require('../controllers');
const _ = require('lodash');
const errors = require('../middleware/errors');
const helpers = require('../middleware/utils/helpers');
const models = require('../models');

const validateResource = (req, res, next) => {
  const resource = utils.getResource(req);
  if (_.isNil(controllers[resource])) {
    return errors.sendError.InvalidContentError('Invalid Resource', res);
  }
  next();
};

const validateId = (req, res, next) => {
  const id = utils.getParamsId(req);
  if (!utils.isValidMongoId(id)) {
    return errors.sendError.InvalidArgumentError('Invalid Resource Id', res);
  }
  next();
};

const validateUser = (req, res, next) => {
  console.log(req.file)
  console.log("BODY: ", req.body)
  req.body = JSON.parse(req.body)
  const user = utils.getUser(req);

  if (_.isNil(user)) {
    return errors.sendError.InvalidCredentialsError(null, res);
  }
  next();
  console.log('do we make it here?')
};

const canModifyResource = (req) => {
  let { id, resource } = req.params;
  let user = utils.getUser(req);

  let results = {
    canModify: false,
    doesRecordExist: true,
    details: {
      isCreator: false,
      isFacilitator: false,
      modelName: null,
    }
  };

  console.log(`${user.username} is requesting to update  ${resource} (${id}) with request body: ${req.body}`);

  let modelName = utils.getModelName(resource);
  results.details.modelName = modelName;

  let model = models[modelName];
  let schema = utils.getSchema(resource);
  return model.findById(id).populate('members.user', 'members.role').populate('room', 'creator members').populate('activity', 'creator').lean().exec()
    .then((record) => {
        if (_.isNil(record)) {
          // record requesting to be modified does not exist
          results.doesRecordExist = false;
          return results;
        }
        // user can modify if creator
        if (_.isEqual(user._id, record.creator)){
          results.canModify = true;
          results.details.isCreator = true;
          return results;
        }

        if (_.isArray(record.members)) {
          if (helpers.isUserFacilitatorInRecord(record, user._id)) {
            results.canModify = true;
            results.details.isFacilitator = true;
            return results;
          }
        }

        if (helpers.isNonEmptyObject(record.room)) {
          let roomCreator = record.room.creator;

          if (_.isEqual(user._id, roomCreator)) {
            results.canModify = true;
            results.details.isCreator = true;
            return results;
          }

          if (helpers.isUserFacilitatorInRecord(record.room, user._id)) {
            results.canModify = true;
            results.details.isFacilitator = true;
            return results;
          }
        }

        if (helpers.isNonEmptyObject(record.activity)) {
          let activityCreator = record.activity.creator;

          if (_.isEqual(user._id, activityCreator)) {
            results.canModify = true;
            results.details.isCreator = true;
            return results;
          }
        }

        if (modelName === 'Notification') {
          if (_.isEqual(user._id, record.toUser) || _.isEqual(user._id === record.fromUser)) {
            results.canModify = true;
            return results;
          }
        }

        if (modelName === 'User') {
          // users need to be able to request access to another user's room
          results.canModify = true;
          return results;
        }

        if (utils.schemaHasProperty(schema, 'entryCode')) {
          // currently users need to be able to make a put request to any room or course for the entry code
          results.canModify = true;
          return results;
        }
        return results;
    })
    .catch(err => {
      console.error(`Error canModifyResource: ${err}`);
      reject(err);
  });
};

const validateNewRecord = (req, res, next) => {
  let {user, body } = req;
  let { resource } = req.params;
  let model = utils.getModel(resource);
  let doc = new model(body);
  if (!_.hasIn(doc, 'validate')) {
    console.log("INVALID CONTENT ERROR")
    return errors.sendError.InvalidContentError(null, res);
  }

  doc.validate((err) => {
    if (err) {
      console.log('validation err', err);

      return errors.sendError.InvalidContentError(null, res);
    }

    next();

  })
};

const prunePutBody = (user, recordIdToUpdate, body, details) => {
  if (!helpers.isNonEmptyObject(details)) {
    details = {};
  }
  let { isCreator, isFacilitator, modelName } = details;

  let copy = Object.assign({}, body);
  if (modelName === 'User') {
    let isUpdatingSelf = _.isEqual(user._id, recordIdToUpdate);
    if (!isUpdatingSelf) {
      // can only modify another user's notifications
      return _.pick(copy, 'notificationType', 'resource', 'user', '_id', 'courseNotifications.access', 'roomNotifications.access');
    }
    // username and password uneditable currently
    delete copy.username;
    delete copy.password;
    return copy;
  }

  if (modelName === 'Room') {
    if (!isCreator && !isFacilitator) {
      // graphImage? tempRoom?
      return _.pick(copy, ['graphImage','checkAccess', 'tempRoom']);
    }
    return copy;
  }

  if (modelName === 'Course') {
    if (!isCreator && !isFacilitator) {
      return _.pick(copy, 'checkAccess');
    }
    return copy;
  }
  // TODO: determine editable fields for other models
  return copy;
}

const uploadFile = (req, res, next) => {
  console.log(req.body)
  next();
}

module.exports.validateResource = validateResource;
module.exports.validateId = validateId;
module.exports.validateUser = validateUser;
module.exports.canModifyResource = canModifyResource;
module.exports.validateNewRecord = validateNewRecord;
module.exports.prunePutBody = prunePutBody;
module.exports.uploadFile = uploadFile;