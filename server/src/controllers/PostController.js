import jwt from 'jsonwebtoken';
import PostSchema from '../schemas/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostSchema.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 3);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostSchema.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostSchema.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'не удалось',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostSchema.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    console.log(doc);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'не удалось',
    });
  }
};
