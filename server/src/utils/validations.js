import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'неверный формат почты').isEmail(),
  body('password', 'пароль должен быть минимум 5 символов').isLength({
    min: 3,
    max: 30,
  }),
  body('fullName', 'укажите имя min:3 max:30 символов').isLength({
    min: 3,
    max: 30,
  }),
  body('avatarUrl', 'неверная ссылка на аватарку').optional().isURL(),
];
export const loginValidator = [
  body('email', 'неверный формат почты').isEmail(),
  body('password', 'пароль должен быть минимум 5 символов').isLength({
    min: 3,
    max: 30,
  }),
];

export const postCreateValidator = [
  body('title', 'введите заголовок статьи')
    .isLength({ min: 3, max: 100 })
    .isString(),
  body('text', 'введите текст статьи')
    .isLength({ min: 3, max: 3000 })
    .isString(),
  body('tags', 'неверный формат тегов').optional().isArray(),
  body('imageUrl', 'неверная ссылка на изображение').optional().isString(),
];
