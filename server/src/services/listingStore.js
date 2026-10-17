import { SAMPLE_LISTINGS } from '../data/sampleListings.js';
import { CATEGORIES } from '../data/categories.js';
import { Listing } from '../models/Listing.js';
import { isDatabaseConnected } from '../config/db.js';

class ListingStore {
  constructor() {
    this.memoryListings = JSON.parse(JSON.stringify(SAMPLE_LISTINGS));
    this.categories = [...CATEGORIES];
  }

  /**
   * Retrieve listings with search, category, condition, type, price range, sorting, and pagination
   */
  async getAll({
    search,
    category,
    type,
    condition,
    minPrice,
    maxPrice,
    status,
    owner,
    sort = 'newest',
    page = 1,
    limit = 8
  } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 8));

    if (isDatabaseConnected()) {
      try {
        const query = {};

        // Search by title and description
        if (search && search.trim() !== '') {
          const q = search.trim();
          query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { desiredItems: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { 'location.building': { $regex: q, $options: 'i' } }
          ];
        }

        // Category filter
        if (category && category !== 'all') {
          if (category === 'giveaways') {
            query.listingType = { $in: ['giveaway', 'free'] };
          } else {
            query.category = category.toLowerCase();
          }
        }

        // Listing Type filter (Sell, Give Away, Swap)
        if (type && type !== 'all') {
          const normalizedType = type.toLowerCase();
          if (normalizedType === 'free' || normalizedType === 'giveaway') {
            query.listingType = { $in: ['free', 'giveaway'] };
          } else if (normalizedType === 'trade' || normalizedType === 'swap') {
            query.listingType = { $in: ['trade', 'swap'] };
          } else {
            query.listingType = normalizedType;
          }
        }

        // Condition filter
        if (condition && condition !== 'all') {
          query.condition = condition;
        }

        // Status filter
        if (status && status !== 'all') {
          query.status = status;
        }

        // Owner filter (e.g. for user's dashboard listings)
        if (owner) {
          query.owner = owner;
        }

        // Price range filtering (specifically for Sell listings)
        if (minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice))) {
          query.price = query.price || {};
          query.price.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice))) {
          query.price = query.price || {};
          query.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { createdAt: -1 };
        if (sort === 'price-asc') sortOption = { price: 1 };
        else if (sort === 'price-desc') sortOption = { price: -1 };
        else if (sort === 'co2-desc') sortOption = { co2SavedKg: -1 };

        const totalItems = await Listing.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum) || 1;
        const skip = (pageNum - 1) * limitNum;

        const dbListings = await Listing.find(query)
          .populate('owner', 'name email department year campus avatar karmaScore isCollegeVerified')
          .sort(sortOption)
          .skip(skip)
          .limit(limitNum);

        return {
          listings: dbListings.map(d => d.toJSON()),
          pagination: {
            totalItems,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        };
      } catch (err) {
        console.warn('ListingStore Mongo Query fallback:', err.message);
      }
    }

    // In-memory Fallback
    let result = [...this.memoryListings];

    // Search query
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.desiredItems?.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
        (item.location && item.location.building?.toLowerCase().includes(q))
      );
    }

    // Category
    if (category && category !== 'all') {
      if (category === 'giveaways') {
        result = result.filter(item => item.listingType === 'free' || item.listingType === 'giveaway');
      } else {
        result = result.filter(item => item.category?.toLowerCase() === category.toLowerCase());
      }
    }

    // Type
    if (type && type !== 'all') {
      const t = type.toLowerCase();
      if (t === 'free' || t === 'giveaway') {
        result = result.filter(item => item.listingType === 'free' || item.listingType === 'giveaway');
      } else if (t === 'trade' || t === 'swap') {
        result = result.filter(item => item.listingType === 'trade' || item.listingType === 'swap');
      } else {
        result = result.filter(item => item.listingType?.toLowerCase() === t);
      }
    }

    // Condition
    if (condition && condition !== 'all') {
      result = result.filter(item => item.condition === condition);
    }

    // Status
    if (status && status !== 'all') {
      result = result.filter(item => item.status === status);
    }

    // Owner
    if (owner) {
      result = result.filter(item => {
        const ownerId = item.owner?.toString() || item.seller?.id?.toString();
        return ownerId === owner.toString();
      });
    }

    // Price range
    if (minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice))) {
      result = result.filter(item => Number(item.price || item.sellingPrice || 0) >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice))) {
      result = result.filter(item => Number(item.price || item.sellingPrice || 0) <= Number(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'co2-desc':
        result.sort((a, b) => (b.co2SavedKg || 0) - (a.co2SavedKg || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedListings = result.slice(startIndex, startIndex + limitNum);

    return {
      listings: paginatedListings,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    };
  }

  /**
   * Retrieve single listing by ID
   */
  async getById(id) {
    if (isDatabaseConnected()) {
      try {
        const item = await Listing.findById(id).populate('owner', 'name email department year campus avatar karmaScore isCollegeVerified');
        if (item) return item.toJSON();
      } catch (err) {
        // ID may be custom string format in tests
      }
    }
    return this.memoryListings.find(item => item.id === id || item._id?.toString() === id) || null;
  }

  /**
   * Create new authenticated listing
   */
  async create(itemData, user) {
    if (!user) {
      const err = new Error('Authentication required to create a listing');
      err.status = 401;
      throw err;
    }

    // Validation
    if (!itemData.title || itemData.title.trim().length < 3) {
      const err = new Error('Title must be at least 3 characters long');
      err.status = 400;
      throw err;
    }

    if (!itemData.category) {
      const err = new Error('Category is required');
      err.status = 400;
      throw err;
    }

    // Default carbon multiplier by category
    const co2Estimates = {
      'textbooks': 9.5,
      'electronics': 28.0,
      'lab-gear': 12.5,
      'stationery': 4.5,
      'dorm': 32.0,
      'giveaways': 8.0,
    };

    const calculatedCo2 = Number(itemData.co2SavedKg) || co2Estimates[itemData.category] || 8.5;
    const normalizedType = (itemData.listingType || 'sell').toLowerCase();

    // Prepare images array
    const imageList = Array.isArray(itemData.images) && itemData.images.length > 0
      ? itemData.images
      : [itemData.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];

    const sellerInfo = {
      id: user._id?.toString() || user.id,
      name: user.name,
      department: user.department || 'General Studies',
      year: user.year || 'Junior',
      campus: user.campus || 'Main Campus',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: user.karmaScore || 100,
      itemsReused: user.itemsReused || 0,
      isCollegeVerified: !!user.isCollegeVerified,
      verifiedStudent: !!user.isCollegeVerified
    };

    const priceValue = (normalizedType === 'free' || normalizedType === 'giveaway' || normalizedType === 'swap' || normalizedType === 'trade')
      ? 0
      : Math.max(0, Number(itemData.price || itemData.sellingPrice || 0));

    if (isDatabaseConnected()) {
      try {
        const newListing = await Listing.create({
          owner: user._id || user.id,
          title: itemData.title.trim(),
          category: itemData.category,
          listingType: normalizedType,
          desiredItems: itemData.desiredItems || '',
          sellingPrice: priceValue,
          price: priceValue,
          originalPrice: Number(itemData.originalPrice) || (priceValue > 0 ? priceValue * 2 : 50),
          condition: itemData.condition || 'Good',
          co2SavedKg: calculatedCo2,
          description: itemData.description || 'Quality reused campus gear.',
          images: imageList,
          campus: itemData.campus || user.campus || 'Main Campus',
          tags: itemData.tags || [itemData.category],
          seller: sellerInfo,
          location: itemData.location || {
            campusSpot: itemData.campusSpot || 'Main Library 2nd Floor Cafe',
            building: itemData.building || 'W.E.B. Du Bois Library',
            safeMeetingZone: true
          },
          status: 'available',
          viewsCount: 1
        });

        return newListing.toJSON();
      } catch (err) {
        console.warn('ListingStore Mongo Creation fallback:', err.message);
      }
    }

    // In-memory creation
    const id = `item-${Date.now()}`;
    const newMemoryItem = {
      id,
      _id: id,
      owner: user._id?.toString() || user.id,
      title: itemData.title.trim(),
      category: itemData.category,
      listingType: normalizedType === 'giveaway' ? 'free' : (normalizedType === 'swap' ? 'trade' : normalizedType),
      desiredItems: itemData.desiredItems || '',
      sellingPrice: priceValue,
      price: priceValue,
      originalPrice: Number(itemData.originalPrice) || (priceValue > 0 ? priceValue * 2 : 50),
      condition: itemData.condition || 'Good',
      co2SavedKg: calculatedCo2,
      description: itemData.description || 'Quality reused campus gear.',
      images: imageList,
      imageUrl: imageList[0],
      campus: itemData.campus || user.campus || 'Main Campus',
      tags: itemData.tags || [itemData.category],
      seller: sellerInfo,
      location: itemData.location || {
        campusSpot: itemData.campusSpot || 'Main Library 2nd Floor Cafe',
        building: itemData.building || 'W.E.B. Du Bois Library',
        safeMeetingZone: true
      },
      createdAt: new Date().toISOString(),
      status: 'available',
      viewsCount: 1
    };

    this.memoryListings.unshift(newMemoryItem);
    return newMemoryItem;
  }

  /**
   * Update an existing listing with strict ownership check
   */
  async update(id, updateData, user) {
    if (!user) {
      const err = new Error('Authentication required to edit listing');
      err.status = 401;
      throw err;
    }

    const userIdStr = (user._id || user.id).toString();

    if (isDatabaseConnected()) {
      try {
        const listing = await Listing.findById(id);
        if (!listing) {
          const err = new Error('Listing not found');
          err.status = 404;
          throw err;
        }

        // Ownership enforcement
        if (listing.owner.toString() !== userIdStr) {
          const err = new Error('Not authorized: You can only edit your own listings');
          err.status = 403;
          throw err;
        }

        // Apply permitted updates
        if (updateData.title) listing.title = updateData.title.trim();
        if (updateData.description) listing.description = updateData.description.trim();
        if (updateData.category) listing.category = updateData.category;
        if (updateData.condition) listing.condition = updateData.condition;
        if (updateData.listingType) listing.listingType = updateData.listingType;
        if (updateData.desiredItems !== undefined) listing.desiredItems = updateData.desiredItems;
        if (updateData.campus) listing.campus = updateData.campus;
        if (updateData.location) listing.location = updateData.location;
        if (updateData.status) listing.status = updateData.status;

        if (updateData.sellingPrice !== undefined || updateData.price !== undefined) {
          const newPrice = Number(updateData.sellingPrice ?? updateData.price ?? 0);
          listing.sellingPrice = newPrice;
          listing.price = newPrice;
        }

        if (updateData.images) {
          listing.images = Array.isArray(updateData.images) ? updateData.images : [updateData.images];
        } else if (updateData.imageUrl) {
          listing.images = [updateData.imageUrl];
        }

        await listing.save();
        return listing.toJSON();
      } catch (err) {
        if (err.status) throw err;
      }
    }

    // In-memory update
    const index = this.memoryListings.findIndex(i => i.id === id || i._id?.toString() === id);
    if (index === -1) {
      const err = new Error('Listing not found');
      err.status = 404;
      throw err;
    }

    const current = this.memoryListings[index];
    const currentOwner = (current.owner || current.seller?.id || '').toString();

    if (currentOwner !== userIdStr) {
      const err = new Error('Not authorized: You can only edit your own listings');
      err.status = 403;
      throw err;
    }

    const normalizedUpdates = { ...updateData };
    if (normalizedUpdates.sellingPrice !== undefined && normalizedUpdates.price === undefined) {
      normalizedUpdates.price = Number(normalizedUpdates.sellingPrice);
    }
    if (normalizedUpdates.price !== undefined && normalizedUpdates.sellingPrice === undefined) {
      normalizedUpdates.sellingPrice = Number(normalizedUpdates.price);
    }

    this.memoryListings[index] = {
      ...current,
      ...normalizedUpdates,
      updatedAt: new Date().toISOString()
    };

    return this.memoryListings[index];
  }

  /**
   * Update availability status ('available', 'reserved', 'completed')
   */
  async updateStatus(id, newStatus, user) {
    if (!['available', 'reserved', 'completed'].includes(newStatus)) {
      const err = new Error('Invalid availability status. Must be available, reserved, or completed.');
      err.status = 400;
      throw err;
    }
    return this.update(id, { status: newStatus }, user);
  }

  /**
   * Internal status update method for system workflows (acceptance/completion)
   */
  async internalUpdateStatus(id, newStatus) {
    if (isDatabaseConnected()) {
      try {
        await Listing.findByIdAndUpdate(id, { status: newStatus });
      } catch (err) {
        console.warn('DB internalUpdateStatus fallback:', err.message);
      }
    }

    const index = this.memoryListings.findIndex(i => i.id === id || i._id?.toString() === id);
    if (index !== -1) {
      this.memoryListings[index].status = newStatus;
      this.memoryListings[index].updatedAt = new Date().toISOString();
      return this.memoryListings[index];
    }
    return null;
  }

  /**
   * Delete a listing with strict ownership check
   */
  async delete(id, user) {
    if (!user) {
      const err = new Error('Authentication required to delete listing');
      err.status = 401;
      throw err;
    }

    const userIdStr = (user._id || user.id).toString();

    if (isDatabaseConnected()) {
      try {
        const listing = await Listing.findById(id);
        if (!listing) {
          const err = new Error('Listing not found');
          err.status = 404;
          throw err;
        }

        // Ownership enforcement
        if (listing.owner.toString() !== userIdStr) {
          const err = new Error('Not authorized: You can only delete your own listings');
          err.status = 403;
          throw err;
        }

        await Listing.findByIdAndDelete(id);
        return { success: true, message: 'Listing deleted successfully' };
      } catch (err) {
        if (err.status) throw err;
      }
    }

    // In-memory delete
    const index = this.memoryListings.findIndex(i => i.id === id || i._id?.toString() === id);
    if (index === -1) {
      const err = new Error('Listing not found');
      err.status = 404;
      throw err;
    }

    const current = this.memoryListings[index];
    const currentOwner = (current.owner || current.seller?.id || '').toString();

    if (currentOwner !== userIdStr) {
      const err = new Error('Not authorized: You can only delete your own listings');
      err.status = 403;
      throw err;
    }

    this.memoryListings.splice(index, 1);
    return { success: true, message: 'Listing deleted successfully' };
  }

  /**
   * Check whether an item can receive an exchange request
   */
  async canRequestExchange(id) {
    const listing = await this.getById(id);
    if (!listing) {
      const err = new Error('Listing not found');
      err.status = 404;
      throw err;
    }

    if (listing.status !== 'available') {
      const err = new Error(`Item is currently ${listing.status} and cannot receive new exchange requests.`);
      err.status = 400;
      err.code = 'ITEM_UNAVAILABLE';
      throw err;
    }

    return true;
  }

  getCategories() {
    return this.categories;
  }

  async getStats() {
    let listings = this.memoryListings;
    if (isDatabaseConnected()) {
      try {
        const dbItems = await Listing.find();
        if (dbItems.length > 0) {
          listings = dbItems;
        }
      } catch (err) {
        // fallback
      }
    }

    const totalListings = listings.length;
    const totalCo2SavedKg = Math.round(
      listings.reduce((sum, item) => sum + (item.co2SavedKg || 0), 0) + 1420
    );
    const totalDollarsSaved = Math.round(
      listings.reduce((sum, item) => sum + ((item.originalPrice || 0) - (item.price || item.sellingPrice || 0)), 0) + 12850
    );
    const freeItemsAvailable = listings.filter(i => i.listingType === 'free' || i.listingType === 'giveaway').length;

    return {
      totalListings,
      totalCo2SavedKg,
      totalDollarsSaved,
      freeItemsAvailable,
      activeStudents: 640,
      treesEquivalent: Math.round(totalCo2SavedKg / 21)
    };
  }
}

export const listingStore = new ListingStore();
