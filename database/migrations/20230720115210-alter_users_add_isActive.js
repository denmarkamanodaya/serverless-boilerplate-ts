'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await Promise.all([queryInterface.removeColumn('users', 'isActive')]);
  },
};
