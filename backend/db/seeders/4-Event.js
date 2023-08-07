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
        name: "After Hours Rave",
        description: "A late night rave going until we're asked to leave.",
        type: "Online",
        capacity: 120,
        price: 6,
        startDate: "2025-01-01T21:00:00",
        endDate: "2022-01-02T05:00:00"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Poetry Slam",
        description: "Snapping the night away with friends.",
        type: "In person",
        capacity: 40,
        price: 14,
        startDate: "2022-02-01T18:00:00",
        endDate: "2022-02-02T23:00:00"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Golf Tournament",
        description: "We're getting into all sorts of shenanigans out here. We do all sorts of things like such as that and this and then we do that as well.",
        type: "In person",
        capacity: 3,
        price: 3,
        startDate: "2022-03-03",
        endDate: "2022-03-03"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Pier Party",
        description: "We're getting into all sorts of shenanigans out here. We do all sorts of things like such as that and this and then we do that as well.",
        type: "In person",
        capacity: 32,
        price: 3,
        startDate: "2024-03-03T18:00:00",
        endDate: "2025-03-03T05:00:00"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Shenanigans and Mistakes THE PAST",
        description: "We're getting into all sorts of shenanigans out here. We do all sorts of things like such as that and this and then we do that as well.",
        type: "In person",
        capacity: 3,
        price: 3,
        startDate: "2020-03-03T18:00:00",
        endDate: "2025-03-03T05:00:00"
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
