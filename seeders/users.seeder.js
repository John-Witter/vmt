/*
 * We are using mongoose-data-seed to seed our test database
 * The data below has been fitlered using the function found in server/db_migration/filter-mongo.js
 * To use mongoose-data-seed you must provide the schema to be used for the test data
 * Then when you run md-seed run it will populate the database with the provide data referencing the schema
 */

var Seeder = require('mongoose-data-seed').Seeder;
var User = require('../models/User')

var data = [
  {
  "_id": "5ba289ba7223b9429888b9b4",
  "notifications": [],
  "courseTemplates": [],
  "courses": [
    // "5bbb82f72539b95500cf526e",  // THESE WILL BE ADDED TO THIS USER WHEN THEY'RE CREATED BECAUSE COURSE AND ROOM HAVE A PRE SAVE HOOK THAT UPDATES THE USERS
    // "5bbf4e5ec1b6d84cb0a4ded8",
    // "5bbb82f72539b95500cf526a",
    // "5bbf4e5ec1b6d84cb0a4ded3",
  ],
  "rooms": [
    // "5ba289c57223b9429888b9b3",
    // "5ba289c57223b9429888b9b5",
    // "5ba289c57223b9429888b9b6",
    // "5ba289c57223b9429888b9b7",
  ],
  "activities": [],
  "isAdmin": false,
  "seenTour": false,
  "username": "jl-picard",
  "email": "",
  "firstName": "jean-luc",
  "lastName": "picard",
  "password": "$2b$12$xI0a6mVLlVoFYeVsmU2XrOVowVVphu9ORSD9EVHG6lzWMvfP8cgES",
  "accountType": "facilitator",
  "__v": 2
  },
  {
    "_id": "5bbbbd9a799302265829f5af",
    "notifications": [],
    "courseTemplates": [],
    "courses": ["5bbf4e5ec1b6d84cb0a4ded8"],
    "rooms": ["5ba289c57223b9429888b9b6"],
    "activities": [],
    "isAdmin": false,
    "seenTour": false,
    "username": "g-laforge",
    "email": "",
    "firstName": "Geordi",
    "lastName": "Laforge",
    "password": "$2b$12$YNI6y1M6u4/Y4mAP.E312OYN./uTIJqKGfUREnhNJ8vs8t/4hbAua",
    "accountType": "participant",
  },{
    "_id": "5be1eba75854270cd0920fb8",
    "notifications": [],
    "courseTemplates": [],
    "courses": ["5bbf4e5ec1b6d84cb0a4ded8"],
    "rooms": [],
    "activities": [],
    "isAdmin": false,
    "seenTour": false,
    "username": "data",
    "email": "data@example.com",
    "firstName": "NFN/NMI",
    "lastName": "data",
    "password": "$2b$12$Kzr5WEtkOzsCG9LS5fd8G.HVjUk4xp3p/wdzDNB/B5CEWB.oBKEji",
    "accountType": "participant",
  },
  {
    "_id": "5be1eba75854270cd0920fa9",
    "notifications": [],
    "courseTemplates": [],
    "courses": ["5bbf4e5ec1b6d84cb0a4ded8"],
    "rooms": [],
    "activities": [],
    "isAdmin": false,
    "seenTour": false,
    "username": "worf",
    "email": "worf@example.com",
    "firstName": "worf",
    "lastName": "son of Mogh",
    "password": "$2b$12$jNGkh.0hKAN1BRPUjScjCOE17yO9SkOV6rLdIO6DhAMsHQM28nfJi",
    "accountType": "facilitator",
  },
  {
    "_id": "5be1eba75854270cd0920faa",
    "notifications": [],
    "courseTemplates": [],
    "courses": ["5c2e58db684f328cbca1d995", "5c2e58db684f328cbca1d999"],
    "rooms": ["5c2e58e4684f328cbca1d997", "5c2e58e4684f328cbca1d99f", "5c2e58e4684f328cbca1d99e"],
    "activities": ["5c2e58e9684f328cbca1d99b", "5c2e58e9684f328cbca1d99c", "5c2e58e9684f328cbca1d99a"],
    "isAdmin": false,
    "seenTour": false,
    "username": "D-troi",
    "email": "worf@example.com",
    "firstName": "Deanna",
    "lastName": "Troi",
    "password": "$2b$12$PltCtaDCtpD.WakNZ8GUmOfX7kcisuA.PbGLM6HKGAdrkhuIQMzAy",
    "accountType": "facilitator",
  },
  {
    "_id" : "5c531f091748c7196496a556",
    "courseTemplates" : [],
    "courses" : [],
    "rooms" : [],
    "activities" : [],
    "notifications" : [],
    "bothRoles" : false,
    "isAdmin" : false,
    "seenTour" : false,
    "isTrashed" : false,
    "username" : "bcrush",
    "email" : "bcrush@gmail.com",
    "firstName" : "Beverly",
    "lastName" : "Crusher",
    "password" : "$2b$12$Ptcu.r3bhFyE/mrtxAbqO.jGVm7MsoNQLv5XmSC/hXSt.oWPHdXha",
    "accountType" : "participant",
}
];

var UsersSeeder = Seeder.extend({
  shouldRun: function () {
    return User.count().exec().then(count => count === 0);
  },
  run: function () {
    return User.create(data);
  },
});

module.exports = UsersSeeder;
