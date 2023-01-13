import { User } from "../models";
import { differenceInHours } from "date-fns";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Mail from "../controllers/libs/email";
import UploadImage from "./libs/uploadimage";

class UserControllers {
  async login(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Email is invalid.").required("Email is mandatory."),
        password: Yup.string().required("Password is mandatory."),
      });
      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(401).json({ error: "User not found." });

      const checkPassword = await bcrypt.compare(req.body.password, user.password_hash);
      if (!checkPassword) return res.status(401).json({ error: "Email or password do not match." });

      const token = jwt.sign({ id: user.id }, process.env.JWT_HASH, {
        expiresIn: 2592000, //30 dias
      });
      const { id, name, email, avatar_url, createdAt } = user;
      return res.json({
        user: [id, name, email, avatar_url, createdAt, token],
      });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Name is mandatory.")
          .min(3, "Name must be at least 3 characters."),
        email: Yup.string().email("Email is invalid.").required("Email is mandatory."),
        password: Yup.string()
          .required("Password is mandatory.")
          .min(6, "Password must be at least 6 characters."),
      });

      await schema.validate(req.body);
      const existedUser = await User.findOne({ where: { email: req.body.email } });
      if (existedUser) return res.status(404).json({ error: "User already exists." });

      const hashPassword = await bcrypt.hash(req.body.password, 8);
      const user = new User({
        ...req.body,
        password: "",
        password_hash: hashPassword,
      });

      await user.save();

      return res.json({ user });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3, "Name must be at least 3 characters."),
        email: Yup.string().email("Email is invalid."),
        password: Yup.string().min(6, "Password must be at least 6 characters."),
      });

      await schema.validate(req.body);
      const { name, email, password } = req.body;
      const user = await User.findByPk(req.userId);

      if (!user) return res.status(404).json({ eroor: "User not found." });
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        user.password_hash = await bcrypt.hash(req.body.password, 8);
      }
      await user.save();

      return res.json({ user });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async updateAvatar(req, res) {
    try {
      const schema = Yup.object().shape({
        base64: Yup.string().required("Base64 is mandatory."),
        mime: Yup.string().required("Mime is mandatory."),
      });

      await schema.validate(req.body);
      const { base64, mime } = req.body;
      const user = await User.findByPk(req.userId);

      if (!user) return res.status(404).json({ error: "User not found." });

      if (user.avatar_url) {
        const splitted = user.avatar_url.split("/");
        const oldKey = splitted[splitted.length - 1];
        const deleteResponse = await UploadImage.delete(oldKey);

        if (deleteResponse.error) return res.status(500).json({ error: deleteResponse });
      }
      const key = `user_${user.id}_${new Date().getTime()}`;
      const response = await UploadImage.upload(key, base64, mime);

      if (response?.error) return res.status(400).json({ error: "Error to upload image." });

      user.avatar_url = response.Location;
      await user.save();
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
  async get(req, res) {
    try {
      if (!req.userId) {
        return res.status(400).json({ error: "Id not found." });
      }

      const user = await User.findOne({ where: { id: Number(req.userId) } });
      if (!user) return res.status(404).json({ error: "User not found." });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
  async forgotPassword(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Email is invalid.").required("Email is mandatory."),
      });
      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) return res.status(404).json({ error: "User not found." });

      const reset_password_token_sent_at = new Date();
      const token = Math.random().toString().slice(2, 8);
      const reset_password_token = await bcrypt.hash(token, 8);

      await user.update({
        reset_password_token_sent_at,
        reset_password_token,
      });

      const { email, name } = user;

      const mailResult = await Mail.sendForgotPasswordMail(email, name, token);
      if (!mailResult) return res.status(404).json({ error: "Email dont send." });

      return res.json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  async resetPassword(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Email is invalid.").required("Email is mandatory."),
        token: Yup.string().required("Toke is mandatory."),
        password: Yup.string()
          .required("Password is mandatory.")
          .min(6, "Password must be at least 6 characters."),
      });

      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) return res.status(401).json({ error: "User not found." });
      if (!user.reset_password_token && !user.reset_password_token_sent_at)
        return res.status(401).json({ error: "Password change not requested." });

      const hoursDifferent = differenceInHours(new Date(), user.reset_password_token_sent_at);

      if (hoursDifferent > 3) return res.status(401).json({ error: "Token expired." });

      const checkToken = await bcrypt.compare(req.body.token, user.reset_password_token);
      if (!checkToken) return res.status(401).json({ error: "Token Invalid." });

      const password_hash = await bcrypt.hash(req.body.password, 8);
      await user.update({
        password_hash,
        reset_password_token: null,
        reset_password_token_sent_at: null,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UserControllers();
