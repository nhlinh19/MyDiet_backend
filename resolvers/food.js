const model = require('../models')
const mongoose = require('mongoose')

module.exports = {
    findFood: async(req, res) => {
        let {
            name
        } = req.body;

        if (!name){
            return res.json({
                status : 0,
                message: "Not enough infomation."
            });
        }
        name = name.trim().toLowerCase();
        try {
            food = await model.Food.findOne({name:{$regex: name}})
            if (food == null ){
                return res.json({
                    status: 0,
                    message: 'Food is not available.'
                })
            }
            return res.json(food)
        }
        catch (error) {
            return res.json({
                status: 0,
                message: 'Cannot find the food.'
            });
        }
    }
}