const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helper/auth');
//var sess;
//score = 0;


//loading User model
require('../models/user');
const User = mongoose.model('user');

//loading quiz questions model
require('../models/quizQ');
const quizQues = mongoose.model('quizQ');

//choose quiz type
router.get('/select', ensureAuthenticated, (req, res) => {

    sess=req.session;
    sess.score=0;
    //score = 0;
    //quesNumber=0;
    sess.quesNumber=0;
    res.render('index');
});

//play quiz
router.get('/play/:type/:ques_no', ensureAuthenticated, (req, res) => {

    var option = [];
    sess=req.session;
    var i = parseInt(req.params.ques_no,10);
    if(i!=sess.quesNumber){

        req.flash('error_msg','Invalid Navigation!');
        res.redirect('/quiz/select');
    }
    else{

        quizQues.find({ quiz_type: req.params.type })
        .then(quiz_q => {
            option.push([quiz_q[i].option_a], [quiz_q[i].option_b], [quiz_q[i].option_c], [quiz_q[i].option_d]);
                res.render('quiz', {
                    questions: quiz_q[i].question,
                    options: option,
                    correctAns: quiz_q[i].correctAns,
                    quizT: req.params.type,
                    quesNo: parseInt(req.params.ques_no, 10) + 1,
                    totalQues: quiz_q.length,
    
                });

        }).catch(err => console.log(err));
    }
    
});

//calculate score
router.post('/calScore/:quizType/:ques_no', ensureAuthenticated, (req, res) => {
    sess=req.session;
    sess.quesNumber++;
    //quesNumber++;
    var i = parseInt(req.params.ques_no);
    quizQues.find({ quiz_type: req.params.quizType })
        .then(quiz_q => {
            if (req.body.optionSelected == quiz_q[i - 1].correctAns) {
                //score++;
                sess.score++;

            }
            if (i != quiz_q.length) {
                res.redirect('/quiz/play/' + req.params.quizType + '/' + i);
            }

            else {
                res.render('quiz', {
                    msg: `You scored ${sess.score}/${quiz_q.length}`,
                    quizT: req.params.quizType
                });
            }
        }).catch(err => console.log(err));
});

//edit quiz score 
router.put('/:id', ensureAuthenticated, (req, res) => {

    sess=req.session;
    User.findOne({

        _id: req.params.id
    })
        .then(user => {

            if (user.highScore < sess.score)
                user.highScore = sess.score;
            user.lastScore = sess.score;
            user.save()
                .then(() => {

                    req.flash('success_msg', 'Score updated!');
                    res.redirect('/');
                });
        });
});

module.exports = router;