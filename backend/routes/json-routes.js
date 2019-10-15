const express = require('express');

const Template = require('../models/template.js');

const jsonRoutes = express.Router();

const generateJSON = require('../utils');

jsonRoutes.get('/:id', async (req, res) => {
  const templateId = req.params.id;
  const { _doc } = await Template.findOne({ _id: templateId });
  try {
    const { template } = _doc;
    const data = generateJSON(JSON.parse(template));
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = jsonRoutes;
