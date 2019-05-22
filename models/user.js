const mongoose=require('mongoose');
const moment = require('moment');

//db config
/*const db=require('../config/database');

mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(()=>console.log('db Connected'))
.catch(err=>console.log('Couldn\'t connect',err));*/


//creating schema
const userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now()
    },
    highScore:{
        type:Number
    },
    lastScore:{
        type:Number
    }
});

mongoose.model('user',userSchema);


