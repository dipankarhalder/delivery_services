const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema(
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
    category: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
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

module.exports = mongoose.model('Subcategory', SubcategorySchema);
