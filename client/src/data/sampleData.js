export const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: 'LayoutGrid', count: 184 },
  { id: 'textbooks', name: 'Textbooks & Notes', icon: 'BookOpen', count: 42, co2Rate: 7.5 },
  { id: 'electronics', name: 'Calculators & Tech', icon: 'Cpu', count: 28, co2Rate: 28.0 },
  { id: 'lab-gear', name: 'Lab Coats & Gear', icon: 'FlaskConical', count: 19, co2Rate: 12.0 },
  { id: 'stationery', name: 'Stationery & Drafting', icon: 'PenTool', count: 35, co2Rate: 4.2 },
  { id: 'dorm', name: 'Dorm Essentials', icon: 'Home', count: 24, co2Rate: 35.0 },
  { id: 'giveaways', name: 'Free Giveaways', icon: 'Gift', count: 16, co2Rate: 8.0 }
];

export const INITIAL_LISTINGS = [
  {
    id: 'item-101',
    title: 'Campbell Biology (12th Edition) - Hardcover',
    category: 'textbooks',
    listingType: 'sell',
    price: 38,
    originalPrice: 165,
    condition: 'Like New',
    co2SavedKg: 9.8,
    description: 'Barely used for BIOL 1101 last semester. Clean pages, no highlighting or torn edges. Comes with unused mastering biology companion guide code pamphlet. Perfect for freshman bio sequence.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Biology', 'Pre-Med', 'Textbook', 'BIOL 1101'],
    seller: {
      id: 'usr-1',
      name: 'Maya Lin',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
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
    title: 'TI-84 Plus CE Color Graphing Calculator (Mint Green)',
    category: 'electronics',
    listingType: 'sell',
    price: 55,
    originalPrice: 140,
    condition: 'Like New',
    co2SavedKg: 32.5,
    description: 'Special edition Mint Green TI-84 Plus CE. Battery holds charge for weeks. Screen is flawless with no scratches. Comes with USB charging cable and original slide case cover. Required for MATH 131/132 and STATS 205.',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Calculator', 'Math', 'Calculus', 'Statistics', 'Engineering'],
    seller: {
      id: 'usr-2',
      name: 'Devon Vance',
      department: 'Computer Science',
      year: 'Senior (4th Year)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      karmaScore: 620,
      itemsReused: 12,
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
    title: '100% Cotton Chemistry Lab Coat (Unisex M) + UV Splash Goggles',
    category: 'lab-gear',
    listingType: 'free',
    price: 0,
    originalPrice: 45,
    condition: 'Good',
    co2SavedKg: 14.2,
    description: 'Passed CHEM 111 and organic chemistry! Passing this forward to an incoming student who needs PPE. Cleaned and freshly laundered. Includes anti-fog safety goggles conforming to OSHA/ANSI Z87.1 standards.',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
    tags: ['Lab Coat', 'PPE', 'Chemistry', 'Organic Chem'],
    seller: {
      id: 'usr-3',
      name: 'Elena Rostova',
      department: 'Biochemistry',
      year: 'Sophomore (2nd Year)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      karmaScore: 310,
      itemsReused: 4,
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
    title: 'Rotring Technical Drawing & Drafting Compasses Set',
    category: 'stationery',
    listingType: 'sell',
    price: 24,
    originalPrice: 75,
    condition: 'Like New',
    co2SavedKg: 5.6,
    description: 'Precision German drafting set including master bow compass, extension bar, technical pen adapters, and lead container. Finished my architectural foundations studio and no longer need it.',
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
    tags: ['Architecture', 'Drafting', 'Design', 'Stationery'],
    seller: {
      id: 'usr-4',
      name: 'Kofi Mensah',
      department: 'Architecture & Design',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      karmaScore: 540,
      itemsReused: 9,
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
    title: 'Stewart Calculus: Early Transcendentals (9th Edition)',
    category: 'textbooks',
    listingType: 'trade',
    price: 0,
    originalPrice: 190,
    condition: 'Good',
    co2SavedKg: 10.4,
    description: 'Looking to trade this essential math textbook for a Linear Algebra (Lay 6th Ed) or Physics for Scientists & Engineers. In solid condition with minor corner bumping, binding is 100% tight.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    tags: ['Math', 'Calculus', 'Textbook', 'STEM'],
    seller: {
      id: 'usr-5',
      name: 'Liam Chen',
      department: 'Mechanical Engineering',
      year: 'Sophomore (2nd Year)',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      karmaScore: 390,
      itemsReused: 5,
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
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    category: 'electronics',
    listingType: 'sell',
    price: 18,
    originalPrice: 38,
    condition: 'Like New',
    co2SavedKg: 18.0,
    description: 'High-resolution LCD natural textbook display. Approved for FE Exam and most department midterms. Solar and battery dual power. Perfect backup or primary calculator for engineering students.',
    imageUrl: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=800&q=80',
    tags: ['Calculator', 'Casio', 'Engineering', 'FE Exam'],
    seller: {
      id: 'usr-6',
      name: 'Aisha Patel',
      department: 'Civil & Environmental Engineering',
      year: 'Senior (4th Year)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      karmaScore: 780,
      itemsReused: 15,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Sustainability Hub Solar Terrace',
      building: 'Olver Design Building',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T18:10:00Z',
    status: 'available',
    viewsCount: 192
  },
  {
    id: 'item-107',
    title: 'Micron Fineliners & Bristol Paper Pad (Art Bundle)',
    category: 'stationery',
    listingType: 'free',
    price: 0,
    originalPrice: 28,
    condition: 'Good',
    co2SavedKg: 3.8,
    description: 'Unused Sakura Pigma Micron pens (0.3 & 0.5), 2 kneaded art erasers, and about 18 sheets left of smooth 9x12 Bristol paper. Free to any art or landscape architecture student!',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    tags: ['Art Supplies', 'Stationery', 'Micron', 'Drafting'],
    seller: {
      id: 'usr-7',
      name: 'Chloe Tremblay',
      department: 'Fine Arts',
      year: 'Freshman (1st Year)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      karmaScore: 210,
      itemsReused: 3,
      verifiedStudent: true
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
    title: 'Heavy-Duty Lab Safety Shield Goggles + Dissection Kit',
    category: 'lab-gear',
    listingType: 'sell',
    price: 15,
    originalPrice: 42,
    condition: 'Good',
    co2SavedKg: 8.5,
    description: 'Complete stainless steel anatomical dissection kit with scalpel handle, spare blades, forceps, and scissors in zip case. Paired with anti-chemical splash eye goggles.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    tags: ['Lab Gear', 'Biology', 'Dissection', 'Pre-Med'],
    seller: {
      id: 'usr-1',
      name: 'Maya Lin',
      department: 'Biological Sciences',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 485,
      itemsReused: 7,
      verifiedStudent: true
    },
    location: {
      campusSpot: 'Main Library 2nd Floor Cafe',
      building: 'W.E.B. Du Bois Library',
      safeMeetingZone: true
    },
    createdAt: '2026-10-15T15:20:00Z',
    status: 'available',
    viewsCount: 114
  }
];

export const DEMO_USER = {
  id: 'usr-current',
  name: 'Samira Rodriguez',
  email: 's.rodriguez@campus.edu',
  department: 'Environmental Policy & Economics',
  campus: 'North Campus',
  year: 'Junior (3rd Year)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  karmaScore: 485,
  itemsReused: 8,
  co2DivertedKg: 64.2,
  dollarsSaved: 320,
  verifiedStudent: true,
  badges: [
    { title: 'Zero Waste Champion', icon: 'Leaf', desc: 'Diverted >50kg CO2 from campus waste' },
    { title: 'STEM Recycler', icon: 'Cpu', desc: 'Shared lab & calculator tech with peers' },
    { title: 'Trusted Exchanger', icon: 'ShieldCheck', desc: '100% positive campus safe-zone pickups' }
  ]
};
