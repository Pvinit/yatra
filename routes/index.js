const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { image } = require('../middleware/s3-service')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    upload Image on s3
// @route   POST /
router.post('/uploadImage', ensureAuth, async (req, res) => {
  try {
    image(req, res,(err , url)=>{
      if(err){
        res.status(400).json(err);
      }
      res.json({"url" : url})
    })
  } catch (err) {
    console.error(err)
    res.status(err.code || 500).json(err);
  }
})

module.exports = router
