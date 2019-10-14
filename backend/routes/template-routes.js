const express = require('express');

const requireLogin = require('../middleware/require-login.js');
const Template = require('../models/template.js');
const generateJSON = require('../utils');

const templateRoutes = express.Router();

/**
 * Get All Templates
 */
templateRoutes.get('/', requireLogin(), async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const templates = await Template.find({ userId: req.user._id });

  res.send(templates);
});

templateRoutes.get('/json/:id', async (req, res) => {
  const templateId = req.params.id;
  const templates = await Template.find({ _id: templateId });

  try {
    console.log(templates);
    res.status(200).json(templates);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
  res.sendStatus(400);
});

templateRoutes.post('/', requireLogin(), async (req, res, next) => {
  const template = new Template(req.body);
  const { user } = req;

  // eslint-disable-next-line no-underscore-dangle
  template.userId = user._id;

  if (template) {
    try {
      const savedData = await template.save();

      return res.send(savedData);
    } catch (error) {
      return next(error);
    }
  }

  return res.sendStatus(422);
});

templateRoutes.put('/:id', requireLogin(), async (req, res, next) => {
  const updateTemplate = req.body;
  const templateId = req.params.id;

  try {
    const saved = await Template.updateOne({ _id: templateId }, updateTemplate);
    const template = await Template.findOne({ _id: templateId });

    if (saved) {
      return res.status(200).json(template);
    }

    return res.sendStatus(500);
  } catch (error) {
    return next(error);
  }
});

templateRoutes.get('/:id', async (req, res, next) => {
  const templateId = req.params.id;

  try {
    const template = await Template.findById(templateId);

    if (template) {
      return res.status(200).json(template);
    }

    return res.statusCode(404);
  } catch (error) {
    return next(error);
  }
});

templateRoutes.delete('/:id', async (req, res, next) => {
  const templateId = req.params.id;

  try {
    const template = await Template.deleteOne({ _id: templateId });

    if (template) {
      return res.status(200).send('Template Deleted');
    }

    return res.statusCode(404);
  } catch (error) {
    return next(error);
  }
});

module.exports = templateRoutes;
