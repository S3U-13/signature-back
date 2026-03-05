"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("form", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_type_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      hn: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      disease: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lmp: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      consent: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      staff_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      nurse_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      form_status: {
        allowNull: true,
        defaultValue: "Pending",
        type: Sequelize.STRING(15),
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

    await queryInterface.createTable("patient_contacts", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      relation: {
        allowNull: true,
        type: Sequelize.STRING,
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
      form_id: {
        allowNull: true,
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
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("witness_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
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
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("staff_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
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
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("doctor_sign", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
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
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("congenital_disease", {
      id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      condition_id: {
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

    await queryInterface.createTable("contrast_history_status", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      contrast_history_id: {
        allowNull: false,
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
    await queryInterface.createTable("contrast_allergy_status", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      contrast_allergy_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      contrast_allergy_symptom: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.createTable("seafood_allergy_status", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      seafood_allergy_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      seafood_allergy_symptom: {
        allowNull: true,
        type: Sequelize.STRING,
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

    await queryInterface.createTable("drug_allergy_status", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      drug_allergy_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      drug: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.createTable("drug_allergy_status", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      form_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      drug_allergy_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      drug: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("form");
    await queryInterface.dropTable("patient_contacts");
    await queryInterface.dropTable("congenital_disease");
    await queryInterface.dropTable("contrast_history_status");
    await queryInterface.dropTable("contrast_allergy_status");
    await queryInterface.dropTable("seafood_allergy_status");
    await queryInterface.dropTable("drug_allergy_status");
    await queryInterface.dropTable("pat_sign");
    await queryInterface.dropTable("witness_sign");
    await queryInterface.dropTable("staff_sign");
    await queryInterface.dropTable("doctor_sign");
  },
};
