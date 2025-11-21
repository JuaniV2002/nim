/**
 * Nim Game Logic - Ported from Haskell
 * 
 * Original Haskell Types:
 * data Jugador = C | H
 * type Estado = (Jugador, Int)
 * data Resultado = CPerdio | CGano
 */

// --- Core Logic (Haskell Port) ---

const Player = {
    C: 'C', // Computer
    H: 'H'  // Human
};

// Result: CPerdio (Computer Lost) < CGano (Computer Won)
// We use integers to represent this for easy comparison: -1 < 1
const Result = {
    CPerdio: -1,
    CGano: 1
};

const MOVES = [1, 3, 4];

function otherPlayer(player) {
    return player === Player.C ? Player.H : Player.C;
}

// hacerJugada :: Int -> Estado -> Estado
function makeMove(stonesToRemove, state) {
    const { player, stones } = state;
    if (MOVES.includes(stonesToRemove) && stones - stonesToRemove >= 0) {
        return {
            player: otherPlayer(player),
            stones: stones - stonesToRemove
        };
    }
    throw new Error("Invalid move");
}

// evalEstado :: Estado -> Resultado
// Memoization cache for performance (optional but good for JS)
const memo = new Map();

function evalState(state) {
    const { player, stones } = state;
    const key = `${player}:${stones}`;

    if (memo.has(key)) {
        return memo.get(key);
    }

    let result;
    if (stones === 0) {
        // If stones are 0, the *current* player has lost (because the previous player took the last one)
        // Wait, let's check Haskell logic:
        // evalEstado (j, k) | k == 0 = if j == C then CPerdio else CGano
        // If it's C's turn and k=0, C has no moves, so C loses. Correct.
        result = (player === Player.C) ? Result.CPerdio : Result.CGano;
    } else {
        // Generate possible next states
        const possibleMoves = MOVES.filter(m => m <= stones);
        const nextStates = possibleMoves.map(m => makeMove(m, state));
        const nextResults = nextStates.map(s => evalState(s));

        if (player === Player.C) {
            // Computer wants to MAXIMIZE result (aim for CGano/1)
            result = Math.max(...nextResults);
        } else {
            // Human wants to MINIMIZE result (aim for CPerdio/-1, which is good for Human)
            // Wait, in Haskell: foldl min CGano ...
            // If Human plays, they want to choose a move that leads to a state where C loses.
            // So Human chooses the move that minimizes the *outcome for C*.
            result = Math.min(...nextResults);
        }
    }

    memo.set(key, result);
    return result;
}

// mejorJug :: Estado -> Int
function bestMove(state) {
    const { player, stones } = state;
    const possibleMoves = MOVES.filter(m => m <= stones);

    // We want to find the move that leads to the best result for the *current* player.
    // If C: maximize evalState(nextState)
    // If H: minimize evalState(nextState) (This is theoretical, usually we only ask bestMove for C)

    let bestM = -1;
    let bestVal = (player === Player.C) ? -Infinity : Infinity;

    for (const move of possibleMoves) {
        const nextState = makeMove(move, state);
        const val = evalState(nextState);

        if (player === Player.C) {
            if (val > bestVal) {
                bestVal = val;
                bestM = move;
            }
        } else {
            if (val < bestVal) {
                bestVal = val;
                bestM = move;
            }
        }
    }

    return bestM;
}


// --- UI & Game Loop ---

const game = {
    state: {
        player: Player.H,
        stones: 20
    },

    init() {
        this.setupScreen = document.getElementById('setup');
        this.gameBoard = document.getElementById('game-board');
        this.controls = document.getElementById('controls');
        this.gameOverScreen = document.getElementById('game-over');
        this.stonesContainer = document.getElementById('stones-container');
        this.stoneCountDisplay = document.getElementById('stone-count-display');
        this.statusMessage = document.getElementById('status-message');
        this.winnerMessage = document.getElementById('winner-message');
        this.initialStonesInput = document.getElementById('initial-stones');

        // Show setup initially
        this.showSetup();
    },

    showSetup() {
        this.setupScreen.classList.remove('hidden');
        this.gameBoard.classList.add('hidden');
        this.controls.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    },

    start() {
        const initialStones = parseInt(this.initialStonesInput.value) || 20;
        this.state = {
            player: Player.H, // Human always starts per Haskell spec (implied by comenzarJuego)
            stones: initialStones
        };

        this.setupScreen.classList.add('hidden');
        this.gameBoard.classList.remove('hidden');
        this.controls.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');

        this.updateUI();
        this.log("Game started with " + initialStones + " stones. Your turn!");
    },

    reset() {
        this.showSetup();
    },

    updateUI() {
        // Update stone count
        this.stoneCountDisplay.textContent = this.state.stones;

        // Render stones visually
        this.stonesContainer.innerHTML = '';
        for (let i = 0; i < this.state.stones; i++) {
            const stone = document.createElement('div');
            stone.className = 'stone';
            this.stonesContainer.appendChild(stone);
        }

        // Update buttons state
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            // Only enable move buttons if it's human turn and move is valid
            if (btn.textContent.startsWith('Take')) {
                const move = parseInt(btn.textContent.split(' ')[1]);
                if (this.state.player === Player.H && move <= this.state.stones) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }
        });
    },

    humanMove(stonesToRemove) {
        if (this.state.player !== Player.H) return;

        this.processMove(stonesToRemove);

        if (this.state.stones > 0) {
            // Computer's turn
            this.statusMessage.textContent = "Computer is thinking...";
            setTimeout(() => this.computerMove(), 1000); // Add delay for realism
        }
    },

    computerMove() {
        if (this.state.stones === 0) return;

        const move = bestMove(this.state);
        this.log(`Computer takes ${move} stones.`);
        this.processMove(move);
    },

    processMove(stonesToRemove) {
        const previousPlayer = this.state.player;
        this.state = makeMove(stonesToRemove, this.state);
        this.updateUI();

        if (this.state.stones === 0) {
            this.endGame(previousPlayer);
        } else {
            if (this.state.player === Player.H) {
                this.statusMessage.textContent = "Your turn! How many stones will you take?";
            }
        }
    },

    endGame(lastPlayerToMove) {
        // If stones == 0, the player whose turn it *would be* (this.state.player) has lost.
        // The player who made the last move (lastPlayerToMove) took the last stone.
        // Wait, rule: "Cuando un jugador se queda sin piedras pierde".
        // This usually means if you can't move, you lose.
        // If I take the last stone, stones becomes 0.
        // The other player now has 0 stones and cannot move. So they lose.
        // So the player who took the last stone WINS.

        // Let's check Haskell:
        // if k' == 0 then putStrLn "Gano!" (This is inside jugar, after Human moves)
        // So if Human makes k=0, Human wins.

        let winner;
        if (lastPlayerToMove === Player.H) {
            winner = "You Won!";
            this.winnerMessage.style.color = "var(--success-color)";
        } else {
            winner = "Computer Won!";
            this.winnerMessage.style.color = "var(--danger-color)";
        }

        this.controls.classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
        this.winnerMessage.textContent = winner;
        this.statusMessage.textContent = "Game Over";
    },

    log(msg) {
        console.log(msg);
        // Optional: could show a log in UI
    }
};

// Initialize game on load if in browser
if (typeof window !== 'undefined') {
    window.onload = () => game.init();
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Player,
        Result,
        MOVES,
        makeMove,
        evalState,
        bestMove,
        game
    };
}
