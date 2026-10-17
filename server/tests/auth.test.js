/**
 * Automated Test Suite for CampusLoop Authentication and Protected Routes
 * Tests:
 * 1. Successful student registration (.edu college-verified)
 * 2. Registration with non-college email (unverified handling)
 * 3. Duplicate email rejection (409 Conflict)
 * 4. Invalid input handling (400 Bad Request)
 * 5. Successful login with JWT issuance
 * 6. Rejection of invalid credentials (wrong password & wrong email - 401)
 * 7. Protected route access with valid JWT token (200 OK)
 * 8. Protected route rejection without token or with invalid token (401)
 * 9. User profile update via protected route
 * 10. Logout confirmation
 */

import http from 'http';
import app from '../src/server.js';

let server;
let baseUrl;

const runTests = async () => {
  console.log('\n🧪 ========================================================');
  console.log('🧪 Starting CampusLoop Authentication & Protected API Tests');
  console.log('🧪 ========================================================\n');

  // Start app on ephemeral test port
  const TEST_PORT = 5099;
  server = app.listen(TEST_PORT);
  baseUrl = `http://localhost:${TEST_PORT}/api`;

  let totalPassed = 0;
  let totalFailed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      totalPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      totalFailed++;
    }
  };

  try {
    // -------------------------------------------------------------
    // Test 1: Health Check
    // -------------------------------------------------------------
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'online', 'Health endpoint responds with status 200');

    // -------------------------------------------------------------
    // Test 2: Successful Student Registration (.edu domain -> Verified)
    // -------------------------------------------------------------
    const testEduEmail = `alex.test.${Date.now()}@university.edu`;
    const regEduRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Rivera',
        email: testEduEmail,
        password: 'SecurePassword123!',
        department: 'Computer Science',
        year: 'Junior (3rd Year)',
        campus: 'Central Campus'
      })
    });
    const regEduData = await regEduRes.json();
    assert(regEduRes.status === 201, 'Registration returns HTTP 201', JSON.stringify(regEduData));
    assert(!!regEduData.token, 'Registration returns signed JWT token');
    assert(regEduData.user.isCollegeVerified === true, 'Student with .edu domain is accurately marked college-verified');
    assert(regEduData.user.verificationStatus === 'verified', 'Verification status is "verified" for .edu domain');

    const eduToken = regEduData.token;

    // -------------------------------------------------------------
    // Test 3: Registration with Non-College Email (NOT falsely verified)
    // -------------------------------------------------------------
    const testGenericEmail = `guest.user.${Date.now()}@gmail.com`;
    const regGenericRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Generic',
        email: testGenericEmail,
        password: 'SecurePassword123!',
        department: 'General Studies'
      })
    });
    const regGenericData = await regGenericRes.json();
    assert(regGenericRes.status === 201, 'Registration with generic email succeeds');
    assert(regGenericData.user.isCollegeVerified === false, 'Non-college email is NOT falsely marked college-verified');
    assert(regGenericData.user.verificationStatus === 'unverified', 'Status is "unverified" for non-college domains');

    // -------------------------------------------------------------
    // Test 4: Duplicate Email Registration Rejection (409 Conflict)
    // -------------------------------------------------------------
    const duplicateRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Duplicate',
        email: testEduEmail, // same email as Test 2
        password: 'AnotherPassword456!'
      })
    });
    const duplicateData = await duplicateRes.json();
    assert(duplicateRes.status === 409, 'Duplicate email registration returns 409 Conflict');
    assert(duplicateData.success === false, 'Duplicate response indicates success: false');

    // -------------------------------------------------------------
    // Test 5: Invalid Registration Inputs (400 Bad Request)
    // -------------------------------------------------------------
    const invalidRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // too short
        email: 'invalid-email-format',
        password: '123' // too short
      })
    });
    assert(invalidRes.status === 400, 'Invalid registration inputs return 400 Bad Request');

    // -------------------------------------------------------------
    // Test 6: Successful Login with Correct Credentials
    // -------------------------------------------------------------
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEduEmail,
        password: 'SecurePassword123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Login with valid credentials returns 200 OK');
    assert(!!loginData.token, 'Login response contains signed JWT');
    assert(loginData.user.email === testEduEmail.toLowerCase(), 'Login returns matching student profile');

    // -------------------------------------------------------------
    // Test 7: Login Rejection with Wrong Password (401 Unauthorized)
    // -------------------------------------------------------------
    const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEduEmail,
        password: 'WrongIncorrectPassword!'
      })
    });
    assert(wrongPassRes.status === 401, 'Login with wrong password returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test 8: Login Rejection with Non-Existent Email (401 Unauthorized)
    // -------------------------------------------------------------
    const wrongEmailRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody.exists.here@nowhere.edu',
        password: 'SomePassword123!'
      })
    });
    assert(wrongEmailRes.status === 401, 'Login with non-existent email returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test 9: Protected Route Access With Valid JWT (GET /api/auth/me)
    // -------------------------------------------------------------
    const protectedRes = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${eduToken}`
      }
    });
    const protectedData = await protectedRes.json();
    assert(protectedRes.status === 200, 'Protected route /api/auth/me returns 200 with valid JWT');
    assert(protectedData.data.name === 'Alex Rivera', 'Protected profile data matches authenticated user');

    // -------------------------------------------------------------
    // Test 10: Protected Route Rejection Without Token (401 Unauthorized)
    // -------------------------------------------------------------
    const noTokenRes = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET'
    });
    assert(noTokenRes.status === 401, 'Protected route without token returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test 11: Protected Route Rejection With Corrupted/Invalid Token (401)
    // -------------------------------------------------------------
    const badTokenRes = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer this.is.a.corrupted.token'
      }
    });
    assert(badTokenRes.status === 401, 'Protected route with forged/invalid token returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test 12: Profile Update via Protected Route (PUT /api/auth/profile)
    // -------------------------------------------------------------
    const updateRes = await fetch(`${baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${eduToken}`
      },
      body: JSON.stringify({
        department: 'Environmental Policy',
        year: 'Senior (4th Year)'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Profile update returns 200 OK');
    assert(updateData.data.department === 'Environmental Policy', 'Profile department updated successfully');

    // -------------------------------------------------------------
    // Test 13: Logout Confirmation
    // -------------------------------------------------------------
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${eduToken}`
      }
    });
    assert(logoutRes.status === 200, 'Logout endpoint returns 200 OK');

  } finally {
    console.log('\n========================================================');
    console.log(`📊 Test Summary: ${totalPassed} Passed, ${totalFailed} Failed`);
    console.log('========================================================\n');
    server.close(() => {
      process.exit(totalFailed > 0 ? 1 : 0);
    });
  }
};

runTests();
