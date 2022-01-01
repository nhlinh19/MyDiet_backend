const express = require('express');
const {getUser} = require('../middleware');

const foodRouter = express.Router();
const foodResolver = require('../resolvers/food');

foodRouter.get('/findfood', foodResolver.findFood)

module.exports = foodRouter;