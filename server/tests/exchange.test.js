import http from 'http';
import assert from 'node:assert';
import { app } from '../src/server.js';
import { exchangeStore } from '../src/services/exchangeStore.js';
import { notificationStore } from '../src/services/notificationStore.js';

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

const runExchangeTests = async () => {
  console.log('\n🧪 =====================================================================');
  console.log('🧪 Starting CampusLoop Phase 4 Exchange Requests & Workflows Test Suite');
  console.log('🧪 =====================================================================\n');

  await startTestServer();

  let passed = 0;
  let failed = 0;

  const test = (description, fn) => {
    try {
      fn();
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${description}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  };

  try {
    // 1. Create two student accounts: Student A (Owner) and Student B (Requester)
    const uniqueSuffix = Date.now();
    const studentAEmail = `studentA_${uniqueSuffix}@campus.edu`;
    const studentBEmail = `studentB_${uniqueSuffix}@campus.edu`;

    const regARes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alex Rivera',
        email: studentAEmail,
        password: 'Password123!',
        department: 'Environmental Science',
        year: 'Senior (4th Year)'
      })
    });
    const tokenA = regARes.data.token;
    const userA = regARes.data.user;

    const regBRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jordan Chen',
        email: studentBEmail,
        password: 'Password123!',
        department: 'Mechanical Engineering',
        year: 'Junior (3rd Year)'
      })
    });
    const tokenB = regBRes.data.token;
    const userB = regBRes.data.user;

    const studentCEmail = `studentC_${uniqueSuffix}@campus.edu`;
    const regCRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Taylor Swift',
        email: studentCEmail,
        password: 'Password123!',
        department: 'Biochemistry',
        year: 'Sophomore (2nd Year)'
      })
    });
    const tokenC = regCRes.data.token;
    const userC = regCRes.data.user;

    test('Created 3 distinct student accounts for multi-student workflow tests', () => {
      assert.strictEqual(regARes.status, 201);
      assert.strictEqual(regBRes.status, 201);
      assert.strictEqual(regCRes.status, 201);
      assert.ok(tokenA && tokenB && tokenC);
    });

    // 2. Student A creates:
    //    - Swap Listing: "Physics Lab Manual"
    //    - Give Away Listing: "Free Chemistry Binder"
    //    - Sell Listing: "Engineering Drafting Ruler"
    const swapListingRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: 'Physics 151 Lab Manual (2026)',
        description: 'Clean manual with lab worksheets included. Looking to swap for Calculus notes or chemistry set.',
        category: 'textbooks',
        condition: 'Like New',
        listingType: 'swap',
        desiredItems: 'Calculus 2 Notes or Chem kit',
        campus: 'Central Campus'
      })
    });
    const swapListing = swapListingRes.data.data;

    const giveawayListingRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: 'Free Chemistry 3-Ring Binder',
        description: 'Heavy duty binder free to any freshman needing lab organization.',
        category: 'stationery',
        condition: 'Good',
        listingType: 'giveaway',
        campus: 'Science Quad'
      })
    });
    const giveawayListing = giveawayListingRes.data.data;

    const sellListingRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: 'Engineering Drafting Ruler Set',
        description: 'High precision aluminum triangular architect scale ruler for drafting.',
        category: 'stationery',
        condition: 'Like New',
        listingType: 'sell',
        sellingPrice: 15,
        price: 15,
        campus: 'Engineering Hall'
      })
    });
    const sellListing = sellListingRes.data.data;

    // 3. Student B creates their own listing to offer in swap:
    const offeredItemRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        title: 'TI-30X IIS Scientific Calculator',
        description: 'Used for general physics. Clean solar dual-power calculator.',
        category: 'electronics',
        condition: 'Like New',
        listingType: 'sell',
        sellingPrice: 12,
        price: 12,
        campus: 'North Campus'
      })
    });
    const offeredItem = offeredItemRes.data.data;

    // Student C creates an offered listing:
    const offeredItemCRes = await makeRequest('/api/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({
        title: 'Organic Chemistry Molecular Model Set',
        description: 'Complete molecular modeling kit for stereochemistry.',
        category: 'lab-gear',
        condition: 'Like New',
        listingType: 'swap',
        campus: 'Science Quad'
      })
    });
    const offeredItemC = offeredItemCRes.data.data;

    test('Created target listings (Swap, Giveaway, Sell) and offered listings', () => {
      assert.strictEqual(swapListingRes.status, 201);
      assert.strictEqual(giveawayListingRes.status, 201);
      assert.strictEqual(sellListingRes.status, 201);
      assert.strictEqual(offeredItemRes.status, 201);
      assert.strictEqual(offeredItemCRes.status, 201);
    });

    // 4. Test: Self-request prevention (Student A cannot request their own listing)
    const selfReqRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        offeredListingId: swapListing.id,
        proposedMeetingTime: 'Tomorrow at noon',
        message: 'Self request test'
      })
    });

    test('Prevent self-requests on own listings (400 Bad Request)', () => {
      assert.strictEqual(selfReqRes.status, 400);
      assert.strictEqual(selfReqRes.data.code, 'SELF_REQUEST_FORBIDDEN');
    });

    // 5. Test: Swap request without offered item rejected (400 Bad Request)
    const swapNoOfferRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        proposedMeetingTime: 'Today at 3 PM',
        message: 'Swap without item'
      })
    });

    test('Swap request requires offering an available item (400 Bad Request)', () => {
      assert.strictEqual(swapNoOfferRes.status, 400);
      assert.strictEqual(swapNoOfferRes.data.code, 'OFFERED_ITEM_REQUIRED');
    });

    // 6. Test: Offering an item not owned by requester is rejected (403 Forbidden)
    const unauthorizedOfferRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        offeredListingId: sellListing.id, // owned by Student A, not B
        proposedMeetingTime: 'Today at 3 PM',
        message: 'Offering someone else item'
      })
    });

    test('Offering an item not owned by requester returns 403 Forbidden', () => {
      assert.strictEqual(unauthorizedOfferRes.status, 403);
      assert.strictEqual(unauthorizedOfferRes.data.code, 'NOT_OFFERED_ITEM_OWNER');
    });

    // 7. Test: Valid Swap request creation
    const validSwapRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        offeredListingId: offeredItem.id,
        proposedMeetingTime: 'Tomorrow after 2:00 PM',
        proposedSpot: 'Main Library 2nd Floor Safe Zone',
        message: 'Hi Alex! Would love to trade my TI-30X calculator for your physics lab manual.'
      })
    });

    test('Valid swap request creation returns 201 Created', () => {
      assert.strictEqual(validSwapRes.status, 201);
      assert.strictEqual(validSwapRes.data.data.status, 'pending');
      assert.strictEqual(validSwapRes.data.data.type, 'swap');
    });
    const swapRequestId = validSwapRes.data.data.id;

    // Competing simultaneous request: Student C also requests Student A's swapListing while available
    const competingSwapRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        offeredListingId: offeredItemC.id,
        proposedMeetingTime: 'Tomorrow at 4:00 PM',
        proposedSpot: 'Science Quad Bench',
        message: 'Hi Alex! I would also like to swap my Chem Model kit for your physics manual!'
      })
    });
    const competingSwapId = competingSwapRes.data.data.id;

    test('Simultaneous competing swap request creation returns 201 Created', () => {
      assert.strictEqual(competingSwapRes.status, 201);
      assert.strictEqual(competingSwapRes.data.data.status, 'pending');
    });

    // 8. Test: Duplicate active request prevention (409 Conflict)
    const duplicateReqRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        offeredListingId: offeredItem.id,
        proposedMeetingTime: 'Friday morning',
        message: 'Duplicate attempt'
      })
    });

    test('Duplicate active request returns 409 Conflict', () => {
      assert.strictEqual(duplicateReqRes.status, 409);
      assert.strictEqual(duplicateReqRes.data.code, 'DUPLICATE_ACTIVE_REQUEST');
    });

    // 9. Test: Give Away request creation (does NOT require offered item)
    const giveawayReqRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: giveawayListing.id,
        proposedMeetingTime: 'Today @ 4:30 PM',
        proposedSpot: 'Science Quad Bench',
        message: 'Hi! I could really use this chemistry binder for my lab class.'
      })
    });

    test('Give Away request without offered item returns 201 Created', () => {
      assert.strictEqual(giveawayReqRes.status, 201);
      assert.strictEqual(giveawayReqRes.data.data.type, 'giveaway');
      assert.strictEqual(giveawayReqRes.data.data.status, 'pending');
    });
    const giveawayRequestId = giveawayReqRes.data.data.id;

    // 10. Test: Sell inquiry creation (without claiming fake payment processing)
    const sellInquiryRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: sellListing.id,
        proposedMeetingTime: 'Tomorrow @ 11:00 AM',
        proposedSpot: 'Engineering Hall Commons',
        message: 'Have exact $15 cash. Can meet by the student solar table.'
      })
    });

    test('Sell inquiry meetup request returns 201 Created', () => {
      assert.strictEqual(sellInquiryRes.status, 201);
      assert.strictEqual(sellInquiryRes.data.data.type, 'sell');
      assert.strictEqual(sellInquiryRes.data.data.status, 'pending');
    });
    const sellInquiryId = sellInquiryRes.data.data.id;

    // 11. Test: Requester cancels a pending request (Giveaway request)
    const cancelRes = await makeRequest(`/api/exchanges/${giveawayRequestId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenB}` }
    });

    test('Requester can cancel their pending request', () => {
      assert.strictEqual(cancelRes.status, 200);
      assert.strictEqual(cancelRes.data.data.status, 'cancelled');
    });

    // 12. Test: Non-requester cancelling request returns 403 Forbidden
    const cancelUnauthorizedRes = await makeRequest(`/api/exchanges/${sellInquiryId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` } // Owner trying to cancel
    });

    test('Non-requester cannot cancel request (403 Forbidden)', () => {
      assert.strictEqual(cancelUnauthorizedRes.status, 403);
    });

    // 13. Test: Non-owner accepting request returns 403 Forbidden
    const acceptUnauthorizedRes = await makeRequest(`/api/exchanges/${swapRequestId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenB}` } // Requester trying to accept
    });

    test('Non-owner cannot accept request (403 Forbidden)', () => {
      assert.strictEqual(acceptUnauthorizedRes.status, 403);
    });

    // 14. Test: Owner accepts Swap request -> target AND offered listings become reserved!
    const acceptSwapRes = await makeRequest(`/api/exchanges/${swapRequestId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    test('Owner accepts swap request: request becomes accepted', () => {
      assert.strictEqual(acceptSwapRes.status, 200);
      assert.strictEqual(acceptSwapRes.data.data.status, 'accepted');
    });

    // Check listings status in backend
    const checkTargetRes = await makeRequest(`/api/listings/${swapListing.id}`);
    const checkOfferedRes = await makeRequest(`/api/listings/${offeredItem.id}`);

    test('Accepting swap request reserves both target and offered listings consistently', () => {
      assert.strictEqual(checkTargetRes.data.data.status, 'reserved');
      assert.strictEqual(checkOfferedRes.data.data.status, 'reserved');
    });

    // 14b. Test: Competing simultaneous request cannot be accepted when item is already reserved (409 Conflict)
    const acceptCompetingRes = await makeRequest(`/api/exchanges/${competingSwapId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    test('Conflicting simultaneous reservation blocked when item is already reserved (409 Conflict)', () => {
      assert.strictEqual(acceptCompetingRes.status, 409);
      assert.strictEqual(acceptCompetingRes.data.code, 'LISTING_ALREADY_RESERVED');
    });

    // 15. Test: New request on reserved item is rejected (400 Bad Request)
    const reqOnReservedRes = await makeRequest('/api/exchanges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        listingId: swapListing.id,
        offeredListingId: offeredItem.id,
        proposedMeetingTime: 'Next week',
        message: 'Request on reserved item'
      })
    });

    test('Request creation on reserved item rejected (400 Bad Request)', () => {
      assert.strictEqual(reqOnReservedRes.status, 400);
      assert.strictEqual(reqOnReservedRes.data.code, 'ITEM_UNAVAILABLE');
    });

    // 16. Test: Owner rejects a pending request (Sell inquiry)
    const rejectRes = await makeRequest(`/api/exchanges/${sellInquiryId}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ reason: 'Time conflicts with my lab exam' })
    });

    test('Owner can decline pending request with reason', () => {
      assert.strictEqual(rejectRes.status, 200);
      assert.strictEqual(rejectRes.data.data.status, 'rejected');
    });

    // 17. Test: Handover confirmation & completion
    const completeRes = await makeRequest(`/api/exchanges/${swapRequestId}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    test('Completing exchange marks request as completed', () => {
      assert.strictEqual(completeRes.status, 200);
      assert.strictEqual(completeRes.data.data.status, 'completed');
    });

    const checkCompletedTarget = await makeRequest(`/api/listings/${swapListing.id}`);
    const checkCompletedOffered = await makeRequest(`/api/listings/${offeredItem.id}`);

    test('Completed exchange updates both associated listings to completed', () => {
      assert.strictEqual(checkCompletedTarget.data.data.status, 'completed');
      assert.strictEqual(checkCompletedOffered.data.data.status, 'completed');
    });

    // 18. Test: Fetch student requests history & filter by incoming/outgoing
    const incomingRes = await makeRequest('/api/exchanges?role=incoming', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const outgoingRes = await makeRequest('/api/exchanges?role=outgoing', {
      headers: { Authorization: `Bearer ${tokenB}` }
    });

    test('Fetch incoming requests for owner returns list', () => {
      assert.strictEqual(incomingRes.status, 200);
      assert.ok(Array.isArray(incomingRes.data.data));
      assert.ok(incomingRes.data.data.length >= 1);
    });

    test('Fetch outgoing requests for requester returns list', () => {
      assert.strictEqual(outgoingRes.status, 200);
      assert.ok(Array.isArray(outgoingRes.data.data));
      assert.ok(outgoingRes.data.data.length >= 1);
    });

    // 19. Test: In-app notifications retrieval
    const notifsBRes = await makeRequest('/api/notifications', {
      headers: { Authorization: `Bearer ${tokenB}` }
    });

    test('In-app notifications dispatched to student for request lifecycle events', () => {
      assert.strictEqual(notifsBRes.status, 200);
      assert.ok(Array.isArray(notifsBRes.data.data));
      assert.ok(notifsBRes.data.data.length >= 1);
      // Student B should have received request_accepted and handover_completed notifications
      const hasAcceptedOrCompleted = notifsBRes.data.data.some(
        n => n.type === 'request_accepted' || n.type === 'handover_completed'
      );
      assert.ok(hasAcceptedOrCompleted);
    });

    // 20. Test: Mark notification as read
    if (notifsBRes.data.data.length > 0) {
      const firstNotifId = notifsBRes.data.data[0].id || notifsBRes.data.data[0]._id;
      const readRes = await makeRequest(`/api/notifications/${firstNotifId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tokenB}` }
      });

      test('Mark notification as read updates status', () => {
        assert.strictEqual(readRes.status, 200);
        assert.strictEqual(readRes.data.data.read, true);
      });
    }

  } finally {
    await stopTestServer();
  }

  console.log('\n=====================================================================');
  console.log(`📊 Phase 4 Exchange Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=====================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
};

runExchangeTests();
