const multer = require('multer'),
  bodyparser = require('body-parser'),
  fs = require('fs'),
  AWS = require('aws-sdk'),
  multerS3 = require('multer-s3')
const mongoose = require('../mongoDB/mongoose');

// AWS Info
AWS.config.update({
  secretAccessKey: '969xJIaE0Guq/2OEIzGErbNu48ACH2eO3JeexOtW',
  accessKeyId: 'AKIASSPS6G6CMZNR2MOL',
  region: 'sa-east-1'
});
S3_BUCKET = 'andre-tcc'
const s3 = new AWS.S3();

// File upload settings
const path = process.env.HOME + '/Programming/TCC/Actual/backend/uploads';

const fileInfo = {
  idNotebook: 'NoFetch',
  numPages: 0,
  tempQueue: 0
}

const getIdNotebook = (id, pages, queue) => {
  fileInfo.idNotebook = id
  fileInfo.numPages = pages
  fileInfo.tempQueue = queue
}

const fileNameFunc = (file) => {
  let extension = file.originalname.split('.').pop()
  if (extension === 'jpeg') {
    extension = 'jpg'
  }
  let counter = 0
  counter++
  // console.log('counter: ', counter)
  let pageNum = fileInfo.numPages + counter
  const fileName = fileInfo.idNotebook + '-' + pageNum + '.' + extension
  return fileName
}

let uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      setTimeout(() => {
        cb(null, fileNameFunc(file))
      }, 500)
    }
  })
});

let uploadAWS = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    key: function (req, file, cb) {
      setTimeout(() => {
        cb(null, fileNameFunc(file))
      }, 500)
    }
  })
});

const fileCatcher = (res) => {
  res.end('File catcher')
}

const imageUpload = (req, res) => {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!');
    return res.send({
      success: true
    })
  }
}

module.exports = {
  uploadLocal: uploadLocal,
  uploadAWS: uploadAWS,
  fileCatcher: fileCatcher,
  imageUpload: imageUpload,
  getIdNotebook: getIdNotebook
}
