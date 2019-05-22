const express=require('express');
const methodOverride=require('method-override');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');
//db config
const db=require('./config/database');

const app=express();

//flash middleware
app.use(flash());

// passport config 
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(()=>console.log('Connected'))
.catch(err=>console.log('Couldn\'t connect',err));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//load user routes
const user=require('./routes/user');

//load quiz routes
const quiz=require('./routes/quiz');

//load handlebars middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//custom middleware
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.user=req.user || null;
    res.locals.error = req.flash('error');
    next();
});

//method-override middleware
app.use(methodOverride('_method'));

//static folder
app.use(express.static(__dirname + '/public'));

//use user route
app.use('/user',user);

//use quiz route
app.use('/quiz',quiz);

//first page
app.get('/',(req,res)=>{

    res.render('firstPage');
});

const port= process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});