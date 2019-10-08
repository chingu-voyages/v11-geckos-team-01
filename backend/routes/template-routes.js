const express = require('express');

const requireLogin = require('../middleware/require-login.js');
const Template = require('../models/template.js');

const templateRoutes = express.Router();

/**
 * Get All Templates
 */
templateRoutes.get('/', requireLogin(), async (req, res) => {
  const templates = await Template.find({ id: req.user.id });

  res.send(templates);
});

templateRoutes.post('/', requireLogin(), async (req, res) => {
  const template = new Template(req.body);
  const { user } = req;

  template.userId = user._id;

  console.log('[templates POST]', template);

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

module.exports = templateRoutes;
