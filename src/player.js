class Player {

  constructor({
    size,
    gameCount,
    frameRate,
    maxTurns,
    lowestScoreAllowed,
    onPlayerFinished
  }) {
    this.games = []
    this.brain = null
    this.onPlayerFinished = onPlayerFinished


    for (let i = 0; i < gameCount; i++) {
      this.games.push(new Game({
        size: size,
        frameRate: frameRate,
        maxTurns: maxTurns,
        lowestScoreAllowed: lowestScoreAllowed,
        player: this
      }))
    }
  }

  start(brain) {

    this.brain = brain

    if (this.brain === null) {
      return
    }

    this.brain.score = 0

    for (let i = 0; i < this.games.length; i++) {
      this.games[i].start()
    }
  }

  getMovement(grid, noMoveCounter) {

    // activate the neural network (aka "where the magic happens")

    let emptyTileCount = 0
    let input = []

    //const maxPossibleScore = 3932100;

    for (let k = 0; k < grid.length; k++) {

      let value = grid[k]
      let valueLog = Math.log(value)

      for (let i = 0; i < 18; i++) {

        if ((i == 0 && value == 0) || (valueLog == i)) {
          input.push(1)
        } else {
          input.push(0)
        }
      }
      if (value == 0) {
        emptyTileCount++
      }
    }


    /* const input = grid.map((x) => {
      return x / maxPossibleScore;
    });*/
    input.push(noMoveCounter / 5)
    input.push(emptyTileCount / 16)
    const output = this.brain.activate(input)

    var maxValue = 0;
    var direction = 0
    for (var i = 0; i < output.length; i++) {
      if (output[i] > maxValue) {
        maxValue = output[i];
        direction = i;
      }
    }
    return direction
  }

  finishGame(score) {

    this.brain.score += score;

    if (this.gamesFinished + 1 < this.games.length) {
      this.gamesFinished++
      return
    }

    this.onPlayerFinished()

  }
}