const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://adrian6899:password08@mern.peefh.mongodb.net/MERN?retryWrites=true&w=majority',
{
    useNewUrlParser: true
}).then(() => console.log('DB connected')).catch(err => console.error(err))

app.get('/',(req, res)=>{
    res.send('running on port 5000')
});

app.listen(5000);