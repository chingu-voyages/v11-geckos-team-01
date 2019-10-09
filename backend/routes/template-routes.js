const express = require('express');

const requireLogin = require('../middleware/require-login.js');
const Template = require('../models/template.js');

const templateRoutes = express.Router();

/**
 * Get All Templates
 */
templateRoutes.get('/', requireLogin(), async (req, res) => {
  const templates = await Template.find({ userId: req.user.id });

  res.send(templates);
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

    if (saved) {
      return res.sendStatus(200);
    }

    return res.sendStatus(500);
  } catch (error) {
    return next(error);
  }
});

module.exports = templateRoutes;
