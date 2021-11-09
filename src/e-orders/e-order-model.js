const { Schema, model } = require('mongoose');

const EOrderSchema = new Schema(
  {
    client: {
      email: { type: String, required: true },
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      dni: { type: String, required: true },
    },
    shipping: {
      address: { type: String, required: true },
      reference: { type: String },
      city: { type: String, required: true },
      province: { type: String, required: true },
    },
    lineProducts: [
      {
        id: { type: String, required: true, ref: 'Products' },
        quantity: { type: Number, required: true },
        price: { type: String, required: true },
        image: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    subTotal: { type: String, required: true },
    total: { type: String, required: true },
    shippingTotal: { type: String, required: true },
    status: { type: String },
    totalUniqueItems: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports.EOrder = model('eorder', EOrderSchema);