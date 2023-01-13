"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

exports. default = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Invalid token." });
  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    const decoded = _jsonwebtoken2.default.verify(token, process.env.JWT_HASH);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};
