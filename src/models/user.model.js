const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { envConfig } = require('../config');

const saltNum = 10;
const roles = ['super_admin', 'delivery', 'customer'];

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'super_admin',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      area: {
        type: String,
      },
      landmark: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

/* middleware to hash the password */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(saltNum);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* compare both passwords */
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

/* generate JWT token */
UserSchema.methods.generateAuthToken = function () {
  const payload = {
    userid: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role,
  };

  /* create token with secret key and expiration time */
  return jwt.sign(payload, envConfig.JWTSECRET, {
    expiresIn: envConfig.EXPTIME,
  });
};

module.exports = mongoose.model('User', UserSchema);
