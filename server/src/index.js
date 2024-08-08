import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { UserController, PostController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

import {
  loginValidator,
  registerValidator,
  postCreateValidator,
} from './utils/validations.js';

dotenv.config();
const port = process.env.PORT || 4444;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('hello pepikus');
});

app.get('/auth/users', UserController.getUsers);

app.post(
  '/auth/register',
  registerValidator,
  handleValidationErrors,
  UserController.register
);

app.post(
  '/auth/login',
  loginValidator,
  handleValidationErrors,
  UserController.login
);
app.get('/auth/me', checkAuth, UserController.getMe);
app.delete('/auth/destroy', UserController.destroy);

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.post(
  '/posts',
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`http://localhost:${port}`);

  mongoose
    .connect(process.env.MONGODB_URI)
    .then((response) => console.log('connection'))
    .catch((error) => console.log('error'));
});
