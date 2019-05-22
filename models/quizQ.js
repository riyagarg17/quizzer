const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/quizzer', { useNewUrlParser: true })
.then(()=>console.log('db Connected'))
.catch(err=>console.log('Couldn\'t connect',err));


//creating schema
const quizSchema=new mongoose.Schema({
    
    quiz_type:String,
    question:{
        type:String,
        required:true
    },
    correctAns:{
        type:String, 
        required:true
    },
    option_a:{
        type:String,
        required:true,
    },
    option_b:{
        type:String,
        required:true,
    },
    option_c:{
        type:String,
        required:true,
    },
    option_d:{
        type:String,
        required:true,
    }
});

mongoose.model('quizQ',quizSchema,'quizQ');


