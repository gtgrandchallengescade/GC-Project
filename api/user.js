const express = require('express');
const db = require('../sql/db');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());
router.use(session({secret:"hallo",resave:false,saveUninitialized:true}));
function encryptPassword(password) {
    const hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    return hash;
}
router.post('/login', (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	}
    const CHECK_PASSWORD = `SELECT password from user where email = '${user.email}'`;
    db.query(CHECK_PASSWORD, (error, results, fields) => {
        if (error) {
            res.send({
              "code":400,
              "failed":"error occurred"
            });
        } else {
            if(results.length > 0){
                if(bcrypt.compareSync(user.password, results[0].password)){
                    req.session.user = user;
                    res.send({
                        "user": user,
                        "code":200,
                        "success":"login sucessful"
                    });
                } else{
                    res.send({
                        "code":204,
                        "success":"Email and password does not match"
                    });
                }
            } else{
                res.send({
                    "code":204,
                    "success":"Email does not exist"
                });
            }
        }
    });
});
router.post('/register', (req, res) => {
    const user = {
        email: req.body.email,
        password: encryptPassword(req.body.password)
    }
    const CHECK_IF_EXISTS = `SELECT password from user where email = '${user.email}'`;
    const STORE_USER = `INSERT into user (email,password) VALUES('${user.email}', '${user.password}')`;
    db.query(CHECK_IF_EXISTS, (error, results, fields) => {
        console.log("hello");
        if (error) {
            res.send({
              "code":400,
              "failed":"error occurred"
            });
        } else {
            if(results.length == 0){
                db.query(STORE_USER, (error, results, fields) => {
                    console.log('saved');
                    if (error) {
                        res.send({
                            "code":400,
                            "failed":"error occurred"
                        });
                    } else {
                        req.session.user = user;
                        res.send({
                            "user": user,
                            "code":200,
                            "success":"User added"
                        });
                    }
                });
            } else {
                res.send({
                    "code":204,
                    "success":"Email already exists"
                });
            }
        }
    });
});
router.post('/logout', (req,res) => {
    req.session.destroy(function(err) {
        if(err) {
            res.send({
                "code":400,
                "failed":"error occurred"
            });
        }
        else {
            res.send({
                "code": 200,
                "success":"User logged out"
            });
        }
    });
    
});
router.get('/status', (req,res) => {
    if(req.session.user) {
        res.send({
            "user": req.session.user,
            "code":200,
            "success":"User logged in"
        });
    } else {
        res.send({
            "code":204,
            "success":"User not logged in"
        });
    }
})
module.exports = router;