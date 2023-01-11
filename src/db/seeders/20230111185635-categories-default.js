"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Categories", [
      {
        name: "Ficção",
        highlighted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Romance",
        highlighted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Terror",
        highlighted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Comédia",
        highlighted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Negócios",
        highlighted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Suspense",
        highlighted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
