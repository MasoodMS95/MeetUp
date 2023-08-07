'use strict';
const { GroupImage } = require('../models');
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
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://cdn.discordapp.com/attachments/1137540999300796577/1137541011401355394/https3A2F2Fhypebeast.png',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://cdn.discordapp.com/attachments/1137540999300796577/1138073301848182944/thepoetryclublogographitesmaller.png',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://cdn.discordapp.com/attachments/1137540999300796577/1138073647806947400/6398d3f5f0c5330018dc1dff.png',
        preview: true
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [true, false] }
    }, {});
  }
};
