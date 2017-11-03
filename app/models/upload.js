'use strict'

const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {}
})

const Upload = mongoose.model('Upload', uploadSchema)

module.exports = Upload
