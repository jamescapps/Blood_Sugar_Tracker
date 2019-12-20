const router = require('express').Router()
let Bloodsugar = require('../models/bloodsugar.model')
let User = require('../models/user.model')

router.route('/').get((req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/add').post((req, res) => {
    //const { firstname } = req.body
    const { id } = req.body
    const { level } = req.body
    const date = Date.parse(req.body.date)

    //Make sure it is a 2 or 3 digit number
    var numberTest = /^\d{2,3}$/

    User.findOne({_id: id}, (err, result) => {
        if (err) {
            res.send("Error contacting database")
          } else if (!result) {
            res.send("userId not found")
          } else if (!numberTest.test(level)) {
              res.json('Please enter a 2 or 3 digit number.')
          } else {
              var newReading = (
                  {
                      level: level,
                      date: date
                  }
              )
              result.bloodSugar.push(newReading)
              result.save()
              .then(() => res.json('Reading added!'))
              .catch(err => res.status(400).json('Error: ' + err))
          }
    })
})

router.route('/:id').get((req, res) => {
    Bloodsugar.findById(req.params.id)
        .then(bloodsugar => res.json(bloodsugar))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id1/:id2').delete((req, res) => {
    User.update({_id: req.params.id1}, {$pull: {bloodSugar: {_id: req.params.id2}}})
        .then(() => res.json('Reading deleted!'))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req, res) => {
    Bloodsugar.findById(req.params.id)
    .then(bloodsugar => {
        bloodsugar.firstname = req.body.firstname
        bloodsugar.level = req.body.level
        bloodsugar.date = Date.parse(req.body.date)

        bloodsugar.save()
            .then(() => res.json('Reading updated!'))
            .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router