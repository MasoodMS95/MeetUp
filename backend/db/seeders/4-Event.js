'use strict';
const { Event } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "Cool Boys Doing Cool Things",
        description: "We're cool boys who like to do cool things. We do all sorts of things like such as that and this and then we do that as well.",
        type: "Online",
        capacity: 1,
        price: 1,
        startDate: "2022-01-01",
        endDate: "2022-01-02"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Lame Boys Doing Lame Things",
        description: "We're lame boys who like to do lame things. We do all sorts of things like such as that and this and then we do that as well.",
        type: "Online",
        capacity: 2,
        price: 2,
        startDate: "2022-02-01",
        endDate: "2022-02-02"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Shenanigans and Mistakes",
        description: "We're getting into all sorts of shenanigans out here. We do all sorts of things like such as that and this and then we do that as well.",
        type: "In person",
        capacity: 3,
        price: 3,
        startDate: "2022-03-03",
        endDate: "2022-03-03"
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['Online', 'In person'] }
    }, {});
  }
};
