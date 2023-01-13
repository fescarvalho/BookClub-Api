"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _dotenv = require('dotenv'); var dotenv = _interopRequireWildcard(_dotenv);
dotenv.config();
var _models = require('./models'); var _models2 = _interopRequireDefault(_models);
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);

const app = _express2.default.call(void 0, );

app.use(_express2.default.json());
app.use(_routes2.default);

app.listen(3333, async () => {
  try {
    await _models2.default.sequelize.authenticate();
  } catch (error) {
    console.error(error.message);
  }
});
