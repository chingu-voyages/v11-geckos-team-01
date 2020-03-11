
import { generateItems } from '../../client/src/shared';

const express = require('express');

const JsonSchema = require('../models/jsonSchema.js');

const jsonRoutes = express.Router();

jsonRoutes.get('/:id', async (req, res) => {
  const templateId = req.params.id;

  const { _doc } = await JsonSchema.findOne({ _id: templateId });
  try {
    const { quantity, jsonSchema } = _doc;

    const data = generateItems(quantity, JSON.parse(jsonSchema));

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = jsonRoutes;
