/**
 * SAMPLE / DEMO LISTINGS DATA
 * 
 * Contains static demonstration data for initial seeding and offline testing.
 * Updated for Phase 3 with owner references, swap desired items, and availability statuses.
 */

export const SAMPLE_LISTINGS = [
  {
    id: 'item-101',
    _id: '67b36f1c24e65a002a101001',
    owner: '67b36f1c24e65a001a222222', // Maya Lin
    title: 'Campbell Biology (12th Edition) - Hardcover',
    category: 'textbooks',
    listingType: 'sell',
    price: 38,
    sellingPrice: 38,
    originalPrice: 165,
    condition: 'Like New',
    co2SavedKg: 9.8,
    description: 'Barely used for BIOL 1101 last semester. Clean pages, no highlighting or torn edges. Comes with unused mastering biology companion guide code pamphlet. Perfect for freshman bio sequence.',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Biology', 'Pre-Med', 'Textbook', 'BIOL 1101', 'STEM'],
    desiredItems: '',
    campus: 'Science Quad',
    seller: {
      id: '67b36f1c24e65a001a222222',
      name: 'Maya Lin',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      campus: 'Science Quad',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Main Library 2nd Floor Cafe',
      building: 'W.E.B. Du Bois Library',
      safeMeetingZone: true
    },
    createdAt: '2026-10-15T09:30:00Z',
    status: 'available',
    viewsCount: 142
  },
  {
    id: 'item-102',
    _id: '67b36f1c24e65a002a101002',
    owner: '67b36f1c24e65a001a111111', // Samira Rodriguez
    title: 'TI-84 Plus CE Color Graphing Calculator (Mint Green)',
    category: 'electronics',
    listingType: 'sell',
    price: 55,
    sellingPrice: 55,
    originalPrice: 140,
    condition: 'Like New',
    co2SavedKg: 32.5,
    description: 'Special edition Mint Green TI-84 Plus CE. Battery holds charge for weeks. Screen is flawless with no scratches. Comes with USB charging cable and original slide case cover. Required for MATH 131/132 and STATS 205.',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Calculator', 'Math', 'Calculus', 'Statistics', 'Engineering'],
    desiredItems: '',
    campus: 'North Campus',
    seller: {
      id: '67b36f1c24e65a001a111111',
      name: 'Samira Rodriguez',
      department: 'Environmental Studies',
      year: 'Junior (3rd Year)',
      campus: 'North Campus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 8,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Engineering Hall Commons / Atrium',
      building: 'Marston Hall',
      safeMeetingZone: true
    },
    createdAt: '2026-10-14T14:15:00Z',
    status: 'available',
    viewsCount: 289
  },
  {
    id: 'item-103',
    _id: '67b36f1c24e65a002a101003',
    owner: '67b36f1c24e65a001a222222', // Maya Lin
    title: '100% Cotton Chemistry Lab Coat (Unisex M) + UV Splash Goggles',
    category: 'lab-gear',
    listingType: 'free',
    price: 0,
    sellingPrice: 0,
    originalPrice: 45,
    condition: 'Good',
    co2SavedKg: 14.2,
    description: 'Passed CHEM 111 and organic chemistry! Passing this forward to an incoming student who needs PPE. Cleaned and freshly laundered. Includes anti-fog safety goggles conforming to OSHA/ANSI Z87.1 standards.',
    images: ['https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
    tags: ['Lab Coat', 'PPE', 'Chemistry', 'Organic Chem', 'Safety Goggles'],
    desiredItems: '',
    campus: 'Science Quad',
    seller: {
      id: '67b36f1c24e65a001a222222',
      name: 'Maya Lin',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      campus: 'Science Quad',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Integrated Sciences Building South Entrance',
      building: 'ISB Science Complex',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T11:00:00Z',
    status: 'available',
    viewsCount: 318
  },
  {
    id: 'item-104',
    _id: '67b36f1c24e65a002a101004',
    owner: '67b36f1c24e65a001a111111',
    title: 'Rotring Technical Drawing & Drafting Compasses Set',
    category: 'stationery',
    listingType: 'sell',
    price: 24,
    sellingPrice: 24,
    originalPrice: 75,
    condition: 'Like New',
    co2SavedKg: 5.6,
    description: 'Precision German drafting set including master bow compass, extension bar, technical pen adapters, and lead container. Finished my architectural foundations studio and no longer need it.',
    images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
    tags: ['Architecture', 'Drafting', 'Design', 'Stationery', 'Rotring'],
    desiredItems: '',
    campus: 'Central Campus',
    seller: {
      id: '67b36f1c24e65a001a111111',
      name: 'Samira Rodriguez',
      department: 'Environmental Studies',
      year: 'Junior (3rd Year)',
      campus: 'North Campus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 8,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Design Building First Floor Maker Space',
      building: 'Design Building',
      safeMeetingZone: true
    },
    createdAt: '2026-10-13T16:45:00Z',
    status: 'available',
    viewsCount: 165
  },
  {
    id: 'item-105',
    _id: '67b36f1c24e65a002a101005',
    owner: '67b36f1c24e65a001a222222',
    title: 'Stewart Calculus: Early Transcendentals (9th Edition)',
    category: 'textbooks',
    listingType: 'trade',
    price: 0,
    sellingPrice: 0,
    originalPrice: 190,
    condition: 'Good',
    co2SavedKg: 10.4,
    description: 'Looking to swap this essential math textbook for Linear Algebra (Lay 6th Ed) or Physics for Scientists & Engineers. In solid condition with minor corner bumping, binding is 100% tight.',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    tags: ['Math', 'Calculus', 'Textbook', 'STEM', 'Trade', 'Swap'],
    desiredItems: 'Linear Algebra (Lay 6th Ed) or University Physics 15th Ed',
    campus: 'Central Campus',
    seller: {
      id: '67b36f1c24e65a001a222222',
      name: 'Maya Lin',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      campus: 'Science Quad',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Campus Center Concourse by Green Wall',
      building: 'Student Union Complex',
      safeMeetingZone: true
    },
    createdAt: '2026-10-12T10:20:00Z',
    status: 'available',
    viewsCount: 204
  },
  {
    id: 'item-106',
    _id: '67b36f1c24e65a002a101006',
    owner: '67b36f1c24e65a001a111111',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    category: 'electronics',
    listingType: 'sell',
    price: 18,
    sellingPrice: 18,
    originalPrice: 38,
    condition: 'Like New',
    co2SavedKg: 18.0,
    description: 'High-resolution LCD natural textbook display. Approved for FE Exam and most department midterms. Solar and battery dual power. Perfect backup or primary calculator for engineering students.',
    images: ['https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=800&q=80',
    tags: ['Calculator', 'Casio', 'Engineering', 'FE Exam', 'Physics'],
    desiredItems: '',
    campus: 'North Campus',
    seller: {
      id: '67b36f1c24e65a001a111111',
      name: 'Samira Rodriguez',
      department: 'Environmental Studies',
      year: 'Junior (3rd Year)',
      campus: 'North Campus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 8,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Sustainability Hub Solar Terrace',
      building: 'Olver Design Building',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T18:10:00Z',
    status: 'reserved', // Demonstrates Reserved status
    viewsCount: 192
  },
  {
    id: 'item-107',
    _id: '67b36f1c24e65a002a101007',
    owner: '67b36f1c24e65a001a333333', // Guest unverified student
    title: 'Micron Fineliners & Bristol Paper Pad (Art Bundle)',
    category: 'stationery',
    listingType: 'free',
    price: 0,
    sellingPrice: 0,
    originalPrice: 28,
    condition: 'Good',
    co2SavedKg: 3.8,
    description: 'Unused Sakura Pigma Micron pens (0.3 & 0.5), 2 kneaded art erasers, and about 18 sheets left of smooth 9x12 Bristol paper. Free to any art or landscape architecture student!',
    images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    tags: ['Art Supplies', 'Stationery', 'Micron', 'Drafting', 'Free'],
    desiredItems: '',
    campus: 'Off-Campus',
    seller: {
      id: '67b36f1c24e65a001a333333',
      name: 'Jordan Guest',
      department: 'General Studies',
      year: 'Freshman (1st Year)',
      campus: 'Off-Campus',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      karmaScore: 50,
      itemsReused: 0,
      isCollegeVerified: false,
      verifiedStudent: false
    },
    location: {
      campusSpot: 'Fine Arts Center Breezeway',
      building: 'Fine Arts Center',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T14:40:00Z',
    status: 'available',
    viewsCount: 177
  },
  {
    id: 'item-108',
    _id: '67b36f1c24e65a002a101008',
    owner: '67b36f1c24e65a001a222222',
    title: 'Heavy-Duty Lab Safety Shield Goggles + Dissection Kit',
    category: 'lab-gear',
    listingType: 'sell',
    price: 15,
    sellingPrice: 15,
    originalPrice: 42,
    condition: 'Good',
    co2SavedKg: 8.5,
    description: 'Complete stainless steel anatomical dissection kit with scalpel handle, spare blades, forceps, and scissors in zip case. Paired with anti-chemical splash eye goggles.',
    images: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    tags: ['Lab Gear', 'Biology', 'Dissection', 'Pre-Med'],
    desiredItems: '',
    campus: 'Science Quad',
    seller: {
      id: '67b36f1c24e65a001a222222',
      name: 'Maya Lin',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      campus: 'Science Quad',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
      isCollegeVerified: true,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Main Library 2nd Floor Cafe',
      building: 'W.E.B. Du Bois Library',
      safeMeetingZone: true
    },
    createdAt: '2026-10-15T15:20:00Z',
    status: 'completed', // Demonstrates Completed status
    viewsCount: 114
  }
];
