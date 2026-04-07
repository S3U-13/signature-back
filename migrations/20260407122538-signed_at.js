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
    await queryInterface.createTable("signed_at", {
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
      staff_signed_at: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: "unsigned",
      },
      nurse_signed_at: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: "unsigned",
      },
      doctor_signed_at: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: "unsigned",
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
    await queryInterface.dropTable("signed_at");
  },
};
