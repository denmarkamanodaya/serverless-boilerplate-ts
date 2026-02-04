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
      queryInterface.addColumn('users', 'salt', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'password', {
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
    return await Promise.all([
      queryInterface.removeColumn('users', 'password'),
      queryInterface.removeColumn('users', 'salt'),
    ]);
  },
};
