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
    await queryInterface.createTable("form_actions", {
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
      userid: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctorid: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      role: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      viewed_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      signed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      lock: {
        type: Sequelize.STRING(1),
        allowNull: true,
        defaultValue: "n",
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
    await queryInterface.dropTable("form_actions");
  },
};
