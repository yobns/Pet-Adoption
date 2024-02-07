const mongoose = require('mongoose');

const petModel = new mongoose.Schema({
    type: { type: String, required: true },
    breed: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true, enum: ['Adopted', 'Fostered', 'Available'] },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    bio: String,
    hypoallergenic: { type: Boolean, default: false },
    restrictions: String,
    image: String,
    adoptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    fosteredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model('Pet', petModel);