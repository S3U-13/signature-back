"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("pdf", "checksum", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("pdf", "version", {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });

    await queryInterface.addColumn("pdf", "storage_type", {
      type: Sequelize.STRING,
      defaultValue: "blob",
    });

    // await queryInterface.addColumn("pdf", "file_path", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("pdf", "checksum");
    await queryInterface.removeColumn("pdf", "version");
    await queryInterface.removeColumn("pdf", "storage_type");
    await queryInterface.removeColumn("pdf", "file_path");
  },
};
