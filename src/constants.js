// game settings

const PLAYERS = 100
const GAME_SIZE = 100
const FRAME_RATE = 45
const GAMES_PER_PLAYER = 2

// game bottlenecks

const MAX_TURNS = 500000
const LOWEST_SCORE_ALLOWED = -50

// neural network settings

const MUTATION_RATE = 0.3
const MUTATION_AMOUNT = 3
const ELITISM = Math.round(0.2 * PLAYERS)