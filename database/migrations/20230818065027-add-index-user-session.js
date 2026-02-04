'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addIndex('user_sessions', ['deviceId']),
      queryInterface.addIndex('user_sessions', {
        fields: [
          {
            name: 'accessToken',
            length: 255,
          },
        ],
      }),
      queryInterface.addIndex('user_sessions', ['userId']),
      queryInterface.addIndex('user_sessions', ['id']),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeIndex('user_sessions', ['deviceId']),
      queryInterface.removeIndex('user_sessions', ['accessToken']),
      queryInterface.removeIndex('user_sessions', ['userId']),
      queryInterface.removeIndex('user_sessions', ['id']),
    ]);
  },
};
