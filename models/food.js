const mongoose = require('mongoose');

const foodSchema = mongoose.Schema(
    {
        // id????
        name : {
            type: String
        },
        unit: {
            type: String
        },
        calories: { 
            type: Number
        },
        carbs : {
            type: Number
        },
        fat : {
            type: Number
        },
        protein : {
            type: Number
        },
	image : {
            type: String
        }
    }
);

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;