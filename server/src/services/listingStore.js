import { SAMPLE_LISTINGS } from '../data/sampleListings.js';
import { CATEGORIES } from '../data/categories.js';

/**
 * Repository layer separating demo sample data from database operations.
 * Allows in-memory additions during runtime while maintaining sample isolation.
 */
class ListingStore {
  constructor() {
    // Clone sample listings to ensure original source data remains pristine
    this.listings = JSON.parse(JSON.stringify(SAMPLE_LISTINGS));
    this.categories = [...CATEGORIES];
  }

  getAll({ search, category, type, sort } = {}) {
    let result = [...this.listings];

    // Filter by Category
    if (category && category !== 'all') {
      result = result.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Listing Type (sell, free, trade, borrow)
    if (type && type !== 'all') {
      result = result.filter(item => item.listingType.toLowerCase() === type.toLowerCase());
    }

    // Search query across title, description, and tags
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (item.location && item.location.building.toLowerCase().includes(q))
      );
    }

    // Sorting
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

  getById(id) {
    return this.listings.find(item => item.id === id) || null;
  }

  create(itemData) {
    const id = `item-${Date.now()}`;
    const newItem = {
      id,
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
      seller: itemData.seller || {
        id: 'usr-current',
        name: 'Jordan Miller',
        department: 'Environmental Science',
        year: 'Sophomore',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        karmaScore: 180,
        itemsReused: 2,
        verifiedStudent: true
      },
      location: itemData.location || {
        campusSpot: 'Student Union Eco Hub',
        building: 'Student Union',
        safeMeetingZone: true
      },
      createdAt: new Date().toISOString(),
      status: 'available',
      viewsCount: 1
    };

    // Prepend to top of list
    this.listings.unshift(newItem);
    return newItem;
  }

  getCategories() {
    return this.categories;
  }

  getStats() {
    const totalListings = this.listings.length;
    const totalCo2SavedKg = Math.round(
      this.listings.reduce((sum, item) => sum + (item.co2SavedKg || 0), 0) + 1420 // Added historical campus baseline
    );
    const totalDollarsSaved = Math.round(
      this.listings.reduce((sum, item) => sum + (item.originalPrice - item.price), 0) + 12850
    );
    const freeItemsAvailable = this.listings.filter(i => i.listingType === 'free').length;

    return {
      totalListings,
      totalCo2SavedKg,
      totalDollarsSaved,
      freeItemsAvailable,
      activeStudents: 640,
      treesEquivalent: Math.round(totalCo2SavedKg / 21) // approx 21kg CO2 absorbed per mature tree/year
    };
  }
}

export const listingStore = new ListingStore();
