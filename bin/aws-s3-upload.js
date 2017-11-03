'use strict'

const mongoose = require('../app/middleware/mongoose')

const s3Upload = require('../lib/aws-s3-upload')
const Upload = require('../app/models/upload')

const file = {
  path: process.argv[2],
  name: process.argv[3]
}

s3Upload(file)
  .then((s3Response) => {
    console.log('location is ?', s3Response)
    return Upload.create({
      description: 'does this work?',
      url: 'what is the url?'
    })
  })
  // .then(console.log) thise is the same as the line below
  .then((whateverisbeingreturned) => console.log('return val is', whateverisbeingreturned))
  .catch(console.error)
  .then(() => mongoose.connection.close())
