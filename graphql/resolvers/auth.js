const {User} = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('../../nodemon.json');

module.exports = {

    createUser:async args => {
        try{

        const preuser = await User.findOne({email:args.userInput.email})

            if(preuser){
                throw new Error('User exists')
            }
            const hashedPswd = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email:args.userInput.email,
                password:hashedPswd,
            });
            const res = await user.save()

            return {...res._doc,password:null, _id:res.id};
        }
        catch(err) {
            throw err;
        };
        
    },

    signin:async ({email, password}) => {
        const key = process.env.SECRET_KEY;
        const user = await User.findOne({email:email});

        if(!user){
            throw new Error('No user found')
        }

        const isvalid = await bcrypt.compare(password, user.password);

        if(!isvalid){
            throw new Error('Incorrect Password')
        }

        const token = jwt.sign({userID:user.id, email:user.email},'somesecretkeyhere',{ 
            expiresIn:'1d'
        });

        return {
            userID:user.id, 
            token:token,
            tokenexpire:1
        }
    }
}