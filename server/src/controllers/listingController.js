import { listingStore } from '../services/listingStore.js';

export const getListings = (req, res) => {
  try {
    const { search, category, type, sort } = req.query;
    const listings = listingStore.getAll({ search, category, type, sort });
    res.json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving listings', error: error.message });
  }
};

export const getListingById = (req, res) => {
  try {
    const { id } = req.params;
    const listing = listingStore.getById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving listing', error: error.message });
  }
};

export const createListing = (req, res) => {
  try {
    const { title, category, listingType, price, condition, description } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    const newListing = listingStore.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: newListing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating listing', error: error.message });
  }
};

export const getCategories = (req, res) => {
  try {
    const categories = listingStore.getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving categories', error: error.message });
  }
};
