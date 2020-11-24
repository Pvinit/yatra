const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Order = require('../models/Order')

// @desc    Show all Orders
// @route   GET /orders
router.get('/', ensureAuth, async (req, res) => {
  try {
    let condition = {}

    if(req.query.status){
      condition['status'] = req.query.status
    }

    const orders = await Order.find(condition)
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(err.code || 500).json(err);
  }
})

// @desc    Show single order
// @route   GET /orders/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).populate('user').lean()

    if (!order) {
      return  res.status(404).json({"message" : "Not found"});
    }
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(err.code || 500).json(err);
  }
})


// @desc    Update story
// @route   PUT /orders/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).lean()

    if (!order) {
      return res.status(404).json({"message" : "Not found"});
    }

    order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(err.code || 500).json(err);
  }
})

// @desc    Delete story
// @route   DELETE /orders/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).lean()

    if (!order) {
      return res.status(404).json({"message" : "Not found"});
    }

    await Order.remove({ _id: req.params.id })
    res.status(200)

  } catch (err) {
    console.error(err)
    res.status(err.code || 500).json(err);
  }
})

// @desc    User orders
// @route   GET /orders/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId
    })
      .populate('user')
      .lean()

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(err.code || 500).json(err);
  }
})

module.exports = router
