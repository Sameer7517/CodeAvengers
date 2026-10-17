import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import { User, checkCollegeDomain } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { SAMPLE_LISTINGS } from '../data/sampleListings.js';

dotenv.config();

export const seedDatabase = async () => {
  console.log('🌱 Starting CampusLoop Database Seeding...');

  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Could not connect to MongoDB. Please ensure MONGODB_URI is set or local mongod is running.');
    process.exit(1);
  }

  try {
    // 1. Clear existing collections
    console.log('🧹 Clearing existing users and listings...');
    await User.deleteMany({});
    await Listing.deleteMany({});

    // 2. Create Realistic Demo Users
    console.log('👥 Creating demo student accounts...');
    
    // Seed Account 1: Samira Rodriguez (.edu Verified Student)
    const samira = await User.create({
      name: 'Samira Rodriguez',
      email: 's.rodriguez@campus.edu',
      password: 'CampusLoop2026!',
      department: 'Environmental Studies',
      year: 'Junior (3rd Year)',
      campus: 'North Campus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 8,
      co2DivertedKg: 64.2,
      dollarsSaved: 320,
      isCollegeVerified: true, // Verified by .edu institutional domain
      verificationStatus: 'verified',
      verificationMethod: 'institutional_email',
      verifiedAt: new Date('2026-09-01'),
      badges: [
        { title: 'Zero Waste Champion', icon: 'Leaf', desc: 'Diverted >50kg CO2 from campus waste' },
        { title: 'STEM Recycler', icon: 'Cpu', desc: 'Shared lab & calculator tech with peers' },
        { title: 'Trusted Exchanger', icon: 'ShieldCheck', desc: '100% positive campus safe-zone pickups' }
      ]
    });

    // Seed Account 2: Maya Lin (.edu Verified Student)
    const maya = await User.create({
      name: 'Maya Lin',
      email: 'maya.lin@campus.edu',
      password: 'CampusLoop2026!',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      campus: 'Science Quad',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
      co2DivertedKg: 42.5,
      dollarsSaved: 260,
      isCollegeVerified: true,
      verificationStatus: 'verified',
      verificationMethod: 'institutional_email',
      verifiedAt: new Date('2026-09-05'),
      badges: [
        { title: 'Pre-Med Recycler', icon: 'FlaskConical', desc: 'Shared textbooks & dissection kits' }
      ]
    });

    // Seed Account 3: Guest Student (Unverified - Non-College Domain to test verification logic)
    const guest = await User.create({
      name: 'Jordan Guest',
      email: 'guest.student@gmail.com',
      password: 'CampusLoop2026!',
      department: 'General Studies',
      year: 'Freshman (1st Year)',
      campus: 'Off-Campus',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      karmaScore: 50,
      itemsReused: 0,
      co2DivertedKg: 0,
      dollarsSaved: 0,
      isCollegeVerified: false, // NOT college verified because email domain is gmail.com
      verificationStatus: 'unverified',
      verificationMethod: 'none',
      verifiedAt: null,
      badges: []
    });

    console.log(`✅ Created 3 user accounts:`);
    console.log(`   - Verified Student: s.rodriguez@campus.edu (Password: CampusLoop2026!)`);
    console.log(`   - Verified Student: maya.lin@campus.edu (Password: CampusLoop2026!)`);
    console.log(`   - Unverified Student: guest.student@gmail.com (Password: CampusLoop2026!)`);

    // 3. Seed Realistic Listings
    console.log('📦 Seeding campus exchange listings...');
    const seededListings = SAMPLE_LISTINGS.map(item => {
      // Reassign to real seeded users
      const sellerUser = item.seller.name.includes('Maya') ? maya : samira;
      return {
        title: item.title,
        category: item.category,
        listingType: item.listingType,
        price: item.price,
        originalPrice: item.originalPrice,
        condition: item.condition,
        co2SavedKg: item.co2SavedKg,
        description: item.description,
        imageUrl: item.imageUrl,
        tags: item.tags,
        seller: {
          id: sellerUser._id.toString(),
          name: sellerUser.name,
          department: sellerUser.department,
          year: sellerUser.year,
          avatar: sellerUser.avatar,
          karmaScore: sellerUser.karmaScore,
          itemsReused: sellerUser.itemsReused,
          verifiedStudent: sellerUser.isCollegeVerified
        },
        location: item.location,
        status: item.status || 'available',
        viewsCount: item.viewsCount || 50
      };
    });

    await Listing.insertMany(seededListings);
    console.log(`✅ Seeded ${seededListings.length} realistic campus exchange listings!`);

    console.log('\n✨ Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await closeDB();
    console.log('👋 Database connection closed.');
  }
};

// Execute if run directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
