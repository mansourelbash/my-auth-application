const mongoose = require('mongoose');

const RealEstateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  propertyType: { type: String, enum: ['Apartment', 'House', 'Condo', 'Land'], required: true },
  size: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  listedDate: { type: Date, default: Date.now },
  features: [{ type: String }],
  images: [{ type: String }],
  agent: { 
    name: { type: String, required: true },
    contact: { type: String }
  },
  id: { type: String, unique: true, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User schema
    required: true 
  },
});

module.exports = mongoose.model('RealEstate', RealEstateSchema);
