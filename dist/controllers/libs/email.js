"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _nodemailjet = require('node-mailjet'); var _nodemailjet2 = _interopRequireDefault(_nodemailjet);

const mailjet = _nodemailjet2.default.apiConnect(process.env.MAIL_APIKEY_PUBLIC, process.env.MAIL_SECRET_KEY);

class Mail {
  async sendForgotPasswordMail(email, name, token) {
    try {
      const result = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "fescarvalho94@gmail.com",
              Name: "Esqueceu sua senha",
            },
            To: [
              {
                Email: email,
                Name: name,
              },
            ],
            TemplateID: 4490737,
            TemplateLanguage: true,
            Subject: "Alteração de Senha",
            Variables: {
              name: name,
              token: token,
            },
          },
        ],
      });
      return result;
    } catch (error) {
      return { error };
    }
  }
}
exports. default = new Mail();
