'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.changeColumn('devices', 'createdBy', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('devices', 'updatedBy', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.changeColumn('devices', 'createdBy', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('devices', 'updatedBy', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
