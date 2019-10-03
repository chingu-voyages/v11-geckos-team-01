const express = require('express');

const templateRoutes = express.Router();

/**
 * Get All Templates
 */
templateRoutes.get('/templates', (req, res) => {});

module.exports = templateRoutes;
