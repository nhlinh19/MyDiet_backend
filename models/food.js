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
        }
    }
);

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;