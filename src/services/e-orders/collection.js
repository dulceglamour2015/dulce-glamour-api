const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoosePaginateAggregate = require('mongoose-aggregate-paginate-v2');
const mongooseDelete = require('mongoose-delete');
const EOrderSchema = new Schema(
  {
    clientID: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
    },
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
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String },
      },
    ],
    total: { type: Number, required: true },
    shippingTotal: { type: String },
    discount: { type: String },
    status: { type: String },
    description: { type: String },

    paidType: { type: String },
    paidDescription: { type: String },
    paidImage: { type: String },
    paidUser: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    paidAt: { type: Date, default: Date.now },

    updateUser: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  },
  { timestamps: true }
);

EOrderSchema.index({ 'client.fullName': 'text', "client.dni": "text", "client.city": "text" });
EOrderSchema.plugin(mongoosePaginate);
EOrderSchema.plugin(mongoosePaginateAggregate);
EOrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
});

module.exports.EOrder = model('eorder', EOrderSchema);
