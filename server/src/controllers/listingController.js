import { listingStore } from '../services/listingStore.js';

/**
 * Get all listings with search, filters, sorting, and pagination
 * GET /api/listings
 */
export const getListings = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      type, 
      condition, 
      minPrice, 
      maxPrice, 
      status, 
      owner, 
      sort, 
      page, 
      limit 
    } = req.query;

    const result = await listingStore.getAll({
      search,
      category,
      type,
      condition,
      minPrice,
      maxPrice,
      status,
      owner,
      sort,
      page,
      limit
    });

    res.json({
      success: true,
      count: result.listings.length,
      pagination: result.pagination,
      data: result.listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving listings',
      error: error.message
    });
  }
};

/**
 * Get single listing by ID
 * GET /api/listings/:id
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await listingStore.getById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving listing',
      error: error.message
    });
  }
};

/**
 * Create listing (Authenticated)
 * POST /api/listings
 */
export const createListing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to list an item.'
      });
    }

    const newListing = await listingStore.create(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Sustainable campus listing created successfully!',
      data: newListing
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Server error creating listing'
    });
  }
};

/**
 * Update listing (Enforces ownership)
 * PUT /api/listings/:id
 */
export const updateListing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update listing.'
      });
    }

    const { id } = req.params;
    const updated = await listingStore.update(id, req.body, req.user);

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: updated
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Server error updating listing'
    });
  }
};

/**
 * Update listing availability status ('available', 'reserved', 'completed')
 * PATCH /api/listings/:id/status
 */
export const updateListingStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const updated = await listingStore.updateStatus(id, status, req.user);
    res.json({
      success: true,
      message: `Listing status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Server error updating status'
    });
  }
};

/**
 * Delete listing (Enforces ownership)
 * DELETE /api/listings/:id
 */
export const deleteListing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { id } = req.params;
    const result = await listingStore.delete(id, req.user);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Server error deleting listing'
    });
  }
};

/**
 * Submit campus pickup / exchange request
 * POST /api/listings/:id/request-exchange
 * Note: Rejects exchange requests on unavailable (reserved or completed) items!
 */
export const requestExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingTime, note } = req.body;

    // Check item availability
    await listingStore.canRequestExchange(id);

    res.status(200).json({
      success: true,
      message: 'Campus safe-zone pickup request transmitted to listing owner!',
      data: {
        listingId: id,
        meetingTime: meetingTime || 'Today after 3:00 PM',
        note: note || '',
        status: 'pending_confirmation'
      }
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message,
      code: error.code || 'REQUEST_FAILED'
    });
  }
};

/**
 * Get listing categories
 * GET /api/listings/categories
 */
export const getCategories = (req, res) => {
  try {
    const categories = listingStore.getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving categories',
      error: error.message
    });
  }
};
