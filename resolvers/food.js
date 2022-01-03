const model = require("../models");
const mongoose = require("mongoose");

module.exports = {
  findFood: async (req, res) => {
    let { name } = req.body;
    name = name.trim().toLowerCase();
    try {
      food = await model.Food.find({ name: { $regex: name } }).limit(5);
      if (food == null) {
        return res.json({
          status: 0,
          message: "Food is not available.",
        });
      }
      return res.json({
        status: 1,
        message: "Food has been found.",
        data: food,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Cannot find the food.",
      });
    }
  },
};
