module.exports={

    ensureAuthenticated:function(req,res,next){

        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Not authorized! Please login to play');
        res.redirect('/user/login');
    }
};