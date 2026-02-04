'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('devices', 'accessCode', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await Promise.all([queryInterface.removeColumn('devices', 'accessCode')]);
  },
};
