const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  totalPrice : {
    type : Number,
    default : 0
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  lineItem: [
      {
          itemId : {type : String},
          qty : {type : Number},
          price : {type : Number},
      }
  ],
  status: {
    type: String,
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Order', OrderSchema)
