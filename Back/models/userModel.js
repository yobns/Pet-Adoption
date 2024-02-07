const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  bio: String,
  isAdmin: { type: Boolean, default: false },
  savedPets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pets'
}]
});

module.exports = mongoose.model('User', userModel);