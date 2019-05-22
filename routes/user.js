const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
const {ensureAuthenticated}=require('../helper/auth');

//loading User model
require('../models/user');
const User=mongoose.model('user');

//user login route
router.get('/login',(req,res)=>{

    res.render('login');
});

//user registration route
router.get('/register',(req,res)=>{

    res.render('register');
});

//user registration form  
router.post('/register',(req,res)=>{

    var errors=[];

    if(req.body.password!=req.body.password2)
        errors.push({text:'passwords do not match'});
    if (req.body.password.length<4)
        errors.push({text:'password must be greater than 4 characters'});

    if(errors.length>0){

        res.render('register',{

            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
        
        User.findOne({email: req.body.email})
        .then(user=>{

            if(user)
                {
                    req.flash('error_msg','User already exists!');
                }
            else{
                
                const newUser={

                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    highScore:" "
                };
        
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        new User(newUser).save()
                        .then(user=>{
                            req.flash('success_msg','User registered!');
                            res.redirect('/user/login');
                        })
                        .catch(err=>{
                            return;
                        });
                    });
                });
            }
        });    
    }
        
});

//user login form
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{

        successRedirect:'/quiz/select',
        failureRedirect:'/user/login',
        failureFlash:true,
    })(req,res,next);
});

//logout user
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Logged out successfully!');
    res.redirect('/user/login');
});

//user profile page
router.get('/profile',ensureAuthenticated,(req,res)=>{

    res.render('profile');
});

//delete account route
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            req.flash('success_msg', 'Sucessfully deleted!');
            res.redirect('/');
        });                                                                         
});

module.exports=router;