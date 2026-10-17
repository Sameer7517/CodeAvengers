import http from 'http';
import assert from 'node:assert';
import { app } from '../src/server.js';
import { listingStore } from '../src/services/listingStore.js';
import { exchangeStore } from '../src/services/exchangeStore.js';
import { circularSwapStore } from '../src/services/circularSwapStore.js';
import { inMemoryUserStore } from '../src/services/inMemoryUserStore.js';

let server;
let baseUrl;

const startTestServer = () => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
};

const stopTestServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
};

const makeRequest = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data, ok: response.ok };
};

const runE2EJourneys = async () => {
  console.log('\n🧪 =====================================================================');
  console.log('🧪 Starting CampusLoop Phase 6 End-to-End Reliability & Demo Test Suite');
  console.log('🧪 =====================================================================\n');

  await startTestServer();

  let passedTests = 0;
  let failedTests = 0;

  const pass = (msg) => {
    console.log(`  ✅ PASS: ${msg}`);
    passedTests++;
  };

  const fail = (msg, err) => {
    console.error(`  ❌ FAIL: ${msg}`);
    if (err) console.error('     Error Details:', err);
    failedTests++;
  };

  try {
    const timestamp = Date.now();

    // =========================================================================
    // JOURNEY 1: Register and Log In as Student A
    // =========================================================================
    console.log('\n👤 --- JOURNEY 1: Student A Registration & Login ---');
    const studentAEmail = `studentA_${timestamp}@campus.edu`;
    const regARes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Avery Morgan',
        email: studentAEmail,
        password: 'Password123!',
        department: 'Biochemistry',
        year: 'Junior (3rd Year)',
        campus: 'Science Quad'
      })
    });

    assert.strictEqual(regARes.status, 201, 'Student A registration should return 201');
    assert.strictEqual(regARes.data.user.isCollegeVerified, true, '.edu email must be verified');
    const tokenA = regARes.data.token;
    const userA = regARes.data.user;
    pass('Student A successfully registered with verified collegiate credentials');

    // Login verification for Student A
    const loginARes = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: studentAEmail, password: 'Password123!' })
    });
    assert.strictEqual(loginARes.status, 200, 'Student A login should succeed');
    assert.ok(loginARes.data.token, 'Student A issued valid JWT');
    pass('Student A successfully authenticated and received session token');

    // =========================================================================
    // JOURNEY 2: Student A Creates a Swap Listing
    // =========================================================================
    console.log('\n📦 --- JOURNEY 2: Student A Creates Swap Listing ---');
    const createSwapRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: `Organic Chemistry 8th Ed Textbook (Wade) - ${timestamp}`,
        category: 'textbooks',
        listingType: 'swap',
        condition: 'Like New',
        description: 'Hardcover with intact model kit chapter codes. Looking to swap for Physics 131 or TI Calculator.',
        desiredItems: 'Physics 131 Textbook or Casio Calculator',
        originalPrice: 180,
        campus: 'Science Quad',
        location: { campusSpot: 'Integrated Sciences Concourse', safeMeetingZone: true }
      })
    });

    assert.strictEqual(createSwapRes.status, 201, 'Swap listing creation should return 201');
    const swapListingA = createSwapRes.data.data;
    assert.strictEqual(swapListingA.status, 'available', 'Initial status must be available');
    assert.strictEqual(swapListingA.sellingPrice, 0, 'Swap listing price must be 0');
    assert.ok(swapListingA.co2SavedKg > 0, 'Calculated lifecycle CO2 savings');
    pass('Student A successfully created verified Swap listing');

    // =========================================================================
    // JOURNEY 3: Student B Registers, Logs In, and Discovers the Listing
    // =========================================================================
    console.log('\n🔍 --- JOURNEY 3: Student B Discovery in Independent Session ---');
    const studentBEmail = `studentB_${timestamp}@campus.edu`;
    const regBRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Blake Taylor',
        email: studentBEmail,
        password: 'Password123!',
        department: 'Physics',
        year: 'Sophomore (2nd Year)',
        campus: 'Central Campus'
      })
    });
    assert.strictEqual(regBRes.status, 201, 'Student B registration should return 201');
    const tokenB = regBRes.data.token;
    const userB = regBRes.data.user;

    // Student B creates an item of their own so they can offer it in swap
    const createItemBRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        title: `University Physics (Young & Freedman 15th Ed) - ${timestamp}`,
        category: 'textbooks',
        listingType: 'swap',
        condition: 'Good',
        description: 'Completed PHYS 131/132. Clean pages with minimal highlighting.',
        desiredItems: 'Organic Chemistry or Biology Textbook',
        originalPrice: 195,
        campus: 'Central Campus'
      })
    });
    assert.strictEqual(createItemBRes.status, 201);
    const itemB = createItemBRes.data.data;
    pass('Student B registered and listed physics textbook available for swap');

    // Student B discovers Student A's listing via search
    const searchRes = await makeRequest(`/api/listings?search=Organic+Chemistry&category=textbooks`);
    assert.strictEqual(searchRes.status, 200, 'Search query should succeed');
    const found = searchRes.data.data.find(it => it.id === swapListingA.id);
    assert.ok(found, "Student A's swap item discovered by Student B via search");
    pass("Student B discovered Student A's listing through marketplace search");

    // =========================================================================
    // JOURNEY 4: Submit Exchange Request & Acceptance by Student A
    // =========================================================================
    console.log('\n🤝 --- JOURNEY 4: Submit & Accept Exchange Request ---');
    const swapReqRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: swapListingA.id,
        offeredListingId: itemB.id,
        proposedMeetingTime: 'Tomorrow at 2:00 PM',
        proposedSpot: 'Main Library 2nd Floor Safe Zone',
        message: 'Hi Avery! Would love to trade my Physics text for your Organic Chem book.'
      })
    });

    assert.strictEqual(swapReqRes.status, 201, 'Swap proposal should return 201');
    const exchangeRequest = swapReqRes.data.data;
    assert.strictEqual(exchangeRequest.status, 'pending');
    pass('Student B submitted valid swap request offering their Physics textbook');

    // Student A receives and reviews the incoming proposal
    const incomingA = await makeRequest('/api/exchanges?role=incoming', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(incomingA.status, 200);
    const hasRequest = incomingA.data.data.some(r => r.id === exchangeRequest.id);
    assert.ok(hasRequest, 'Incoming proposal visible in Student A dashboard');

    // Student A accepts the proposal
    const acceptRes = await makeRequest(`/api/exchanges/${exchangeRequest.id}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(acceptRes.status, 200, 'Acceptance should succeed');
    assert.strictEqual(acceptRes.data.data.status, 'accepted');
    pass('Student A accepted the swap proposal');

    // =========================================================================
    // JOURNEY 5: Verify Reservation & Complete Handover
    // =========================================================================
    console.log('\n🔒 --- JOURNEY 5: Verify Reservations & Complete Handover ---');
    const listingADetail = await makeRequest(`/api/listings/${swapListingA.id}`);
    const listingBDetail = await makeRequest(`/api/listings/${itemB.id}`);

    assert.strictEqual(listingADetail.data.data.status, 'reserved', 'Target listing A is reserved');
    assert.strictEqual(listingBDetail.data.data.status, 'reserved', 'Offered listing B is reserved');
    pass('Both items are consistently reserved upon acceptance');

    // Complete the physical handover (Student A confirms receipt)
    const completeRes = await makeRequest(`/api/exchanges/${exchangeRequest.id}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(completeRes.status, 200, 'Handover completion should return 200');
    assert.strictEqual(completeRes.data.data.status, 'completed');
    pass('Handover successfully confirmed and marked completed');

    // Verify both listings transitioned to 'completed'
    const finalA = await makeRequest(`/api/listings/${swapListingA.id}`);
    const finalB = await makeRequest(`/api/listings/${itemB.id}`);
    assert.strictEqual(finalA.data.data.status, 'completed', 'Listing A status is completed');
    assert.strictEqual(finalB.data.data.status, 'completed', 'Listing B status is completed');
    pass('Both listings permanently transitioned to completed reuse');

    // =========================================================================
    // JOURNEY 6: Verify Dashboard & Sustainability Impact Updates
    // =========================================================================
    console.log('\n📊 --- JOURNEY 6: Dashboard & Sustainability Impact Synchronization ---');
    const impactRes = await makeRequest('/api/stats/impact');
    assert.strictEqual(impactRes.status, 200);
    const impactData = impactRes.data.data;

    // Both completed items must be tallied in completed metrics
    assert.ok(impactData.completedMetrics.totalReusedItems >= 2, 'Completed items counted in impact');
    assert.ok(impactData.completedMetrics.verifiedCo2SavedKg > 0, 'CO2 avoided credited');
    assert.ok(impactData.completedMetrics.actualDollarsSaved > 0, 'Dollar savings calculated from catalog');
    assert.ok(impactData.environmentalAssumptions.isEstimated, 'Assumptions clearly state isEstimated');
    pass('Campus sustainability dashboard successfully updated with verified completed metrics');

    // =========================================================================
    // JOURNEY 7: Test Give Away (Donation) Flow
    // =========================================================================
    console.log('\n🎁 --- JOURNEY 7: Free Item Give Away Flow ---');
    const giveAwayItemRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: `Free Chemistry Lab Safety Goggles - ${timestamp}`,
        category: 'lab-gear',
        listingType: 'giveaway',
        condition: 'Good',
        description: 'Passed my lab sequence, gifting these ANSI splash goggles to a freshman.',
        originalPrice: 25,
        campus: 'Science Quad'
      })
    });
    assert.strictEqual(giveAwayItemRes.status, 201);
    const giveAwayItem = giveAwayItemRes.data.data;

    // Student B requests free item (no offered item required)
    const giveReqRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: giveAwayItem.id,
        proposedMeetingTime: 'Tomorrow at 4:00 PM',
        proposedSpot: 'Science Quad Lobby',
        message: 'Would love these goggles for CHEM 111!'
      })
    });
    assert.strictEqual(giveReqRes.status, 201, 'Giveaway claim returns 201 without offered item');
    const giveRequest = giveReqRes.data.data;

    // Accept & Complete Giveaway
    await makeRequest(`/api/exchanges/${giveRequest.id}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const completeGiveaway = await makeRequest(`/api/exchanges/${giveRequest.id}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(completeGiveaway.status, 200);
    pass('Give Away donation flow completed: free item successfully claimed and recirculated');

    // =========================================================================
    // JOURNEY 8: Test Invalid & Unauthorized Actions (Security & Concurrency)
    // =========================================================================
    console.log('\n🛡️ --- JOURNEY 8: Security, Unauthorized Actions & Concurrency ---');

    // 1. Self-request prevention
    const selfReq = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ listingId: swapListingA.id, message: 'Requesting my own item' })
    });
    assert.strictEqual(selfReq.status, 400, 'Self-request blocked');
    pass('Blocked self-request on own listing (400 Bad Request)');

    // 2. Request on unavailable (completed) item
    const unavailReq = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ listingId: swapListingA.id, message: 'Item already completed' })
    });
    assert.strictEqual(unavailReq.status, 400, 'Request on completed item blocked');
    pass('Blocked exchange request on completed/unavailable item (400 Bad Request)');

    // 3. Unauthorized listing edit
    const unauthEdit = await makeRequest(`/api/listings/${swapListingA.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ title: 'Hacked Title' })
    });
    assert.strictEqual(unauthEdit.status, 403, 'Non-owner cannot edit listing');
    pass('Blocked unauthorized listing edit by non-owner (403 Forbidden)');

    // 4. Unauthorized listing deletion
    const unauthDelete = await makeRequest(`/api/listings/${swapListingA.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(unauthDelete.status, 403, 'Non-owner cannot delete listing');
    pass('Blocked unauthorized listing deletion by non-owner (403 Forbidden)');

    // 5. Unauthenticated request rejection
    const unauthCreate = await makeRequest('/api/listings', {
      method: 'POST',
      body: JSON.stringify({ title: 'Unauthenticated Item' })
    });
    assert.strictEqual(unauthCreate.status, 401, 'Unauthenticated request rejected');
    pass('Protected endpoint rejected unauthenticated request (401 Unauthorized)');

    // =========================================================================
    // JOURNEY 9: Circular Swap Finder & Participant Consent Enforcement
    // =========================================================================
    console.log('\n🔄 --- JOURNEY 9: Circular Swap Finder Multi-Party Loops ---');
    const suggestionsRes = await makeRequest('/api/circular-swap/suggestions', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(suggestionsRes.status, 200);
    const cycles = suggestionsRes.data.data.cycles;
    assert.ok(cycles.length > 0, 'Circular swap cycles discovered');

    const testCycle = cycles[0];
    assert.ok(testCycle.steps.every(s => s.reason), 'All steps provide transparent match explanations');
    pass('Discovered valid circular swap cycle with transparent affinity matching');

    // Verify non-binding suggestion: items remain available
    const firstItem = testCycle.steps[0].item;
    const itemCheck = await makeRequest(`/api/listings/${firstItem.id}`);
    assert.strictEqual(itemCheck.data.data.status, 'available');
    pass('Matches are suggestions only: items remain available and unreserved');

    // =========================================================================
    // JOURNEY 10: Private Account Data Protection
    // =========================================================================
    console.log('\n🔒 --- JOURNEY 10: Private Account Data Leakage Protection ---');
    const profileRes = await makeRequest('/api/auth/me', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(profileRes.status, 200);
    assert.strictEqual(profileRes.data.data.password, undefined, 'Password hash must never be returned in profile');

    const leaderboardRes = await makeRequest('/api/stats/leaderboard');
    assert.strictEqual(leaderboardRes.status, 200);
    for (const entry of leaderboardRes.data.data) {
      assert.strictEqual(entry.password, undefined, 'Password hash not leaked in leaderboard');
      assert.strictEqual(entry.email, undefined, 'Private email address not exposed in public leaderboard');
    }
    pass('Private user data (passwords, emails) strictly guarded from public exposure');

  } catch (err) {
    fail('E2E Journey test failed with unexpected error', err);
  } finally {
    await stopTestServer();

    console.log('\n=====================================================================');
    console.log(`📊 Phase 6 E2E Test Results: ${passedTests} Passed | ${failedTests} Failed`);
    console.log('=====================================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  }
};

runE2EJourneys();
