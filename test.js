const { game, Player, makeMove, bestMove, evalState, Result } = require('./game.js');
const assert = require('assert');

console.log("Running Automated Tests...\n");

// Helper to simulate a game with scripted Human moves
function simulateGame(initialStones, humanMoves) {
    let state = { player: Player.H, stones: initialStones };
    let moveIndex = 0;
    const history = [];

    console.log(`START: ${initialStones} stones`);

    while (state.stones > 0) {
        if (state.player === Player.H) {
            if (moveIndex >= humanMoves.length) {
                throw new Error(`Ran out of scripted moves for Human at ${state.stones} stones!`);
            }
            const move = humanMoves[moveIndex++];
            console.log(`  H takes ${move}`);
            state = makeMove(move, state);
        } else {
            const move = bestMove(state);
            console.log(`  C takes ${move}`);
            state = makeMove(move, state);
        }
        history.push(state);
    }

    // If loop ends, stones == 0. The player whose turn it *would* be lost.
    // The player who just moved won.
    // state.player is the one who has 0 stones and cannot move.
    const winner = (state.player === Player.H) ? Player.C : Player.H;
    console.log(`WINNER: ${winner}\n`);
    return winner;
}

// --- Test Suite from testSuite.txt ---

// Test 1: 10 stones. H takes 1, 3, 1. Expect H wins.
console.log("Test 1: 10 stones, H moves [1, 3, 1]");
try {
    const winner1 = simulateGame(10, [1, 3, 1]);
    assert.strictEqual(winner1, Player.H);
    console.log("✅ PASS");
} catch (e) {
    console.log("❌ FAIL: " + e.message);
}

// Test 2: 9 stones. H takes 1, 1, 1. Expect C wins.
console.log("Test 2: 9 stones, H moves [1, 1, 1]");
try {
    const winner2 = simulateGame(9, [1, 1, 1]);
    assert.strictEqual(winner2, Player.C);
    console.log("✅ PASS");
} catch (e) {
    console.log("❌ FAIL: " + e.message);
}

// Test 3: 6 stones. H takes 4, 1. Expect H wins.
console.log("Test 3: 6 stones, H moves [4, 1]");
try {
    const winner3 = simulateGame(6, [4, 1]);
    assert.strictEqual(winner3, Player.H);
    console.log("✅ PASS");
} catch (e) {
    console.log("❌ FAIL: " + e.message);
}

// Test 4: 2 stones. H takes 1. Expect C wins.
console.log("Test 4: 2 stones, H moves [1]");
try {
    const winner4 = simulateGame(2, [1]);
    assert.strictEqual(winner4, Player.C);
    console.log("✅ PASS");
} catch (e) {
    console.log("❌ FAIL: " + e.message);
}

// Test 5: 20 stones. H takes 4, 3, 3, 1. Expect H wins.
console.log("Test 5: 20 stones, H moves [4, 3, 3, 1]");
try {
    const winner5 = simulateGame(20, [4, 3, 3, 1]);
    assert.strictEqual(winner5, Player.H);
    console.log("✅ PASS");
} catch (e) {
    console.log("❌ FAIL: " + e.message);
}

// --- Theoretical Verification ---
// Verify 'juegosGanadores' equivalent
// H wins if evalState(C, k) == -1 (C loses)
console.log("\nTheoretical Winning Starts for Human (where C loses):");
const winningStarts = [];
for (let k = 1; k <= 20; k++) {
    // If we start with k, and it's H's turn.
    // H wins if H can force C into a losing state.
    // This means evalState(H, k) should be -1 (C loses)?
    // No, evalState returns result for C.
    // If evalState(H, k) == -1, it means "Best outcome for C is -1". So C loses.

    // Wait, let's check evalState logic again.
    // evalState(state) returns result for C.
    // If state=(H, k), H moves to minimize C's result.
    // If min result is -1, then H can force C to lose.

    if (evalState({ player: Player.H, stones: k }) === -1) {
        winningStarts.push(k);
    }
}
console.log("Winning starts for H:", winningStarts);
// In Nim with moves 1,3,4:
// 0: L
// 1: W (take 1 -> 0)
// 2: L (take 1->1(L)) -> Wait.
// Let's re-verify small numbers manually.
// 0: C loses (if C to move).
// 1: C takes 1 -> 0. H loses. C wins.
// 2: C takes 1 -> 1(H). H takes 1 -> 0(C). C loses.
//    C takes 3 (X)
//    C takes 4 (X)
//    So from 2, C must take 1, leading to state 1 for H.
//    From 1(H), H takes 1 -> 0(C). C loses.
//    So 2 is a LOSING start for C? No.
//    If C starts at 2: C takes 1 -> H(1). H takes 1 -> C(0). C Loses.
//    So 2 is a losing start for C.
//    So if game starts with 2, and H starts...
//    H takes 1 -> C(1). C takes 1 -> H(0). H loses.
//    So 2 is a WINNING start for C (if H starts).
//    Wait.
//    Test 4 says: Start 2. H takes 1. Gana C.
//    H(2) -> take 1 -> C(1).
//    C(1) -> take 1 -> H(0). H loses. C wins.
//    Correct.
