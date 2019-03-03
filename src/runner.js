class Runner {

  constructor({
    neat,
    playerCount,
    gameSize,
    frameRate,
    maxTurns,
    lowestScoreAllowed,
    gamesPerPlayer,
    onEndGeneration
  }) {
    this.neat = neat
    this.players = []
    this.playerFinished = 0
    this.onEndGeneration = onEndGeneration


    let oldGenome = JSON.parse(localStorage.getItem('2048Genome'));

    if (oldGenome && oldGenome.length == playerCount) {
      this.neat.import(oldGenome);
    }

    for (let i = 0; i < playerCount; i++) {
      this.players.push(new Player({
        size: gameSize,
        gameCount: gamesPerPlayer,
        frameRate: frameRate,
        maxTurns: maxTurns,
        lowestScoreAllowed: lowestScoreAllowed,
        onPlayerFinished: () => this.endGeneration()
      }))
    }
  }

  startGeneration() {
    this.playersFinished = 0

    for (let i = 0; i < this.players.length; i++) {
      this.players[i].start(this.neat.population[i])
    }
  }

  endGeneration() {
    if (this.playersFinished + 1 < this.players.length) {
      this.playersFinished++
      return
    }

    this.neat.sort()

    localStorage.setItem('2048Genome', JSON.stringify(this.neat.export()));

    this.onEndGeneration({
      generation: this.neat.generation,
      max: this.neat.getFittest().score,
      avg: Math.round(this.neat.getAverage()),
      min: this.neat.population[this.neat.popsize - 1].score
    })

    const newGeneration = []

    for (let i = 0; i < this.neat.elitism; i++) {
      newGeneration.push(this.neat.population[i])
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newGeneration.push(this.neat.getOffspring())
    }

    this.neat.population = newGeneration
    this.neat.mutate()
    this.neat.generation++
    this.startGeneration()
  }

}