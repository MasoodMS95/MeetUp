'use strict';
const { Group } = require('../models');
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
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'Cool Boys Club',
        about: 'We party.',
        type: 'Online',
        private: false,
        city: 'Bay Area',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: 'Poets Club',
        about: 'Club for poetry.',
        type: 'Online',
        private: false,
        city: 'Atlanta',
        state: 'Georgia'
      },
      {
        organizerId: 3,
        name: 'Golf Club',
        about: 'We like to golf.',
        type: 'In person',
        private: true,
        city: 'Baryville',
        state: 'Maryland'
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
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['Online', 'In person'] }
    }, {});
  }
};
