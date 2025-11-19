"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("form_value", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_type_code: {
        allowNull: true,
        type: Sequelize.STRING(5),
      },
      hn: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      pat_sign_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      witness_sign_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      staff_sign_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_sign_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      relation: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      diseuse: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      consent: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      flag_status: {
        allowNull: true,
        defaultValue: "a",
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

    await queryInterface.createTable("pat_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hn: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      patient_sign: {
        allowNull: true,
        type: Sequelize.BLOB,
      },
      patient_sign_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      flag_status: {
        allowNull: true,
        defaultValue: "a",
        type: Sequelize.STRING(1),
      },
    });

    await queryInterface.createTable("witness_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      witness_name: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      witness_sign: {
        allowNull: true,
        type: Sequelize.BLOB,
      },
      witness_sign_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      flag_status: {
        allowNull: true,
        defaultValue: "a",
        type: Sequelize.STRING(1),
      },
    });

    await queryInterface.createTable("staff_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      staff_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      staff_position: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      staff_sign: {
        allowNull: true,
        type: Sequelize.BLOB,
      },
      staff_sign_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      flag_status: {
        allowNull: true,
        defaultValue: "a",
        type: Sequelize.STRING(1),
      },
    });

    await queryInterface.createTable("doctor_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctor_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_sign: {
        allowNull: true,
        type: Sequelize.BLOB,
      },
      doctor_sign_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      flag_status: {
        allowNull: true,
        defaultValue: "a",
        type: Sequelize.STRING(1),
      },
    });

    await queryInterface.createTable("allergies", {
      id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      allergy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      asthma: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      kidney_disease: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      diabetes: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      heart_disease: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      contrast_before: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      contrast_allergy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      contrast_allergy_detail: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      seafood_allergy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      seafood_allergy_detail: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      drug_allergy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      drug_allergy_detail: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lmp: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      flag_status: {
        allowNull: true,
        defaultValue: "a",
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
    await queryInterface.dropTable("form_value");
    await queryInterface.dropTable("pat_sign");
    await queryInterface.dropTable("witness_sign");
    await queryInterface.dropTable("staff_sign");
    await queryInterface.dropTable("doctor_sign");
    await queryInterface.dropTable("allergies");
  },
};
