const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 60,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 255,
    },
    image: {
      type: String,
      default: null,
    },
    user: {
      _id: mongoose.Schema.Types.ObjectId,
      firstName: String,
      lastName: String,
      role: String,
    },
    lastEditedBy: {
      _id: mongoose.Schema.Types.ObjectId,
      firstName: String,
      lastName: String,
      role: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Category', CategorySchema);
