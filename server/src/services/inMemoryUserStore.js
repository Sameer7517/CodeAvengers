import bcrypt from 'bcryptjs';
import { checkCollegeDomain } from '../models/User.js';

/**
 * Resilient In-Memory User Store
 * Acts as an automated fallback when local MongoDB daemon is not running,
 * ensuring zero-friction local testing while mirroring Mongoose schema operations.
 */
class InMemoryUserStore {
  constructor() {
    this.users = [];
    this.initDefaultUsers();
  }

  initDefaultUsers() {
    // Synchronously hash password so users are immediately available upon import
    const hashedPassword = bcrypt.hashSync('CampusLoop2026!', 10);

    this.users = [
      {
        _id: '67b36f1c24e65a001a111111',
        id: '67b36f1c24e65a001a111111',
        name: 'Tanvi Kulkarni',
        email: 's.rodriguez@campus.edu',
        password: hashedPassword,
        department: 'Mechanical Engineering',
        year: 'Senior (4th Year)',
        campus: 'VJTI, Mumbai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        karmaScore: 680,
        itemsReused: 14,
        co2DivertedKg: 64.2,
        dollarsSaved: 4200,
        rupeesSaved: 4200,
        isCollegeVerified: true,
        verificationStatus: 'verified',
        verificationMethod: 'institutional_email',
        verifiedAt: new Date('2026-09-01'),
        badges: [
          { title: 'Zero Waste Champion', icon: 'Leaf', desc: 'Diverted >50kg CO2 from campus waste' },
          { title: 'Casio & Tech Recycler', icon: 'Cpu', desc: 'Recirculated Casio calculators & engineering supplies' },
          { title: 'Trusted Exchanger', icon: 'ShieldCheck', desc: '100% positive safe-zone handovers at VJTI Quad' }
        ],
        savedItems: ['item-102', 'item-103'],
        createdAt: new Date('2026-09-01'),
        updatedAt: new Date('2026-10-15')
      },
      {
        _id: '67b36f1c24e65a001a222222',
        id: '67b36f1c24e65a001a222222',
        name: 'Aarav Deshmukh',
        email: 'maya.lin@campus.edu',
        password: hashedPassword,
        department: 'Computer Engineering',
        year: 'Junior (3rd Year)',
        campus: 'COEP Technological University, Pune',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        karmaScore: 520,
        itemsReused: 8,
        co2DivertedKg: 42.5,
        dollarsSaved: 3850,
        rupeesSaved: 3850,
        isCollegeVerified: true,
        verificationStatus: 'verified',
        verificationMethod: 'institutional_email',
        verifiedAt: new Date('2026-09-05'),
        badges: [
          { title: 'Engineering Textbooks Recycler', icon: 'BookOpen', desc: 'Recirculated Nirali & TechKnowledge books' }
        ],
        savedItems: [],
        createdAt: new Date('2026-09-05'),
        updatedAt: new Date('2026-10-14')
      },
      {
        _id: '67b36f1c24e65a001a333333',
        id: '67b36f1c24e65a001a333333',
        name: 'Omkar Salunkhe',
        email: 'guest.student@gmail.com',
        password: hashedPassword,
        department: 'Automobile Engineering',
        year: 'Freshman (1st Year)',
        campus: 'VJTI, Mumbai',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        karmaScore: 50,
        itemsReused: 0,
        co2DivertedKg: 0,
        dollarsSaved: 0,
        rupeesSaved: 0,
        isCollegeVerified: false,
        verificationStatus: 'unverified',
        verificationMethod: 'none',
        verifiedAt: null,
        badges: [],
        savedItems: [],
        createdAt: new Date('2026-10-10'),
        updatedAt: new Date('2026-10-10')
      },
      {
        _id: '67b36f1c24e65a001a444444',
        id: '67b36f1c24e65a001a444444',
        name: 'Rohan Shinde',
        email: 'alex.chen@campus.edu',
        password: hashedPassword,
        department: 'Information Technology',
        year: 'Junior (3rd Year)',
        campus: 'PICT, Pune',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        karmaScore: 390,
        itemsReused: 5,
        co2DivertedKg: 35.8,
        dollarsSaved: 2800,
        rupeesSaved: 2800,
        isCollegeVerified: true,
        verificationStatus: 'verified',
        verificationMethod: 'institutional_email',
        verifiedAt: new Date('2026-09-12'),
        badges: [
          { title: 'Tech Recycler', icon: 'Cpu', desc: 'Active hardware & supplies sharer' }
        ],
        savedItems: [],
        createdAt: new Date('2026-09-12'),
        updatedAt: new Date('2026-10-14')
      }
    ];
  }


  findByEmail(email) {
    if (!email) return null;
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findById(id) {
    if (!id) return null;
    const user = this.users.find(u => u._id === id || u.id === id);
    if (!user) return null;
    // Return sanitized copy
    const { password, ...safeUser } = user;
    return safeUser;
  }

  findByIdWithPassword(id) {
    if (!id) return null;
    return this.users.find(u => u._id === id || u.id === id) || null;
  }

  async create(userData) {
    const existing = this.findByEmail(userData.email);
    if (existing) {
      const error = new Error('A student account with this email address already exists');
      error.code = 11000;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const isVerified = checkCollegeDomain(userData.email);
    const id = `usr-${Date.now()}`;

    const newUser = {
      _id: id,
      id: id,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      department: userData.department || 'General Studies',
      year: userData.year || 'Junior (3rd Year)',
      campus: userData.campus || 'Main Campus',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 100,
      itemsReused: 0,
      co2DivertedKg: 0,
      dollarsSaved: 0,
      isCollegeVerified: isVerified,
      verificationStatus: isVerified ? 'verified' : 'unverified',
      verificationMethod: isVerified ? 'institutional_email' : 'none',
      verifiedAt: isVerified ? new Date() : null,
      badges: isVerified ? [{ title: 'Verified Student', icon: 'ShieldCheck', desc: 'Confirmed .edu address' }] : [],
      savedItems: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  update(id, updateData) {
    const index = this.users.findIndex(u => u._id === id || u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updateData,
      updatedAt: new Date()
    };

    const { password, ...safeUser } = this.users[index];
    return safeUser;
  }
}

export const inMemoryUserStore = new InMemoryUserStore();
