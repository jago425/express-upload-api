'use strict'

// pull in environment variables from .env
require('dotenv').config()
// add node built-in packages
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
// add npm packages
const mime = require('mime-types')
// add aws sdk
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const promiseRandomBytes = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        // file.name = buf.toString('hex')
        resolve(buf.toString('hex'))
      }
    })
  })
}

const promiseS3Upload = (params) => {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const s3Upload = (file) => {
  file.contentType = mime.lookup(file.path)
  file.ext = path.extname(file.path)
  file.stream = fs.createReadStream(file.path, {})
  const today = new Date().toISOString().split('T')[0]

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME,
    // Key: file.name + file.ext,
    Body: file.stream,
    ContentType: file.contentType
  }

  return promiseRandomBytes()
    .then((randomString) => {
      params.Key = `${today}/${randomString}${file.ext}`
      return params
    })
    .then(promiseS3Upload)
}

module.exports = s3Upload
