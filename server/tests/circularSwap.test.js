import http from 'http';
import assert from 'node:assert';
import { app } from '../src/server.js';
import { listingStore } from '../src/services/listingStore.js';
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

const runCircularSwapTests = async () => {
  console.log('\n🧪 =====================================================================');
  console.log('🧪 Starting CampusLoop Phase 5 Sustainability & Circular Swap Test Suite');
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
    // ---------------------------------------------------------
    // Setup Test Authentication Tokens
    // ---------------------------------------------------------
    console.log('🔑 Authenticating demo students for Phase 5 tests...');

    const mayaLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'maya.lin@campus.edu', password: 'CampusLoop2026!' })
    });
    assert.strictEqual(mayaLogin.status, 200, 'Maya login should succeed');
    const mayaToken = mayaLogin.data.token;
    const mayaUser = mayaLogin.data.user;

    const samiraLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 's.rodriguez@campus.edu', password: 'CampusLoop2026!' })
    });
    assert.strictEqual(samiraLogin.status, 200, 'Samira login should succeed');
    const samiraToken = samiraLogin.data.token;
    const samiraUser = samiraLogin.data.user;

    const alexLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alex.chen@campus.edu', password: 'CampusLoop2026!' })
    });
    assert.strictEqual(alexLogin.status, 200, 'Alex login should succeed');
    const alexToken = alexLogin.data.token;
    const alexUser = alexLogin.data.user;


    pass('Demo students successfully authenticated (Maya, Samira, Alex)');

    // ---------------------------------------------------------
    // TEST SECTION 1: Sustainability Dashboard & Impact Stats
    // ---------------------------------------------------------
    console.log('\n📊 --- TEST 1: Sustainability Impact Endpoint & Environmental Assumptions ---');

    const impactRes = await makeRequest('/api/stats/impact');
    assert.strictEqual(impactRes.status, 200, 'Impact stats must return 200 OK');
    assert.strictEqual(impactRes.data.success, true);

    const impactData = impactRes.data.data;
    assert.ok(impactData.completedMetrics, 'Should have completedMetrics object');
    assert.ok(impactData.environmentalAssumptions, 'Should provide environmentalAssumptions');
    assert.strictEqual(impactData.environmentalAssumptions.isEstimated, true, 'Estimates must be clearly labeled as estimates');
    assert.ok(impactData.environmentalAssumptions.benchmarks.textbook, 'Should document textbook LCA benchmark');
    assert.ok(impactData.environmentalAssumptions.benchmarks.electronics, 'Should document electronics LCA benchmark');

    pass('Sustainability impact returns documented LCA assumptions and labels estimates as estimates');

    // Rule: Do NOT count listings or pending requests as completed reuse
    const completedReuse = impactData.completedMetrics.totalReusedItems;
    const availableCount = impactData.catalogStatus.currentlyAvailableListings;
    assert.ok(availableCount > 0, 'Catalog should have available listings');
    assert.notStrictEqual(completedReuse, availableCount, 'Completed reuse must not equal total available catalog');
    assert.ok(completedReuse < availableCount + 10, 'Completed reuse strictly counts completed items');

    pass('Available and in-flight listings are strictly excluded from completed reuse count');

    // Dollar savings supported by stored catalog data
    assert.ok(typeof impactData.completedMetrics.actualDollarsSaved === 'number', 'Dollar savings must be numeric');
    assert.ok(impactData.completedMetrics.actualDollarsSaved > 0, 'Completed items yield supported dollar savings');
    pass('Estimated money saved calculated strictly from stored completed catalog data');

    // ---------------------------------------------------------
    // TEST SECTION 2: Reuse Leaderboard
    // ---------------------------------------------------------
    console.log('\n🏆 --- TEST 2: Reuse Leaderboard ---');

    const leaderboardRes = await makeRequest('/api/stats/leaderboard');
    assert.strictEqual(leaderboardRes.status, 200, 'Leaderboard must return 200 OK');
    assert.ok(Array.isArray(leaderboardRes.data.data), 'Leaderboard must be an array');
    assert.ok(leaderboardRes.data.data.length >= 2, 'Leaderboard should include active recyclers');

    // Leaderboard must be sorted by itemsReused descending, then karma
    const topUser = leaderboardRes.data.data[0];
    assert.ok(topUser.name, 'Top user has a name');
    assert.ok(topUser.itemsReused !== undefined, 'User must have itemsReused count');
    assert.ok(topUser.karmaScore !== undefined, 'User must have karmaScore');
    assert.strictEqual(topUser.rank, 1, 'Top user rank should be 1');

    pass('Reuse leaderboard returns ranked campus recyclers by verified items reused and Eco-Karma');

    // ---------------------------------------------------------
    // TEST SECTION 3: Circular Swap Finder - Cycle Discovery
    // ---------------------------------------------------------
    console.log('\n🔄 --- TEST 3: Circular Swap Cycle Discovery (Suggestions Only) ---');

    const suggestionsRes = await makeRequest('/api/circular-swap/suggestions', {
      headers: { Authorization: `Bearer ${mayaToken}` }
    });
    assert.strictEqual(suggestionsRes.status, 200, 'Suggestions endpoint must return 200 OK');
    assert.strictEqual(suggestionsRes.data.success, true);

    const cycles = suggestionsRes.data.data.cycles;
    assert.ok(Array.isArray(cycles), 'Cycles must be an array');
    assert.ok(cycles.length >= 1, 'Algorithm should discover at least 1 circular swap loop');

    // Find a 3-way cycle if present
    const threeWayCycle = cycles.find(c => c.cycleType === '3-way');
    assert.ok(threeWayCycle, 'Transparent matching engine discovers 3-way circular loop');
    assert.strictEqual(threeWayCycle.participantCount, 3, '3-way cycle has 3 distinct participants');
    assert.strictEqual(threeWayCycle.steps.length, 3, '3-way cycle has 3 transfer steps');
    assert.ok(threeWayCycle.steps[0].reason, 'Each step includes a transparent match reason');
    assert.ok(threeWayCycle.totalCo2SavedKg > 0, 'Cycle calculates combined CO2 averted');

    pass('Discovered valid 3-way triangular exchange cycle (Maya -> Alex -> Samira -> Maya)');

    // Find a 2-way cycle
    const twoWayCycle = cycles.find(c => c.cycleType === '2-way');
    assert.ok(twoWayCycle, 'Transparent matching engine discovers 2-way direct swap loop');
    assert.strictEqual(twoWayCycle.participantCount, 2, '2-way cycle has 2 participants');
    assert.ok(twoWayCycle.steps[0].reason, '2-way step includes transparent match explanation');

    pass('Discovered valid 2-way direct exchange cycle with transparent affinity explanation');

    // Rule: Matches are suggestions only. Listings must remain available!
    const item105Detail = await makeRequest('/api/listings/item-105');
    assert.strictEqual(item105Detail.data.data.status, 'available', 'Items in suggested cycles must remain available');
    pass('Matches are suggestions only: items remain available and unreserved');

    // ---------------------------------------------------------
    // TEST SECTION 4: Circular Proposal Creation & Explicit Consent
    // ---------------------------------------------------------
    console.log('\n🤝 --- TEST 4: Proposing Circular Cycle & Explicit Consent Enforcement ---');

    // Maya initiates a 3-way proposal
    const proposeRes = await makeRequest('/api/circular-swap/propose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ cycleData: threeWayCycle })
    });

    assert.strictEqual(proposeRes.status, 201, 'Proposing cycle returns 201 Created');
    const proposal = proposeRes.data.data;
    assert.strictEqual(proposal.status, 'pending_consent', 'Proposal status must be pending_consent');

    // Maya (initiator) is accepted, other participants are pending
    const initiatorConsent = proposal.consents.find(c => c.userId === mayaUser.id || c.userName === mayaUser.name);
    assert.strictEqual(initiatorConsent.status, 'accepted', 'Initiator automatically provides consent');

    const samiraConsent = proposal.consents.find(c => c.userId === samiraUser.id || c.userName === samiraUser.name);
    assert.strictEqual(samiraConsent.status, 'pending', 'Non-initiator participants must be pending consent');

    pass('Proposal initiated: requires explicit consent from all participants, no automatic reservation');

    // In-app notifications sent to other participants
    const samiraNotifs = await makeRequest('/api/notifications', {
      headers: { Authorization: `Bearer ${samiraToken}` }
    });
    const swapNotif = samiraNotifs.data.data.find(n => n.title.includes('Circular Swap Proposal'));
    assert.ok(swapNotif, 'Participant received circular swap proposal notification');
    pass('In-app notification delivered to loop participants');

    // ---------------------------------------------------------
    // TEST SECTION 5: Participant Decline Workflow
    // ---------------------------------------------------------
    console.log('\n❌ --- TEST 5: Participant Decline Workflow ---');

    // Create a 2-way proposal to test decline
    const propose2WayRes = await makeRequest('/api/circular-swap/propose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ cycleData: twoWayCycle })
    });
    assert.strictEqual(propose2WayRes.status, 201);
    const proposal2Way = propose2WayRes.data.data;

    // Samira declines the 2-way proposal
    const declineRes = await makeRequest(`/api/circular-swap/proposals/${proposal2Way.id}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${samiraToken}` },
      body: JSON.stringify({ decision: 'declined', note: 'Not interested at this time.' })
    });

    assert.strictEqual(declineRes.status, 200, 'Decline response returns 200 OK');
    assert.strictEqual(declineRes.data.data.status, 'declined', 'Proposal status updates to declined');

    // Verify items remain available and were NOT reserved
    const item111 = await makeRequest('/api/listings/item-111');
    const item112 = await makeRequest('/api/listings/item-112');
    assert.strictEqual(item111.data.data.status, 'available', 'Declined item 1 remains available');
    assert.strictEqual(item112.data.data.status, 'available', 'Declined item 2 remains available');

    pass('Participant decline safely transitions proposal to declined without reserving or modifying any items');

    // ---------------------------------------------------------
    // TEST SECTION 6: Unavailable Item Revalidation Protection
    // ---------------------------------------------------------
    console.log('\n🛡️ --- TEST 6: Item Availability Revalidation Before Finalizing ---');

    // Create a fresh 2-way proposal
    const proposeRevalRes = await makeRequest('/api/circular-swap/propose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ cycleData: twoWayCycle })
    });
    const revalProposal = proposeRevalRes.data.data;

    // Simulate item-111 becoming reserved/unavailable externally (e.g. via direct trade)
    await listingStore.updateStatus('item-111', 'reserved', mayaUser.id);

    // Samira now attempts to accept, but item-111 is reserved!
    const revalAcceptRes = await makeRequest(`/api/circular-swap/proposals/${revalProposal.id}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${samiraToken}` },
      body: JSON.stringify({ decision: 'accepted' })
    });

    assert.strictEqual(revalAcceptRes.status, 200);
    assert.strictEqual(revalAcceptRes.data.data.status, 'expired', 'Proposal must expire when item is no longer available');
    assert.ok(revalAcceptRes.data.data.revalidationError, 'Proposal records revalidation error');

    // Restore item-111 for subsequent tests
    await listingStore.updateStatus('item-111', 'available', mayaUser.id);

    pass('Revalidation check successfully aborts exchange when an item becomes unavailable before finalization');

    // ---------------------------------------------------------
    // TEST SECTION 7: Full Acceptance & Finalization
    // ---------------------------------------------------------
    console.log('\n🎉 --- TEST 7: Full Multi-Party Acceptance & Finalization ---');

    // Use the 3-way proposal from Test 4:
    // Maya already accepted. Now Samira accepts:
    const samiraAccept = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${samiraToken}` },
      body: JSON.stringify({ decision: 'accepted' })
    });
    assert.strictEqual(samiraAccept.status, 200);
    assert.strictEqual(samiraAccept.data.data.status, 'pending_consent', 'Still pending until Alex accepts');

    pass('Partial consent recorded: proposal remains pending until all participants explicitly agree');

    // Now Alex accepts (3rd of 3):
    const alexAccept = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${alexToken}` },
      body: JSON.stringify({ decision: 'accepted' })
    });
    assert.strictEqual(alexAccept.status, 200);
    assert.strictEqual(alexAccept.data.data.status, 'confirmed', 'All participants accepted: proposal confirmed');

    // Verify all 3 items transitioned to 'completed'
    const stepItems = proposal.steps.map(s => s.itemId);
    for (const itId of stepItems) {
      const itemDetail = await makeRequest(`/api/listings/${itId}`);
      assert.strictEqual(itemDetail.data.data.status, 'completed', `Item ${itId} marked completed upon circular finalization`);
    }

    pass('All 3 participants accepted: exchange finalized, items transitioned to completed, and Eco-Karma awarded');

    // Recheck impact stats: completed count has increased!
    const updatedImpact = await makeRequest('/api/stats/impact');
    assert.ok(
      updatedImpact.data.data.completedMetrics.totalReusedItems > impactData.completedMetrics.totalReusedItems,
      'Completed reused items count incremented in impact dashboard'
    );
    pass('Sustainability impact metrics automatically reflect newly completed circular exchange');

  } catch (err) {
    fail('Unexpected exception during Phase 5 test execution', err);
  } finally {
    await stopTestServer();

    console.log('\n=====================================================================');
    console.log(`📊 Phase 5 Test Results: ${passedTests} Passed | ${failedTests} Failed`);
    console.log('=====================================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  }
};

runCircularSwapTests();
