//===== require file uploading dependency 
let path = require('path');
let fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.update({
    "accessKeyId": process.env.ACCESS_KEY_ID
    , "secretAccessKey": process.env.SECRET_ACCESS_KEY
    , "region": process.env.REGION
});

let bucketName = process.env.BUCKET_NAME;

module.exports = {
    image: (req, res, callback) => {
        console.log(req.files);
        console.log("==========header============");
        
        //@ copy image data in path variable
        var path = req.files.imgFile.data;
        //@ create new s3 object
        var s3 = new AWS.S3();
        //@ create uploaded image name with timestamp , sending image name & extension
        var key = new Date().getTime() + "_" + req.files.imgFile.name.split(".")[0]+"."+req.files.imgFile.name.split(".")[1];
        //@ set params object with details
        var params = {
            Bucket: bucketName
            , Key: key
            , Body: path
            , ContentType: req.files.imgFile.mimetype
            , ACL: 'public-read'
        };
        //@push data on 
        s3.putObject(params, function (perr, pres) {
            if (perr) {
                console.log("Error uploading image: ", perr);
                return res.send({
                    responseCode: 400
                    , responseMessage: "Something went wrong to uploading image"
                });
            }
            else {
                console.log("uploading image successfully");
                //@update urlParams object with key bucket & key
                var urlParams = {
                    Bucket: bucketName
                    , Key: key
                };

                //@ get updated image url
                s3.getSignedUrl('getObject', urlParams, function (err, url) {

                    console.log('the url of the image is', url.split("?")[0]);
                
                    callback(null, url.split("?")[0]);
                })
            }
        });
    },
    unlinkFile: (files) => {
        files.forEach(function (filename) {
            var _dirName = path.join(__dirname, "../..", filename);
            fs.unlink(_dirName, (err) => {
                if (err) console.log('Error to removing image');
                else console.log('Image removed');
            });
        });
    }
};