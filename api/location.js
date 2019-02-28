const express = require('express');
const db = require('../sql/db');
const router = express.Router();

router.post('/request', (req,res) => {
    request = {
        startLocation: req.body.startLocation,
        endLocation: req.body.endLocation,
        timeLeaving: req.body.timeLeaving,
        dateOfRequest: req.body.dateOfRequest,
        email: req.body.email
    }
    POST_REQUEST = `INSERT into request (startLocation, endLocation, timeLeaving, dateOfRequest, requestor VALUE ('${request.startLocation}', '${request.endLocation}', '${request.timeLeaving}', '${request.dateOfRequest}', '${request.email}')`;
    req.query(POST_REQUEST, (error, results, fields) => {
         if (error) {
            res.send({
                "code":400,
                "failed":"error occurred"
            });
        } else {
            req.session.user = user;
            res.send({
                "code":200,
                "success":"Request added"
            });
        }
    });
});
router.post('/match', (req,res) => {

});
router.post('/decision', (req,res) => {

});
router.post
module.exports = router;