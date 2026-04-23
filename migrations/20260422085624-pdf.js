"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pdf", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      form_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // 🔥 เก็บไฟล์จริงใน DB
      file_data: {
        type: Sequelize.BLOB("long"), // long = รองรับไฟล์ใหญ่
        allowNull: false,
      },

      mime_type: {
        type: Sequelize.STRING,
        defaultValue: "application/pdf",
      },

      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "active",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pdf");
  },
};
