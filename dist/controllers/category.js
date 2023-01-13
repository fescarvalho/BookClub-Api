"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _models = require('../models');
class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await _models.Category.findAll({
        order: [["name", "ASC"]],
      });
      return res.json({ categories });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

exports. default = new CategoryController();
