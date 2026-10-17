import { SAMPLE_LISTINGS } from '../data/sampleListings.js';
import { CATEGORIES } from '../data/categories.js';
import { Listing } from '../models/Listing.js';
import { isDatabaseConnected } from '../config/db.js';

class ListingStore {
  constructor() {
    this.memoryListings = JSON.parse(JSON.stringify(SAMPLE_LISTINGS));
    this.categories = [...CATEGORIES];
  }

  async getAll({ search, category, type, sort } = {}) {
    if (isDatabaseConnected()) {
      try {
        const query = {};

        if (category && category !== 'all') {
          if (category === 'giveaways') {
            query.listingType = 'free';
          } else {
            query.category = category.toLowerCase();
          }
        }

        if (type && type !== 'all') {
          query.listingType = type.toLowerCase();
        }

        if (search && search.trim() !== '') {
          const q = search.trim();
          query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { 'location.building': { $regex: q, $options: 'i' } }
          ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price-asc') sortOption = { price: 1 };
        else if (sort === 'price-desc') sortOption = { price: -1 };
        else if (sort === 'co2-desc') sortOption = { co2SavedKg: -1 };

        const dbListings = await Listing.find(query).sort(sortOption);
        if (dbListings.length > 0) {
          return dbListings.map(d => d.toJSON());
        }
      } catch (err) {
        console.warn('ListingStore Mongo Query failed, serving memory fallback:', err.message);
      }
    }

    // In-memory fallback
    let result = [...this.memoryListings];

    if (category && category !== 'all') {
      if (category === 'giveaways') {
        result = result.filter(item => item.listingType === 'free');
      } else {
        result = result.filter(item => item.category.toLowerCase() === category.toLowerCase());
      }
    }

    if (type && type !== 'all') {
      result = result.filter(item => item.listingType.toLowerCase() === type.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (item.location && item.location.building.toLowerCase().includes(q))
      );
    }

    if (sort) {
      switch (sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'co2-desc':
          result.sort((a, b) => (b.co2SavedKg || 0) - (a.co2SavedKg || 0));
          break;
        case 'newest':
        default:
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  async getById(id) {
    if (isDatabaseConnected()) {
      try {
        const item = await Listing.findById(id);
        if (item) return item.toJSON();
      } catch (err) {
        // id might be string format (e.g. 'item-101')
      }
    }
    return this.memoryListings.find(item => item.id === id || item._id === id) || null;
  }

  async create(itemData, user = null) {
    const sellerInfo = user ? {
      id: user._id?.toString() || user.id || 'usr-current',
      name: user.name,
      department: user.department || 'General Studies',
      year: user.year || 'Junior',
      avatar: user.avatar || '',
      karmaScore: user.karmaScore || 100,
      itemsReused: user.itemsReused || 0,
      verifiedStudent: !!user.isCollegeVerified
    } : (itemData.seller || {
      id: 'usr-current',
      name: 'Campus Student',
      department: 'Environmental Science',
      year: 'Sophomore',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      karmaScore: 180,
      itemsReused: 2,
      verifiedStudent: true
    });

    if (isDatabaseConnected()) {
      try {
        const newListing = await Listing.create({
          title: itemData.title,
          category: itemData.category || 'stationery',
          listingType: itemData.listingType || 'sell',
          price: Number(itemData.price) || 0,
          originalPrice: Number(itemData.originalPrice) || Number(itemData.price) * 2 || 0,
          condition: itemData.condition || 'Good',
          co2SavedKg: Number(itemData.co2SavedKg) || 8.5,
          description: itemData.description || '',
          imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          tags: itemData.tags || [itemData.category],
          seller: sellerInfo,
          location: itemData.location || {
            campusSpot: 'Student Union Eco Hub',
            building: 'Student Union',
            safeMeetingZone: true
          }
        });
        return newListing.toJSON();
      } catch (err) {
        console.warn('ListingStore DB creation error, falling back to memory:', err.message);
      }
    }

    const id = `item-${Date.now()}`;
    const newItem = {
      id,
      _id: id,
      title: itemData.title,
      category: itemData.category || 'stationery',
      listingType: itemData.listingType || 'sell',
      price: Number(itemData.price) || 0,
      originalPrice: Number(itemData.originalPrice) || Number(itemData.price) * 2 || 0,
      condition: itemData.condition || 'Good',
      co2SavedKg: Number(itemData.co2SavedKg) || 8.5,
      description: itemData.description || '',
      imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      tags: itemData.tags || [itemData.category],
      seller: sellerInfo,
      location: itemData.location || {
        campusSpot: 'Student Union Eco Hub',
        building: 'Student Union',
        safeMeetingZone: true
      },
      createdAt: new Date().toISOString(),
      status: 'available',
      viewsCount: 1
    };

    this.memoryListings.unshift(newItem);
    return newItem;
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
      listings.reduce((sum, item) => sum + (item.originalPrice - item.price), 0) + 12850
    );
    const freeItemsAvailable = listings.filter(i => i.listingType === 'free').length;

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
