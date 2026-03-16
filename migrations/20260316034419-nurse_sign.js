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
    await queryInterface.createTable("nurse_sign", {
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
      nurse_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      nurse_sign: { allowNull: true, type: Sequelize.BLOB },
      nurse_sign_date: { allowNull: true, type: Sequelize.DATE },
      flag_status: {
        defaultValue: "a",
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
    await queryInterface.dropTable("nurse_sign");
  },
};
