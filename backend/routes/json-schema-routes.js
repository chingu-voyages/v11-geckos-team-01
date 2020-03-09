const express = require('express');

const requireLogin = require('../middleware/require-login.js');
const JsonSchema = require('../models/jsonSchema.js');

const schemaRoutes = express.Router();

/**
 * Get All JsonSchemas
 */
schemaRoutes.get('/', requireLogin(), async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  let jsonSchema
  try {
    jsonSchemas = await JsonSchema.find({ userId: req.user._id });
  } catch (e) {
    console.error(e);
  }
  res.send(jsonSchemas);
});

schemaRoutes.post('/', requireLogin(), async (req, res, next) => {
  const jsonSchemas = new JsonSchema(req.body);
  const { user } = req;

  // eslint-disable-next-line no-underscore-dangle
  jsonSchemas.userId = user._id;

  if (jsonSchemas) {
    try {
      const savedData = await jsonSchemas.save();

      return res.send(savedData);
    } catch (error) {
      return next(error);
    }
  }

  return res.sendStatus(422);
});

schemaRoutes.put('/:id', requireLogin(), async (req, res, next) => {
  const updateJsonSchema = req.body;
  const jsonSchemasId = req.params.id;

  try {
    const saved = await JsonSchema.updateOne({ _id: jsonSchemasId }, updateJsonSchema);
    const jsonSchemas = await JsonSchema.findOne({ _id: jsonSchemasId });

    if (saved) {
      return res.status(200).json(jsonSchemas);
    }

    return res.sendStatus(500);
  } catch (error) {
    return next(error);
  }
});

schemaRoutes.get('/:id', async (req, res, next) => {
  const jsonSchemasId = req.params.id;

  try {
    const jsonSchemas = await JsonSchema.findById(jsonSchemasId);

    if (jsonSchemas) {
      return res.status(200).json(jsonSchemas);
    }

    return res.statusCode(404);
  } catch (error) {
    return next(error);
  }
});

schemaRoutes.delete('/:id', async (req, res, next) => {
  const templateId = req.params.id;

  try {
    const jsonSchema = await JsonSchema.deleteOne({ _id: templateId });

    if (jsonSchema) {
      return res.status(200).send('Schema Deleted');
    }

    return res.statusCode(404);
  } catch (error) {
    return next(error);
  }
});

module.exports = schemaRoutes;
