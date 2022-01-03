const express = require("express");
const { getUser } = require("../middleware");

const foodRouter = express.Router();
const foodResolver = require("../resolvers/food");

// req.body.name
foodRouter.post("/findfood", foodResolver.findFood);

module.exports = foodRouter;
