'use strict'

const s3Upload = require('../lib/aws-s3-upload')

const file = {
  path: process.argv[2],
  name: process.argv[3]
}

s3Upload(file)
  .then((s3Response) => console.log('s3 response is ?', s3Response))
  .catch(console.error)
