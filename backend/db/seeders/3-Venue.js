'use strict';
const { Venue } = require('../models');
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
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: 'THE SPOT',
        city: 'THE BLOCK',
        state: 'COOLBOYUSA',
        lat: 10,
        lng: 10
      },
      {
        groupId: 2,
        address: 'THE SPOT2',
        city: 'THE BLOCK2',
        state: 'COOLBOYUSA2',
        lat: 20,
        lng: 20
      },
      {
        groupId: 3,
        address: 'THE SPOT3',
        city: 'THE BLOCK3',
        state: 'COOLBOYUSA3',
        lat: 30,
        lng: 30
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
