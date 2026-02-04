'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('devices', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      mobileInstanceId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      makeModel: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      trusted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      inAppOtpEnabled: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
    await queryInterface.addIndex('devices', ['id', 'userId', 'createdAt', 'updatedAt']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('devices');
  },
};
