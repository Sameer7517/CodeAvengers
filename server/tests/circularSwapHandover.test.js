import http from 'http';
import assert from 'node:assert';
import { app } from '../src/server.js';
import { listingStore } from '../src/services/listingStore.js';
import { circularSwapStore } from '../src/services/circularSwapStore.js';

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

const runHandoverTests = async () => {
  console.log('\n🧪 =====================================================================');
  console.log('🧪 Starting CampusLoop Circular Swap Handover & Multi-Party Lifecycle Test');
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
    // Setup Authentication Tokens
    // ---------------------------------------------------------
    console.log('🔑 Authenticating demo students (Maya, Samira, Alex)...');

    const mayaLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'maya.lin@campus.edu', password: 'CampusLoop2026!' })
    });
    assert.strictEqual(mayaLogin.status, 200, 'Maya login succeeds');
    const mayaToken = mayaLogin.data.token;
    const mayaUser = mayaLogin.data.user;

    const samiraLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 's.rodriguez@campus.edu', password: 'CampusLoop2026!' })
    });
    assert.strictEqual(samiraLogin.status, 200, 'Samira login succeeds');
    const samiraToken = samiraLogin.data.token;
    const samiraUser = samiraLogin.data.user;

    const alexLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alex.chen@campus.edu', password: 'CampusLoop2026!' })
    });
    assert.strictEqual(alexLogin.status, 200, 'Alex login succeeds');
    const alexToken = alexLogin.data.token;
    const alexUser = alexLogin.data.user;

    pass('Demo students successfully authenticated');

    // ---------------------------------------------------------
    // TEST 1: Cycle Discovery (Suggestions Only)
    // ---------------------------------------------------------
    console.log('\n🔍 --- TEST 1: Suggestion Discovery ---');
    const suggestionsRes = await makeRequest('/api/circular-swap/suggestions', {
      headers: { Authorization: `Bearer ${mayaToken}` }
    });
    assert.strictEqual(suggestionsRes.status, 200);
    const threeWayCycle = suggestionsRes.data.data.cycles.find(c => c.cycleType === '3-way');
    assert.ok(threeWayCycle, 'Engine discovers 3-way triangular circular swap cycle');
    assert.strictEqual(threeWayCycle.steps.length, 3, '3 transfer steps present');
    pass('Cycle suggestion discovered with 3 distinct students');

    // ---------------------------------------------------------
    // TEST 2: Propose Circular Cycle
    // ---------------------------------------------------------
    console.log('\n🤝 --- TEST 2: Proposing Circular Cycle & Consent Initialization ---');
    const proposeRes = await makeRequest('/api/circular-swap/propose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ cycleData: threeWayCycle })
    });
    assert.strictEqual(proposeRes.status, 201);
    const proposal = proposeRes.data.data;
    assert.strictEqual(proposal.status, 'pending_consent');

    // Verify consents
    const initiatorConsent = proposal.consents.find(c => c.userId === mayaUser.id || c.userName === mayaUser.name);
    assert.strictEqual(initiatorConsent.status, 'accepted', 'Initiator automatically provides consent');
    const pendingConsents = proposal.consents.filter(c => c.status === 'pending');
    assert.strictEqual(pendingConsents.length, 2, 'Other 2 participants are pending consent');

    // Verify step handover tracking initialized
    assert.ok(Array.isArray(proposal.steps), 'Proposal has steps array');
    for (const step of proposal.steps) {
      assert.strictEqual(step.handoverConfirmed, false, 'Handover starts as unconfirmed');
    }
    pass('Proposal initiated in pending_consent with all handovers unconfirmed');

    // ---------------------------------------------------------
    // TEST 3: Active Proposal Lock (No Double Commitment)
    // ---------------------------------------------------------
    console.log('\n🔒 --- TEST 3: Prevention of Multiple Active Proposals for Same Item ---');
    const duplicateProposeRes = await makeRequest('/api/circular-swap/propose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ cycleData: threeWayCycle })
    });
    assert.strictEqual(duplicateProposeRes.status, 400, 'Duplicate active proposal blocked');
    assert.ok(
      duplicateProposeRes.data.message.includes('already committed'),
      'Informative error on committed item'
    );
    pass('Active proposal conflict check successfully blocks committing same items to multiple active loops');

    // ---------------------------------------------------------
    // TEST 4: Multi-Party Explicit Consent -> Confirmed
    // ---------------------------------------------------------
    console.log('\n👍 --- TEST 4: Explicit Participant Consent ---');
    // Samira accepts (2nd student)
    const samiraAcceptRes = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${samiraToken}` },
      body: JSON.stringify({ decision: 'accepted', note: 'Agreed! Happy to swap.' })
    });
    assert.strictEqual(samiraAcceptRes.status, 200);
    assert.strictEqual(samiraAcceptRes.data.data.status, 'pending_consent', 'Still pending until 3rd student accepts');

    // Alex accepts (3rd student)
    const alexAcceptRes = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${alexToken}` },
      body: JSON.stringify({ decision: 'accepted', note: 'Ready to exchange.' })
    });
    assert.strictEqual(alexAcceptRes.status, 200);
    assert.strictEqual(alexAcceptRes.data.data.status, 'confirmed', 'All students accepted: status is confirmed');
    pass('All participants consented: proposal is now confirmed and handover phase is active');

    // ---------------------------------------------------------
    // TEST 5: Step-by-Step Handover Tracking
    // ---------------------------------------------------------
    console.log('\n📦 --- TEST 5: Individual Step Handover Confirmation ---');

    // Confirm Step 0 handover
    const step0Res = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/handover`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ stepIndex: 0 })
    });
    assert.strictEqual(step0Res.status, 200);
    assert.strictEqual(step0Res.data.data.steps[0].handoverConfirmed, true, 'Step 0 handover is confirmed');
    assert.strictEqual(step0Res.data.data.status, 'confirmed', 'Proposal remains confirmed until ALL handovers done');
    pass('Step 0 handover confirmed; proposal remains confirmed pending remaining steps');

    // Confirm Step 1 handover
    const step1Res = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/handover`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${samiraToken}` },
      body: JSON.stringify({ stepIndex: 1 })
    });
    assert.strictEqual(step1Res.status, 200);
    assert.strictEqual(step1Res.data.data.steps[1].handoverConfirmed, true, 'Step 1 handover is confirmed');
    assert.strictEqual(step1Res.data.data.status, 'confirmed', 'Proposal still confirmed with 1 step remaining');
    pass('Step 1 handover confirmed; 2/3 complete');

    // Confirm Step 2 handover (Last step!)
    const step2Res = await makeRequest(`/api/circular-swap/proposals/${proposal.id}/handover`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${alexToken}` },
      body: JSON.stringify({ stepIndex: 2 })
    });
    assert.strictEqual(step2Res.status, 200);
    assert.strictEqual(step2Res.data.data.steps[2].handoverConfirmed, true, 'Step 2 handover is confirmed');
    assert.strictEqual(step2Res.data.data.status, 'completed', 'ALL steps confirmed: proposal transitions to completed!');
    pass('Final step handover confirmed: proposal automatically transitions to completed');

    // ---------------------------------------------------------
    // TEST 6: Proposal Cancellation Workflow
    // ---------------------------------------------------------
    console.log('\n❌ --- TEST 6: Proposal Cancellation & Clean Release ---');
    const twoWayCycle = suggestionsRes.data.data.cycles.find(c => c.cycleType === '2-way');
    assert.ok(twoWayCycle, '2-way cycle available');

    const freshPropRes = await makeRequest('/api/circular-swap/propose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` },
      body: JSON.stringify({ cycleData: twoWayCycle })
    });
    assert.strictEqual(freshPropRes.status, 201);
    const freshProp = freshPropRes.data.data;

    // Initiator cancels the proposal
    const cancelRes = await makeRequest(`/api/circular-swap/proposals/${freshProp.id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${mayaToken}` }
    });
    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.data.data.status, 'declined', 'Cancelled proposal transitions to declined');
    pass('Initiator cancellation cleanly transitions proposal to declined without reserving items');

  } catch (err) {
    fail('Unexpected exception during Handover test execution', err);
  } finally {
    await stopTestServer();

    console.log('\n=====================================================================');
    console.log(`📊 Circular Swap Handover Test Results: ${passedTests} Passed | ${failedTests} Failed`);
    console.log('=====================================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  }
};

runHandoverTests();
