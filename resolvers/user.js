const model = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    me: async (req, res) => {
        try {
            /*const newuser = await new model.User({
                username: "pvphat",
                email: "pvphat@gmail.com",
                password: "654321"
            });
            newuser.save()
            .then(doc => {
                console.log(doc)
            })
            .catch(err => {
                console.error(err)
            })
            const userList = await model.User.find({});
            console.log(userList);

            res.send("resolver me");*/

            /*const user = await model.User.findById(req.user.id);
            if (!user) {
                return res.json({
                    status: 0,
                    message: 'Not valid user.'
                });
            }

            user.password = undefined;
            user.ignored_list = undefined;*/
            
            return res.json({
                status: 1,
                data: user
            }); 
        }
        catch (error) {
            return res.json({
                status: 0,
                message: 'Unexpected error occurred.'
            });
        }
    }
}