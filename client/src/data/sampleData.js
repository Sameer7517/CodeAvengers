export const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: 'LayoutGrid', count: 184 },
  { id: 'textbooks', name: 'Books & Textbooks', icon: 'BookOpen', count: 52, co2Rate: 7.5 },
  { id: 'electronics', name: 'Calculators & Tech', icon: 'Calculator', count: 34, co2Rate: 18.5 },
  { id: 'lab-gear', name: 'Lab Supplies & PPE', icon: 'FlaskConical', count: 28, co2Rate: 12.0 },
  { id: 'stationery', name: 'Stationery & Drafting', icon: 'PenTool', count: 46, co2Rate: 4.2 },
  { id: 'dorm', name: 'Hostel & Essentials', icon: 'Home', count: 24, co2Rate: 35.0 },
  { id: 'giveaways', name: 'Free Giveaways', icon: 'Gift', count: 18, co2Rate: 8.0 }
];

export const INITIAL_LISTINGS = [
  {
    id: 'item-101',
    title: 'Engineering Mathematics - I (M1) — Nirali Prakashan',
    category: 'textbooks',
    listingType: 'sell',
    price: 240,
    originalPrice: 650,
    condition: 'Like New',
    co2SavedKg: 8.5,
    description: 'Nirali Prakashan Engineering Mathematics-I (M1) syllabus for First Year Engineering (SPPU / Mumbai Univ). Clean pages with zero pen marks or torn sheets. Perfect condition for Sem 1 university exams.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Nirali Prakashan', 'Engineering Maths', 'M1', 'SPPU', 'First Year'],
    seller: {
      id: 'usr-1',
      name: 'Aarav Deshmukh',
      department: 'Computer Engineering',
      year: 'Junior (3rd Year)',
      campus: 'COEP Technological University, Pune',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      karmaScore: 520,
      itemsReused: 8,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'Central Reading Hall (2nd Floor)',
      building: 'COEP Main Library',
      safeMeetingZone: true
    },
    createdAt: '2026-10-15T09:30:00Z',
    status: 'available',
    viewsCount: 184
  },
  {
    id: 'item-102',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator (552 Functions)',
    category: 'electronics',
    listingType: 'sell',
    price: 850,
    originalPrice: 1695,
    condition: 'Like New',
    co2SavedKg: 19.5,
    description: 'Authentic Casio fx-991EX ClassWiz with high-resolution Natural Textbook Display. Dual power (Solar + Battery). Approved for SPPU, Mumbai University, and GATE/FE exams. Screen is completely scratch-free with original hard slide case.',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Casio', 'Calculator', 'ClassWiz', 'fx-991EX', 'Engineering'],
    seller: {
      id: 'usr-2',
      name: 'Rohan Shinde',
      department: 'Mechanical Engineering',
      year: 'Senior (4th Year)',
      campus: 'VJTI, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      karmaScore: 680,
      itemsReused: 14,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'Mechanical Workshop Quadrangle',
      building: 'VJTI Main Quadrangle',
      safeMeetingZone: true
    },
    createdAt: '2026-10-14T14:15:00Z',
    status: 'available',
    viewsCount: 342
  },
  {
    id: 'item-103',
    title: 'Engineering Workshop Navy Blue Apron + Chemistry Splash Goggles',
    category: 'lab-gear',
    listingType: 'free',
    price: 0,
    originalPrice: 550,
    condition: 'Good',
    co2SavedKg: 14.2,
    description: 'Passed First Year workshop & chemistry practicals! Giving away this standard 100% thick cotton navy blue workshop boiler apron (Unisex size M) and anti-fog lab goggles to any junior. Cleaned and freshly ironed.',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
    tags: ['Workshop Apron', 'Lab Gear', 'PPE', 'Chemistry Goggles', 'Engineering'],
    seller: {
      id: 'usr-3',
      name: 'Tanvi Kulkarni',
      department: 'Civil Engineering',
      year: 'Sophomore (2nd Year)',
      campus: 'PICT, Pune',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      karmaScore: 410,
      itemsReused: 6,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'Student Canteen Lawn Area',
      building: 'PICT Campus Center',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T11:00:00Z',
    status: 'available',
    viewsCount: 310
  },
  {
    id: 'item-104',
    title: 'Omega Deluxe Mini Drafter + Engineering Drawing Container Tube',
    category: 'stationery',
    listingType: 'sell',
    price: 320,
    originalPrice: 850,
    condition: 'Like New',
    co2SavedKg: 6.2,
    description: 'Heavy-duty steel clamp Omega Mini Drafter with unbroken transparent scales and black protective carry bag. Includes waterproof engineering drawing sheet holder container tube. Essential for Engineering Graphics (EG) exams.',
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
    tags: ['Mini Drafter', 'Omega', 'Engineering Graphics', 'Drawing Tube', 'Stationery'],
    seller: {
      id: 'usr-4',
      name: 'Aditya Patil',
      department: 'Electrical Engineering',
      year: 'Junior (3rd Year)',
      campus: 'Walchand College of Engineering, Sangli',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      karmaScore: 590,
      itemsReused: 11,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'Main Porch & Fountain Area',
      building: 'WCE Administrative Building',
      safeMeetingZone: true
    },
    createdAt: '2026-10-13T16:45:00Z',
    status: 'available',
    viewsCount: 220
  },
  {
    id: 'item-105',
    title: 'Basic Electrical Engineering (BEE) — TechKnowledge Publications',
    category: 'textbooks',
    listingType: 'trade',
    price: 0,
    originalPrice: 580,
    condition: 'Good',
    co2SavedKg: 9.5,
    description: 'TechKnowledge BEE textbook covering DC/AC circuits, Transformers, and Electrical Machines with solved university question papers. Looking to swap for Engineering Mechanics (Nirali Prakashan) or Data Structures book.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    tags: ['TechKnowledge', 'BEE', 'Electrical Engineering', 'Textbook', 'SPPU'],
    desiredItems: 'Engineering Mechanics (Nirali) or Data Structures (Technical)',
    seller: {
      id: 'usr-5',
      name: 'Sneha More',
      department: 'Information Technology',
      year: 'Sophomore (2nd Year)',
      campus: 'MIT World Peace University, Pune',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      karmaScore: 430,
      itemsReused: 6,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'World Peace Dome Plaza',
      building: 'MIT-WPU Central Library',
      safeMeetingZone: true
    },
    createdAt: '2026-10-12T10:20:00Z',
    status: 'available',
    viewsCount: 248
  },
  {
    id: 'item-106',
    title: 'Casio fx-991MS 2nd Gen Scientific Calculator (Non-Programmable)',
    category: 'electronics',
    listingType: 'sell',
    price: 490,
    originalPrice: 995,
    condition: 'Like New',
    co2SavedKg: 16.0,
    description: 'Original Casio fx-991MS 2nd Generation 401 functions. Standard university-compliant non-programmable scientific calculator. Two-line display, matrix and complex number operations. Slide-on hard case included.',
    imageUrl: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=800&q=80',
    tags: ['Casio', 'Calculator', 'fx-991MS', 'Scientific Calculator', 'SPPU Approved'],
    seller: {
      id: 'usr-6',
      name: 'Prathamesh Jadhav',
      department: 'Mechanical Engineering',
      year: 'Senior (4th Year)',
      campus: 'COEP Technological University, Pune',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      karmaScore: 820,
      itemsReused: 16,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'Boat Club & Riverfront Deck',
      building: 'COEP Boat Club',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T18:10:00Z',
    status: 'available',
    viewsCount: 295
  },
  {
    id: 'item-107',
    title: 'Data Structures & Algorithms (DSA) — Technical Publications',
    category: 'textbooks',
    listingType: 'trade',
    price: 0,
    originalPrice: 620,
    condition: 'Like New',
    co2SavedKg: 9.8,
    description: 'Technical Publications DSA (A.A. Puntambekar) textbook with complete C++ implementations for Stacks, Queues, Trees, Graphs, and Hash Tables. Looking to swap for Database Management Systems (DBMS) book.',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    tags: ['Technical Publications', 'DSA', 'Algorithms', 'Computer Engineering', 'SPPU'],
    desiredItems: 'Database Management Systems (TechKnowledge) or Operating Systems book',
    seller: {
      id: 'usr-7',
      name: 'Priyanka Gaikwad',
      department: 'Computer Engineering',
      year: 'Junior (3rd Year)',
      campus: 'Government College of Engineering, Karad',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      karmaScore: 490,
      itemsReused: 7,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'Academic Complex Reading Room',
      building: 'GCEK Central Library',
      safeMeetingZone: true
    },
    createdAt: '2026-10-16T14:40:00Z',
    status: 'available',
    viewsCount: 212
  },
  {
    id: 'item-108',
    title: 'Camlin Engineering Drawing Instrument Box + Set Squares Set',
    category: 'stationery',
    listingType: 'sell',
    price: 180,
    originalPrice: 480,
    condition: 'Good',
    co2SavedKg: 4.8,
    description: 'Camlin compass set with technical lead attachment, beam compass extension, 45° & 60° acrylic set squares, and flexible curve ruler. Perfect for first-year engineering drawing students.',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    tags: ['Camlin', 'Drawing Instruments', 'Set Squares', 'Engineering Drawing'],
    seller: {
      id: 'usr-8',
      name: 'Omkar Salunkhe',
      department: 'Automobile Engineering',
      year: 'Sophomore (2nd Year)',
      campus: 'VJTI, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      karmaScore: 340,
      itemsReused: 4,
      verifiedStudent: true,
      isCollegeVerified: true
    },
    location: {
      campusSpot: 'VJTI Main Canteen Porch',
      building: 'VJTI Student Center',
      safeMeetingZone: true
    },
    createdAt: '2026-10-15T15:20:00Z',
    status: 'available',
    viewsCount: 154
  }
];

export const DEMO_USER = {
  id: 'usr-current',
  name: 'Sameer Patil',
  email: 'sameer.patil@coep.ac.in',
  department: 'Computer Engineering',
  campus: 'COEP Technological University, Pune',
  year: 'Junior (3rd Year)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  karmaScore: 560,
  itemsReused: 9,
  co2DivertedKg: 78.4,
  dollarsSaved: 4200,
  rupeesSaved: 4200,
  verifiedStudent: true,
  isCollegeVerified: true,
  badges: [
    { title: 'Campus Eco-Champion', icon: 'Leaf', desc: 'Diverted >50kg CO2 from campus waste' },
    { title: 'Casio & Tech Recycler', icon: 'Calculator', desc: 'Recirculated calculators and engineering supplies' },
    { title: 'Trusted Exchanger', icon: 'ShieldCheck', desc: '100% verified safe-zone handovers at COEP Library' }
  ]
};
