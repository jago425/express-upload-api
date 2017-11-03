'use strict'
const multer = require('multer')
const multerUpload = multer({ dest: '/tmp' })

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Upload = models.upload

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({
      uploads: uploads.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    upload: req.upload.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  multerUpload.single('image[file]')
  console.log('are you taking crazy pills?')
  console.log('req.body is', req.body)
  console.log('req.file is', req.file)
  // const upload = Object.assign(req.body.upload, {
  //   _owner: req.user._id
  // })

  // how do I get the file?
  // How do I get the path?
  // How do I get the name?

//   s3Upload(withthestuffyouneed)
//   .then((s3Response) => Upload.create(upload))
//     .then(upload =>
//       res.status(201)
//         .json({
//           upload: upload.toJSON({ virtuals: true, user: req.user })
//         }))
//     .catch(next)
}

const update = (req, res, next) => {
  delete req.body.upload._owner  // disallow owner reassignment.

  req.upload.update(req.body.upload)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.upload.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  {method: multerUpload.single('image[file]'), only: ['create']},
  { method: authenticate, except: ['index', 'show', 'create'] },
  { method: setModel(Upload), only: ['show'] },
  { method: setModel(Upload, { forUser: true }), only: ['update', 'destroy'] }
] })
