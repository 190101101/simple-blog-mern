import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import UserSchema from '../schemas/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const doc = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      password: hashPassword,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign({ _id: user._id }, 'token', { expiresIn: '30d' });
    const { password, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'не удалось зарегистрироваться',
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserSchema.find({});
    console.log(users);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось',
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = await UserSchema.findOne({ email: req.body.email });

    if (!user) {
      return res.status(403).json({
        message: 'пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );

    if (!isValidPass) {
      return res.status(403).json({
        message: 'не верный логин или пароль',
      });
    }

    const token = jwt.sign({ _id: user._id }, 'token', { expiresIn: '30d' });
    const { password, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'пользователь не найден',
      });
    }
    const { password, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (error) {
    res.status(500).json({ message: 'нет доступа' });
  }
};

export const destroy = async (req, res) => {
  UserSchema.deleteMany({}).then((r) => {
    console.log(r);
  });
  res.json({ message: 'deleted' });
};
