const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key')
const { User } = require('./models/user');
const { json } = require('body-parser');

mongoose.connect(config.mongoURI,
{
    useNewUrlParser: true
}).then(() => console.log('DB connected')).catch(err => console.error(err))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register',(req, res)=>{
    const user = new User(req.body)

    user.save((err,doc)=>{
        if(err) return res.json({success:false, err});
        res.status(200).json({
            success:true,
            userData: doc
        })
    }) 
})

app.post('/api/user/login',(req, res)=>{
    //finding the email in the database
    User.findOne({email: req.body.email},(err,user)=>{
        if(user)
        return res.json({
            loginSuccess: false,
            message: "Auth failed, email not found"
        });
        //compare the password
        user.comparePassword(req.body.password,(err, isMatch)=>{
            if(!isMatch){
                return res.json ({loginSuccess: false, message: "password mismatch"})
            }
        })
        //generate the token
        user.generateToken((err,user) => {
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                })
        })
    })
     
})

// app.get('/',(req, res)=>{
//     res.send('running on port 5000')
// });

app.listen(5000);