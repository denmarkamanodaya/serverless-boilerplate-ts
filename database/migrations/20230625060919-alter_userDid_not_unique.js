'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    Promise.all([
      queryInterface.changeColumn('users', 'userDid', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      }),
    ]);

    return Promise.all([queryInterface.removeIndex('users', 'userDid')]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
