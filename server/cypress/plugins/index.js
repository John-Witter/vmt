// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const mongoose = require('mongoose');
// const models = require('../../models');
// const room = require('../fixtures/room');

// const data = [
//   {
//     model: 'Room',
//     documents: [room],
//   },
// ];

const { seed } = require('../../seeders/seed');
const restore = require('../restore');

const dropDb = (uri) => {
  return mongoose
    .createConnection(uri)
    .asPromise()
    .then((db) => {
      db.dropDatabase();
    })
    .catch(console.log);
};

const encDbUri = 'mongodb://localhost:27017/encompass_seed';
const vmtDbUri = 'mongodb://localhost:27017/vmt-test';
const ssoDbUri = 'mongodb://localhost:27017/mtlogin_test';

module.exports = (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    clearDB: () => {
      return Promise.all([
        dropDb(encDbUri),
        dropDb(vmtDbUri),
        dropDb(ssoDbUri),
      ]).then(() => {
        return 'success';
      });
    },
    seedDBLogin: () => {
      return new Promise((resolve, reject) => {
        return seed(['users'])
          .then(() => {
            resolve('success');
          })
          .catch((err) => reject(err));
      });
    },
    seedDB: () => {
      return new Promise((resolve, reject) => {
        return seed()
          .then(() => {
            resolve('success');
          })
          .catch((err) => reject(err));
      });
    },
    restoreAll: () => {
      // drops and restore all 3 of vmt, enc, sso dbs
      return restore.prepTestDb();
    },

    dropEnc: () => {
      return dropDb(encDbUri).then(() => {
        return 'success';
      });
    },
    restoreEnc: () => {
      return restore.restoreEnc().then(() => {
        return 'success';
      });
    },
    // disconnect : () => {
    //   return new Promise((resolve, reject) => {
    //     exec('taskkill /f /im node.exe')
    //   })
    // }
  });
};
