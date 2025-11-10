"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("form_type", {
      code: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(5),
      },
      form_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      flag_active: {
        allowNull: true,
        defaultValue: "y",
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
    await queryInterface.createTable("choice_type", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      flag_active: {
        allowNull: true,
        defaultValue: "y",
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
    await queryInterface.createTable("choice", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      choice_type_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      choice_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      choice_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      flag_active: {
        allowNull: true,
        defaultValue: "y",
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
    await queryInterface.dropTable("form_type");
  },
};
