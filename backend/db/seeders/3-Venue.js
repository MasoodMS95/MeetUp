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
        address: 'CoolBoyHQ',
        city: 'N/A',
        state: 'N/A',
        lat: 10,
        lng: 10
      },
      {
        groupId: 2,
        address: '342 West Palm Street',
        city: 'Atlanta',
        state: 'Georgia',
        lat: 20,
        lng: 20
      },
      {
        groupId: 3,
        address: '2495 Yard Street',
        city: 'THE Baryville',
        state: 'Maryland',
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
