const model = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    me: async (req, res) => {
        try {
            const user = await model.User.findById(req.user.id);
            if (!user) {
                return res.json({
                    status: 0,
                    message: 'Not valid user.'
                });
            }
            
            user.password = undefined;
            user.ignored_list = undefined;
            
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
    },
    signUp: async (req, res) => {
        let {
            username, 
            fullname, 
            email, 
            password, 
            phoneNumber
        } = req.body;

        if (!username || !fullname || !email || !password) {
            return res.json({
                status: 0,
                message: 'Not enough information.'
            });
        }

        const usernameExist = await model.User.findOne({username});
        if (usernameExist) {
            return res.json({
                status: 0,
                message: 'Username already exists.'
            });
        }
        email = email.trim().toLowerCase();
        const emailExist = await model.User.findOne({email});
        if (emailExist) {
            return res.json({
                status: 0,
                message: 'Email is already signed up.'
            });
        }

        if (password.length < 6) {
            return res.json({
                status: 0,
                message: 'Password is too short.'
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //const avatar = gravatar(email);

        try {
            const user = new model.User(
                {
                    username: username, 
                    fullname: fullname, 
                    email: email, 
                    password: hashedPassword, 
                    phoneNumber: phoneNumber,
                    userType: 0
                }
            );

            await user.save()
            .then(doc => {
                console.log(doc)
            })
            .catch(err => {
                console.error(err)
            });

            user.password = undefined;
            user.ignored_list = undefined;

            return res.json({
                status: 1,
                message: 'Signed up successfully.',
                data: {
                    token: jwt.sign({
                            id: user._id
                    }, process.env.JWT_SECRET),
                    user
                }
            });
            
        }
        catch (error) {
            return res.json({
                status: 0,
                message: 'Unexpected error.'
            });
        }
    },
    signIn: async (req, res) => {
        let {
            username, 
            password
        } = req.body;

        const user = await model.User.findOne({username});

        if (!user) {
            return res.json({
                status: 0,
                message: 'User does not exist.'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({
                status: 0,
                message: 'Wrong password.'
            });
        }
        
        user.password = undefined;
        user.ignored_list = undefined;

        return res.json({
            status: 1,
            message: 'Signed in successfully.',
            data: {
                token: jwt.sign({
                        id: user._id
                    }, process.env.JWT_SECRET),
                user
            }
        });
    },
}