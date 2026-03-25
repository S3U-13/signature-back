"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("username", {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      userid: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password1: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      password2: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      active: {
        defaultValue: "A",
        allowNull: true,
        type: Sequelize.STRING(1),
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.dropTable("username");
  },
};
