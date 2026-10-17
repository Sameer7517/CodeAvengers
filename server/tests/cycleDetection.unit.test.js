import assert from 'node:assert';
import {
  findCircularCycles,
  checkAffinity,
  buildDirectedGraph
} from '../src/services/cycleDetectionAlgorithm.js';

console.log('🧪 =====================================================================');
console.log('🧪 Starting CampusLoop Modular Cycle Detection Algorithm Unit Tests');
console.log('🧪 =====================================================================\n');

// ---------------------------------------------------------------------
// TEST 1: Direct Category Affinity Check
// ---------------------------------------------------------------------
console.log('🔍 --- TEST 1: Direct Category Affinity Check ---');

const itemTextbook = {
  id: 'item-1',
  studentId: 'student-A',
  studentName: 'Aarav Deshmukh',
  category: 'textbooks',
  wantedCategory: 'electronics'
};

const itemCalculator = {
  id: 'item-2',
  studentId: 'student-B',
  studentName: 'Rohan Shinde',
  category: 'electronics',
  wantedCategory: 'lab-gear'
};

const matchAB = checkAffinity(itemTextbook, itemCalculator);
assert.strictEqual(matchAB.matches, false, 'Student B wants lab-gear, not textbooks');

const matchBA = checkAffinity(itemCalculator, itemTextbook);
assert.strictEqual(matchBA.matches, true, 'Student A wants electronics, so B can give calculator to A');
assert.ok(matchBA.score >= 90, 'High match score for exact category affinity');

console.log('  ✅ PASS: checkAffinity correctly evaluates category wants and prevents mismatches');

// ---------------------------------------------------------------------
// TEST 2: Valid 3-Student Circular Cycle Detection (A -> B -> C -> A)
// ---------------------------------------------------------------------
console.log('\n🔄 --- TEST 2: Valid 3-Student Circular Loop Detection ---');

const sampleThreeStudentMarketplace = [
  // Student A: Has Book, Wants Calculator
  {
    id: 'book-101',
    title: 'Engineering Mathematics - I (M1) — Nirali Prakashan',
    category: 'textbooks',
    wantedCategory: 'electronics',
    originalPrice: 650,
    co2SavedKg: 8.5,
    ownerId: 'student-A',
    ownerName: 'Aarav Deshmukh'
  },
  // Student B: Has Calculator, Wants Lab Gear
  {
    id: 'calc-102',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    category: 'electronics',
    wantedCategory: 'lab-gear',
    originalPrice: 1695,
    co2SavedKg: 19.5,
    ownerId: 'student-B',
    ownerName: 'Rohan Shinde'
  },
  // Student C: Has Lab Gear, Wants Book
  {
    id: 'apron-103',
    title: 'Engineering Workshop Boiler Apron & Safety Goggles',
    category: 'lab-gear',
    wantedCategory: 'textbooks',
    originalPrice: 550,
    co2SavedKg: 14.2,
    ownerId: 'student-C',
    ownerName: 'Tanvi Kulkarni'
  }
];

const cycles = findCircularCycles(sampleThreeStudentMarketplace, { minLength: 3, maxLength: 3 });

assert.strictEqual(cycles.length, 1, 'Exactly one 3-way cycle should be detected');
const cycle = cycles[0];
assert.strictEqual(cycle.cycleType, '3-way');
assert.strictEqual(cycle.participantCount, 3);
assert.strictEqual(cycle.steps.length, 3);

// Verify step transfers:
// Step 1: Book from Aarav -> Tanvi (Tanvi wants book)
// Step 2: Apron from Tanvi -> Rohan (Rohan wants lab-gear)
// Step 3: Calc from Rohan -> Aarav (Aarav wants calculator)
assert.strictEqual(cycle.participants.length, 3);
const participantNames = cycle.participants.map(p => p.name);
assert.ok(participantNames.includes('Aarav Deshmukh'));
assert.ok(participantNames.includes('Rohan Shinde'));
assert.ok(participantNames.includes('Tanvi Kulkarni'));

// Verify environmental & financial aggregation
assert.strictEqual(cycle.totalCo2SavedKg, 42.2); // 8.5 + 19.5 + 14.2
assert.strictEqual(cycle.totalDollarsSaved, 2895); // 650 + 1695 + 550

console.log('  ✅ PASS: Discovered valid 3-student cycle (Aarav -> Rohan -> Tanvi)');
console.log(`     Summary: ${cycle.summary}`);
console.log(`     Total CO2 Diverted: ${cycle.totalCo2SavedKg} kg | Combined Savings: ₹${cycle.totalDollarsSaved}`);

// ---------------------------------------------------------------------
// TEST 3: No Cycle Detected When Items Do Not Match (Broken Chain)
// ---------------------------------------------------------------------
console.log('\n❌ --- TEST 3: No Cycle Detected on Mismatched Items ---');

const mismatchedMarketplace = [
  // Student A: Has Book, Wants Calculator
  {
    id: 'book-101',
    title: 'Engineering Mathematics - I (M1)',
    category: 'textbooks',
    wantedCategory: 'electronics',
    ownerId: 'student-A',
    ownerName: 'Aarav Deshmukh'
  },
  // Student B: Has Calculator, Wants Stationery (Not Lab Gear)
  {
    id: 'calc-102',
    title: 'Casio fx-991EX ClassWiz',
    category: 'electronics',
    wantedCategory: 'stationery', // Chain breaks here!
    ownerId: 'student-B',
    ownerName: 'Rohan Shinde'
  },
  // Student C: Has Lab Gear, Wants Book
  {
    id: 'apron-103',
    title: 'Engineering Workshop Boiler Apron',
    category: 'lab-gear',
    wantedCategory: 'textbooks',
    ownerId: 'student-C',
    ownerName: 'Tanvi Kulkarni'
  }
];

const mismatchedCycles = findCircularCycles(mismatchedMarketplace, { minLength: 3, maxLength: 3 });
assert.strictEqual(mismatchedCycles.length, 0, 'No cycle should be found when requirements do not close the loop');

console.log('  ✅ PASS: Correctly returns 0 cycles when circular chain cannot be completed');

// ---------------------------------------------------------------------
// TEST 4: Distinct Students Enforcement (Prevents Self-Trading)
// ---------------------------------------------------------------------
console.log('\n🛡️ --- TEST 4: Distinct Students Enforcement ---');

const duplicateStudentMarketplace = [
  // Student A owns Book and wants Calculator
  {
    id: 'book-101',
    category: 'textbooks',
    wantedCategory: 'electronics',
    ownerId: 'student-A',
    ownerName: 'Student A'
  },
  // Student A also owns Calculator and wants Lab Gear (Same Student!)
  {
    id: 'calc-102',
    category: 'electronics',
    wantedCategory: 'lab-gear',
    ownerId: 'student-A',
    ownerName: 'Student A'
  },
  // Student C has Lab Gear and wants Book
  {
    id: 'apron-103',
    category: 'lab-gear',
    wantedCategory: 'textbooks',
    ownerId: 'student-C',
    ownerName: 'Student C'
  }
];

const duplicateCycles = findCircularCycles(duplicateStudentMarketplace, { minLength: 3, maxLength: 3 });
assert.strictEqual(duplicateCycles.length, 0, 'Must require at least 3 distinct students, rejecting same-student duplicates');

console.log('  ✅ PASS: Rejected pseudo-loop where student traded with themselves');

// ---------------------------------------------------------------------
// TEST 5: Canonical Deduplication (No Redundant Cycle Rotations)
// ---------------------------------------------------------------------
console.log('\n🔄 --- TEST 5: Canonical Deduplication Test ---');

// The 3 items from TEST 2 form 1 unique cycle.
// Without canonical rotation, starting DFS at A, B, and C would produce 3 duplicate cycles:
// A -> B -> C, B -> C -> A, and C -> A -> B.
const deduplicatedCycles = findCircularCycles(sampleThreeStudentMarketplace, { minLength: 3, maxLength: 3 });
assert.strictEqual(deduplicatedCycles.length, 1, 'Must deduplicate equivalent cycle permutations into 1 canonical cycle');

console.log('  ✅ PASS: Successfully eliminated cycle rotation permutations');

console.log('\n=====================================================================');
console.log('🎉 ALL CYCLE DETECTION ALGORITHM UNIT TESTS PASSED (5 / 5)');
console.log('=====================================================================\n');
