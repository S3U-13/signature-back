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
    await queryInterface.createTable("viewed_at", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      staff_viewed_at: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: "unread",
      },
      nurse_viewed_at: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: "unread",
      },
      doctor_viewed_at: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: "unread",
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
    await queryInterface.dropTable("viewed_at");
  },
};
