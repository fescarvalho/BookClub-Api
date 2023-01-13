"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _models = require('../models');
var _sequelize = require('sequelize');

class SearchController {
  async get(req, res) {
    try {
      const { name } = req.query;
      const authors = await _models.Author.findAll({
        where: {
          name: {
            [_sequelize.Op.iLike]: `%${name}%`,
          },
        },
      });
      const books = await _models.Book.findAll({
        where: {
          name: {
            [_sequelize.Op.iLike]: `%${name}%`,
          },
        },
      });
      return res.json({ authors, books });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
exports. default = new SearchController();
