const Neat = neataptic.Neat
const Config = neataptic.Config

Config.warnings = false

const neat = new Neat(16, 4, null, {
  popsize: PLAYERS,
  elitism: ELITISM,
  mutationRate: MUTATION_RATE,
  mutationAmount: MUTATION_AMOUNT,
  network: new neataptic.Architect.Perceptron(16 * 18 + 2, 20, 4)
})

const chartData = {
  labels: [],
  datasets: [{
      name: 'Max',
      values: []
    },
    {
      name: 'Average',
      values: []
    },
    {
      name: 'Min',
      values: []
    }
  ]
}

const chart = new Chart('#chart', {
  title: 'generation score history',
  type: 'line',
  height: 200,
  data: chartData
})

let highestScore = 0

const runner = new Runner({
  neat,
  playerCount: PLAYERS,
  gameSize: GAME_SIZE,
  frameRate: FRAME_RATE,
  maxTurns: MAX_TURNS,
  gamesPerPlayer: GAMES_PER_PLAYER,
  lowestScoreAllowed: LOWEST_SCORE_ALLOWED,
  onEndGeneration: ({
    generation,
    max,
    avg,
    min
  }) => {

    chartData.labels.push(generation.toString())
    chartData.datasets[0].values.push(max)
    chartData.datasets[1].values.push(avg)
    chartData.datasets[2].values.push(min)

    if (chartData.labels.length > 15) {
      chartData.labels.shift()
      chartData.datasets.forEach(d => d.values.shift())
    }

    chart.update(chartData)
    if (max > highestScore) {
      highestScore = max
    }

    document.getElementById('generation').innerHTML = generation
    document.getElementById('highest-score').innerHTML = highestScore
  }
})

runner.startGeneration()