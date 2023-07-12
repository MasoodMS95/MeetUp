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
        name: 'Cool Boys Clubbbbbb',
        about: 'We be doing some coo ah ish bruh fr ong no cap',
        type: 'Online',
        private: false,
        city: 'The block',
        state: 'COOLBOYUSA'
      },
      {
        organizerId: 2,
        name: 'Lame Boys Clubbbbbb',
        about: 'We be doing some lame ah ish bruh fr ong no cap',
        type: 'Online',
        private: false,
        city: 'The block',
        state: 'LAMEBOYUSA'
      },
      {
        organizerId: 3,
        name: 'Shenanigans Boys Clubbbbbb',
        about: 'We be doing some Shenanigans ah ish bruh fr ong no cap',
        type: 'In person',
        private: true,
        city: 'The block',
        state: 'SHENANIGANUSA'
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
