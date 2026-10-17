/**
 * CIRCULAR SWAP CYCLE DETECTION ALGORITHM
 * 
 * Modular, deterministic, zero-external-AI algorithm that identifies exchange cycles
 * involving at least 3 distinct students when direct 2-way swaps are impossible.
 * 
 * Example:
 *   Student A has Book (textbooks) -> wants Calculator (electronics)
 *   Student B has Calculator (electronics) -> wants Lab Kit (lab-gear)
 *   Student C has Lab Kit (lab-gear) -> wants Book (textbooks)
 * 
 * Cycle Detected: A -> B -> C -> A
 */

/**
 * Normalizes an item representation to guarantee consistent fields.
 */
export function normalizeListing(item) {
  const ownerId = (
    item.ownerId ||
    item.owner?._id ||
    item.owner?.id ||
    item.seller?.id ||
    item.owner ||
    ''
  ).toString();

  const ownerName =
    item.ownerName ||
    item.owner?.name ||
    item.seller?.name ||
    'Student';

  // Determine what category this student has
  const hasCategory = (item.category || '').toLowerCase().trim();

  // Determine what category this student wants
  // Can be explicitly provided as wantedCategory / desiredCategory or parsed from desiredItems
  let wantedCategory = (
    item.wantedCategory ||
    item.desiredCategory ||
    ''
  ).toLowerCase().trim();

  if (!wantedCategory && item.desiredItems) {
    const text = item.desiredItems.toLowerCase();
    if (text.includes('book') || text.includes('math') || text.includes('textbook') || text.includes('nirali') || text.includes('technical') || text.includes('techknowledge')) {
      wantedCategory = 'textbooks';
    } else if (text.includes('calc') || text.includes('casio') || text.includes('electronic') || text.includes('tech')) {
      wantedCategory = 'electronics';
    } else if (text.includes('lab') || text.includes('apron') || text.includes('goggle') || text.includes('ppe') || text.includes('kit')) {
      wantedCategory = 'lab-gear';
    } else if (text.includes('draft') || text.includes('stationery') || text.includes('drafter') || text.includes('compass') || text.includes('scale')) {
      wantedCategory = 'stationery';
    } else if (text.includes('dorm') || text.includes('hostel')) {
      wantedCategory = 'dorm';
    }
  }

  return {
    id: (item.id || item._id || '').toString(),
    title: item.title || 'Campus Item',
    category: hasCategory,
    wantedCategory: wantedCategory,
    desiredItems: item.desiredItems || '',
    studentId: ownerId,
    studentName: ownerName,
    studentAvatar: item.ownerAvatar || item.seller?.avatar || '',
    studentDepartment: item.ownerDepartment || item.seller?.department || '',
    imageUrl: item.imageUrl || (item.images && item.images[0]) || '',
    price: item.price || item.sellingPrice || 0,
    originalPrice: item.originalPrice || 500,
    co2SavedKg: Number(item.co2SavedKg) || 8.5,
    raw: item
  };
}

/**
 * Checks if Student A (giving itemA) can transfer to Student B (giving itemB).
 * This means Student B wants what Student A is offering!
 */
export function checkAffinity(givingItem, receivingStudentItem) {
  const giverOwnerId = (givingItem.studentId || givingItem.ownerId || givingItem.owner || '').toString();
  const receiverOwnerId = (receivingStudentItem.studentId || receivingStudentItem.ownerId || receivingStudentItem.owner || '').toString();

  // Prevent self-trading
  if (giverOwnerId && receiverOwnerId && giverOwnerId === receiverOwnerId) {
    return { matches: false };
  }

  const offeredCat = (givingItem.category || '').toLowerCase();
  const wantedCat = (receivingStudentItem.wantedCategory || '').toLowerCase();
  const desiredText = (receivingStudentItem.desiredItems || '').toLowerCase();
  const offeredTitle = (givingItem.title || '').toLowerCase();
  const receiverName = receivingStudentItem.studentName || receivingStudentItem.ownerName || 'Student';

  // 1. Exact Category Match: Receiving student explicitly wants the category being offered
  if (wantedCat && wantedCat === offeredCat) {
    return {
      matches: true,
      reason: `${receiverName} wants ${wantedCat} (matches "${givingItem.title || offeredCat}")`,
      score: 95
    };
  }

  // 2. Keyword Match in desiredItems
  if (desiredText.length > 0) {
    // Check if offered title contains desired keyword or vice versa
    const tokens = desiredText
      .split(/[,/]|(\bor\b)|(\band\b)/i)
      .map(t => (t ? t.trim().toLowerCase() : ''))
      .filter(t => t.length > 2 && !['or', 'and', 'the', 'for', 'with', 'any'].includes(t));

    for (const token of tokens) {
      if ((offeredTitle && offeredTitle.includes(token)) || (offeredCat && offeredCat.includes(token))) {
        return {
          matches: true,
          reason: `${receiverName} desires "${token}" (matches "${givingItem.title || offeredCat}")`,
          score: 90
        };
      }
    }
  }

  return { matches: false };
}

/**
 * Builds a directed adjacency graph where:
 *   Edge: itemA -> itemB
 *   Meaning: Student A transfers itemA to Student B (because Student B wants itemA)
 */
export function buildDirectedGraph(listings) {
  const normalized = listings.map(normalizeListing);
  const graph = new Map(); // itemId -> [ { targetItem, reason, score } ]

  normalized.forEach(item => {
    graph.set(item.id, []);
  });

  for (let i = 0; i < normalized.length; i++) {
    for (let j = 0; j < normalized.length; j++) {
      if (i === j) continue;
      const giver = normalized[i];
      const receiver = normalized[j];

      const affinity = checkAffinity(giver, receiver);
      if (affinity.matches) {
        graph.get(giver.id).push({
          targetItem: receiver,
          reason: affinity.reason,
          score: affinity.score
        });
      }
    }
  }

  return { graph, items: normalized };
}

/**
 * Detects circular exchange loops involving at least 3 distinct students.
 * Uses Depth-First Search (DFS) with path tracking and canonical cycle deduplication.
 * 
 * @param {Array} rawListings - Array of marketplace listings
 * @param {Object} options - Configuration options (minLength = 3, maxLength = 3)
 * @returns {Array} List of distinct, valid circular swap cycles
 */
export function findCircularCycles(rawListings, { minLength = 3, maxLength = 3 } = {}) {
  const { graph, items } = buildDirectedGraph(rawListings);
  const cycles = [];
  const seenCycleKeys = new Set();

  /**
   * Generates a canonical string key for a cycle so that rotations are recognized as identical:
   * e.g., [item1, item2, item3] is the same cycle as [item2, item3, item1].
   */
  function getCanonicalCycleKey(itemIds) {
    const minId = [...itemIds].sort()[0];
    const minIdx = itemIds.indexOf(minId);
    const rotated = [];
    for (let i = 0; i < itemIds.length; i++) {
      rotated.push(itemIds[(minIdx + i) % itemIds.length]);
    }
    return `${rotated.length}-way:${rotated.join('->')}`;
  }

  // Recursive DFS path finder
  function dfs(startItem, currentItem, path, visitedStudents) {
    const edges = graph.get(currentItem.id) || [];

    for (const edge of edges) {
      const nextItem = edge.targetItem;

      // Check if cycle closes back to startItem
      if (nextItem.id === startItem.id) {
        if (path.length >= minLength && path.length <= maxLength) {
          const cycleItemIds = path.map(p => p.item.id);
          const cycleKey = getCanonicalCycleKey(cycleItemIds);

          if (!seenCycleKeys.has(cycleKey)) {
            seenCycleKeys.add(cycleKey);

            // Construct cycle steps and metrics
            const steps = [];
            let totalCo2 = 0;
            let totalSavings = 0;
            let totalScore = 0;

            for (let i = 0; i < path.length; i++) {
              const currentStep = path[i];
              const fromItem = currentStep.item;
              const nextStep = path[(i + 1) % path.length];
              const toItem = nextStep.item;

              totalCo2 += fromItem.co2SavedKg;
              totalSavings += fromItem.originalPrice;
              totalScore += currentStep.score;

              steps.push({
                step: i + 1,
                fromStudent: {
                  id: fromItem.studentId,
                  name: fromItem.studentName,
                  avatar: fromItem.studentAvatar,
                  department: fromItem.studentDepartment
                },
                toStudent: {
                  id: toItem.studentId,
                  name: toItem.studentName,
                  avatar: toItem.studentAvatar,
                  department: toItem.studentDepartment
                },
                item: {
                  id: fromItem.id,
                  title: fromItem.title,
                  category: fromItem.category,
                  imageUrl: fromItem.imageUrl,
                  price: fromItem.price,
                  co2SavedKg: fromItem.co2SavedKg
                },
                reason: currentStep.reason
              });
            }

            const participants = path.map((stepInfo, idx) => {
              const givingItem = stepInfo.item;
              const receivingStep = path[(idx + path.length - 1) % path.length];
              const receivingItem = receivingStep.item;

              return {
                id: givingItem.studentId,
                name: givingItem.studentName,
                avatar: givingItem.studentAvatar,
                department: givingItem.studentDepartment,
                givingItem: {
                  id: givingItem.id,
                  title: givingItem.title,
                  category: givingItem.category,
                  imageUrl: givingItem.imageUrl
                },
                receivingItem: {
                  id: receivingItem.id,
                  title: receivingItem.title,
                  category: receivingItem.category,
                  imageUrl: receivingItem.imageUrl
                }
              };
            });

            const summaryNames = participants.map(p => p.name).join(' → ');

            cycles.push({
              id: `cycle-${path.length}way-${cycleItemIds.join('-')}`,
              cycleType: `${path.length}-way`,
              participantCount: path.length,
              totalCo2SavedKg: Math.round(totalCo2 * 10) / 10,
              totalDollarsSaved: Math.round(totalSavings),
              efficiencyScore: Math.round(totalScore / path.length),
              participants,
              steps,
              summary: `Circular ${path.length}-way loop: ${summaryNames} → ${participants[0].name}`
            });
          }
        }
        continue;
      }

      // Avoid revisiting students already in the path (guarantees DISTINCT students)
      if (visitedStudents.has(nextItem.studentId)) {
        continue;
      }

      // Prune paths that exceed maxLength
      if (path.length >= maxLength) {
        continue;
      }

      // Recurse deeper
      visitedStudents.add(nextItem.studentId);
      path.push({ item: nextItem, reason: edge.reason, score: edge.score });

      dfs(startItem, nextItem, path, visitedStudents);

      // Backtrack
      path.pop();
      visitedStudents.delete(nextItem.studentId);
    }
  }

  // Run DFS from each available item
  for (const item of items) {
    const visitedStudents = new Set([item.studentId]);
    const initialPath = [{ item, reason: 'Initiator offer', score: 100 }];
    dfs(item, item, initialPath, visitedStudents);
  }

  // Sort by efficiencyScore descending, then totalCo2SavedKg descending
  return cycles.sort((a, b) => {
    if (b.efficiencyScore !== a.efficiencyScore) {
      return b.efficiencyScore - a.efficiencyScore;
    }
    return b.totalCo2SavedKg - a.totalCo2SavedKg;
  });
}
