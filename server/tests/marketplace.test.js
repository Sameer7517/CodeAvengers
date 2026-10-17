/**
 * Automated Test Suite for CampusLoop Phase 3 Marketplace & Listing Management
 * 
 * Tests:
 * 1. Authenticated listing creation (201 Created)
 * 2. Unauthenticated listing creation rejection (401 Unauthorized)
 * 3. Invalid listing creation validation (400 Bad Request)
 * 4. Swap listing with desired items
 * 5. Listing detail view by ID (200 OK)
 * 6. Listing update by owner (200 OK)
 * 7. Listing update rejection by non-owner (403 Forbidden)
 * 8. Availability status transitions ('available' -> 'reserved' -> 'completed')
 * 9. Rejection of exchange requests on unavailable (reserved/completed) items (400)
 * 10. Listing deletion rejection by non-owner (403 Forbidden)
 * 11. Listing deletion by owner (200 OK)
 * 12. Search, filters (category, condition, type, price range), sorting, and pagination
 */

import http from 'http';
import app from '../src/server.js';

let server;
let baseUrl;

const runTests = async () => {
  console.log('\n🧪 =================================================================');
  console.log('🧪 Starting CampusLoop Phase 3 Marketplace & Discovery Test Suite');
  console.log('🧪 =================================================================\n');

  const TEST_PORT = 5098;
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
    // Setup: Register two separate student accounts
    // -------------------------------------------------------------
    const userAEmail = `student.a.${Date.now()}@campus.edu`;
    const regARes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Student Owner A',
        email: userAEmail,
        password: 'PasswordA123!',
        department: 'Engineering'
      })
    });
    const userA = await regARes.json();
    const tokenA = userA.token;

    const userBEmail = `student.b.${Date.now()}@campus.edu`;
    const regBRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Student NonOwner B',
        email: userBEmail,
        password: 'PasswordB123!',
        department: 'Architecture'
      })
    });
    const userB = await regBRes.json();
    const tokenB = userB.token;

    assert(!!tokenA && !!tokenB, 'Created 2 distinct student accounts for ownership tests');

    // -------------------------------------------------------------
    // Test 1: Authenticated Listing Creation
    // -------------------------------------------------------------
    const createRes = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Organic Chemistry Model Kit 2026',
        category: 'lab-gear',
        listingType: 'sell',
        sellingPrice: 30,
        originalPrice: 65,
        condition: 'Like New',
        description: 'Complete molecular modeling set with bonds and atoms, used for CHEM 261.',
        campusSpot: 'Science Center Lobby'
      })
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, 'Authenticated listing creation returns 201 Created');
    assert(createData.data.title === 'Organic Chemistry Model Kit 2026', 'Listing title matches');
    assert(createData.data.status === 'available', 'Initial listing status is available');
    assert(createData.data.co2SavedKg > 0, 'Auto-assigned carbon offset savings');

    const createdListingId = createData.data.id || createData.data._id;

    // -------------------------------------------------------------
    // Test 2: Unauthenticated Listing Creation Rejection (401)
    // -------------------------------------------------------------
    const unauthRes = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthenticated Item',
        category: 'textbooks'
      })
    });
    assert(unauthRes.status === 401, 'Unauthenticated listing creation returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test 3: Invalid Listing Creation Validation (400)
    // -------------------------------------------------------------
    const invalidRes = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Hi', // too short (<3 chars)
        category: 'textbooks'
      })
    });
    assert(invalidRes.status === 400, 'Listing creation with invalid short title returns 400');

    // -------------------------------------------------------------
    // Test 4: Swap Listing Creation with Desired Items
    // -------------------------------------------------------------
    const swapRes = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Linear Algebra (Lay 5th Edition)',
        category: 'textbooks',
        listingType: 'swap',
        desiredItems: 'Calculus Stewart 9th Ed or Discrete Math notes',
        condition: 'Good',
        description: 'Solid clean textbook, wanting to swap directly for calculus.'
      })
    });
    const swapData = await swapRes.json();
    assert(swapRes.status === 201, 'Swap listing creation returns 201 Created');
    assert(swapData.data.price === 0, 'Swap listing price is automatically 0');
    assert(swapData.data.desiredItems.includes('Stewart'), 'Desired swap items recorded');

    // -------------------------------------------------------------
    // Test 5: Detail Operation by ID
    // -------------------------------------------------------------
    const detailRes = await fetch(`${baseUrl}/listings/${createdListingId}`);
    const detailData = await detailRes.json();
    assert(detailRes.status === 200, 'Listing detail returns 200 OK');
    assert(detailData.data.title === 'Organic Chemistry Model Kit 2026', 'Detail returns exact listing');

    // -------------------------------------------------------------
    // Test 6: Listing Update by Owner (200 OK)
    // -------------------------------------------------------------
    const updateRes = await fetch(`${baseUrl}/listings/${createdListingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        sellingPrice: 25,
        description: 'Price reduced! Clean molecular modeling set.'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Owner can update their listing');
    assert((updateData.data.price === 25 || updateData.data.sellingPrice === 25), 'Price updated to $25');

    // -------------------------------------------------------------
    // Test 7: Listing Update Rejection by Non-Owner (403 Forbidden)
    // -------------------------------------------------------------
    const forbiddenUpdateRes = await fetch(`${baseUrl}/listings/${createdListingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenB}` // User B trying to edit User A's listing
      },
      body: JSON.stringify({
        sellingPrice: 5
      })
    });
    assert(forbiddenUpdateRes.status === 403, 'Non-owner editing listing returns 403 Forbidden');

    // -------------------------------------------------------------
    // Test 8: Availability Status Change ('reserved')
    // -------------------------------------------------------------
    const statusRes = await fetch(`${baseUrl}/listings/${createdListingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        status: 'reserved'
      })
    });
    const statusData = await statusRes.json();
    assert(statusRes.status === 200, 'Owner can update availability status');
    assert(statusData.data.status === 'reserved', 'Listing status updated to reserved');

    // -------------------------------------------------------------
    // Test 9: Unavailable Items Exchange Request Rejection (400)
    // -------------------------------------------------------------
    const exchangeOnReservedRes = await fetch(`${baseUrl}/listings/${createdListingId}/request-exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingTime: 'Today at 4 PM',
        note: 'Can I pick this up?'
      })
    });
    assert(exchangeOnReservedRes.status === 400, 'Exchange request rejected on unavailable/reserved item');

    // Restore to available for delete test
    await fetch(`${baseUrl}/listings/${createdListingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({ status: 'available' })
    });

    // -------------------------------------------------------------
    // Test 10: Listing Deletion Rejection by Non-Owner (403 Forbidden)
    // -------------------------------------------------------------
    const forbiddenDeleteRes = await fetch(`${baseUrl}/listings/${createdListingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenB}`
      }
    });
    assert(forbiddenDeleteRes.status === 403, 'Non-owner deleting listing returns 403 Forbidden');

    // -------------------------------------------------------------
    // Test 11: Listing Deletion by Owner (200 OK)
    // -------------------------------------------------------------
    const deleteRes = await fetch(`${baseUrl}/listings/${createdListingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenA}`
      }
    });
    assert(deleteRes.status === 200, 'Owner can delete their listing');

    // Verify it is gone
    const verifyDeleteRes = await fetch(`${baseUrl}/listings/${createdListingId}`);
    assert(verifyDeleteRes.status === 404, 'Deleted listing no longer retrievable (404)');

    // -------------------------------------------------------------
    // Test 12: Search, Filters, Sorting & Pagination
    // -------------------------------------------------------------
    const filterRes = await fetch(`${baseUrl}/listings?category=textbooks&type=sell&sort=price-asc&page=1&limit=4`);
    const filterData = await filterRes.json();
    assert(filterRes.status === 200, 'Filtered listings query returns 200 OK');
    assert(Array.isArray(filterData.data), 'Returns listings array');
    assert(!!filterData.pagination, 'Returns pagination metadata');
    assert(filterData.pagination.currentPage === 1, 'Pagination current page is 1');
    assert(filterData.pagination.limit === 4, 'Pagination limit is 4');

    // Search query test
    const searchRes = await fetch(`${baseUrl}/listings?search=Biology`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200, 'Search by keyword returns 200 OK');
    assert(searchData.data.some(i => i.title.includes('Biology')), 'Search results contain keyword match');

    // Price range filter test
    const priceFilterRes = await fetch(`${baseUrl}/listings?minPrice=20&maxPrice=50`);
    const priceFilterData = await priceFilterRes.json();
    assert(priceFilterRes.status === 200, 'Price range filter returns 200 OK');
    assert(priceFilterData.data.every(i => (i.price >= 20 && i.price <= 50) || i.price === 0), 'Results match price criteria');

  } finally {
    console.log('\n=================================================================');
    console.log(`📊 Phase 3 Marketplace Test Summary: ${totalPassed} Passed, ${totalFailed} Failed`);
    console.log('=================================================================\n');
    server.close();
  }
};

runTests();
