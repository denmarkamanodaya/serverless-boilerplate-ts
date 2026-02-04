'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('user_sessions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      accessToken: {
        type: Sequelize.TEXT({ length: 'medium' }),
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      deviceId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      isValid: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      issuedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expiryAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      kmsKeyArn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('user_sessions', ['id', 'userId', 'deviceId']);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('user_sessions');
  },
};
