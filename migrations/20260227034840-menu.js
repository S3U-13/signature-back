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
    await queryInterface.createTable("head_menu", {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      head_menu_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      head_menu_group: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      flag_status: {
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

    await queryInterface.createTable("menu", {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      head_menu_id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      menu_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      menu_path: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      menu_path: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      menu_role: {
        allowNull: true,
        type: Sequelize.STRING(30),
      },
      menu_status: {
        allowNull: true,
        type: Sequelize.STRING(10),
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
  },
};
