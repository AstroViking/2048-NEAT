class Game {

  constructor({
    size,
    frameRate,
    maxTurns,
    lowestScoreAllowed,
    player
  }) {
    this.size = size
    this.cellsPerRow = 4
    this.cellSize = this.size / this.cellsPerRow
    this.frameRate = frameRate
    this.maxTurns = maxTurns
    this.lowestScoreAllowed = lowestScoreAllowed
    this.status = 'IDLE'
    this.player = player
    this.grid = new Array(this.cellsPerRow * this.cellsPerRow).fill(0)
    this.turns = 0
    this.hasMoved = false
    this.score = 0
    this.noMoveCounter = 0


    const game = this

    new p5(p => {
      p.setup = () => {
        p.frameRate(game.frameRate)
        p.createCanvas(game.size + 2, game.size + 2)
      }

      p.drawText = (msg, inkColor, size, x, y) => {
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(size);
        p.fill(inkColor);
        p.noStroke();
        p.text(msg, x, y);
      }

      p.drawGrid = () => {
        for (let row = 0; row < game.cellsPerRow; row++) {
          for (let col = 0; col < game.cellsPerRow; col++) {
            const idx = row * game.cellsPerRow + col;
            const seed = Math.min(p5.prototype.map(Math.pow(this.grid[idx], 1 / 11), 1, 2, 1, 200), 200);
            if (this.grid[idx] === 0) {
              p.noFill();
            } else {
              const r = p5.prototype.map(seed, 1, 200, 150, 50);
              const g = p5.prototype.map(seed, 1, 200, 255, 100);
              const b = p5.prototype.map(seed, 1, 200, 100, 0);
              p.fill(r, g, b);
            }
            p.strokeWeight(2);
            p.stroke(64);
            p.rect(col * game.cellSize + 1, row * game.cellSize + 1, game.cellSize, game.cellSize, 10);
            if (this.grid[idx] !== 0) {
              const msg = `${this.grid[idx]}`;
              const size = this.cellSize / 4 * 3
              const r = p5.prototype.map(seed, 1, 200, 0, 30);
              const g = p5.prototype.map(seed, 1, 200, 60, 200);
              const b = p5.prototype.map(seed, 1, 200, 100, 255);
              p.drawText(msg,
                p.color(r, g, b, 255),
                size,
                col * game.cellSize + game.cellSize / 2 + 2,
                row * game.cellSize + game.cellSize / 2 + 2);
            }
          }
        }
      }

      p.draw = () => {

        if (['IDLE', 'GAME_OVER'].indexOf(game.status) !== -1) {
          p.background('#EEE')
          p.drawText(game.score.toString(), 0, this.size / 4, this.size / 2, this.size / 2)
          return
        }

        p.background(255)

        game.move(game.player.getMovement(game.grid, this.noMoveCounter))

        game.updateGameStatus()

        if (game.status === 'GAME_OVER') {
          return game.player.finishGame(game.score)
        }

        p.drawGrid()

        game.turns++
      }
    }, 'wrapper')
  }

  updateGameStatus() {
    const noMoreRoomLeft = !this.movesLeft();
    const notMoved = this.noMoveCounter > 10;
    const gameLastedLongEnough = this.turns > this.maxTurns
    const scoreTooLow = this.score <= this.lowestScoreAllowed

    if (noMoreRoomLeft || notMoved || gameLastedLongEnough || scoreTooLow) {
      this.status = 'GAME_OVER'
    }
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  start() {
    this.grid = new Array(this.cellsPerRow * this.cellsPerRow).fill(0);
    this.turns = 0
    this.score = 0
    this.addNumber();
    this.addNumber();
    this.status = 'RUNNING'
  }

  addNumber() {
    const opts = [];
    this.grid.forEach((x, i) => {
      if (x === 0) {
        opts.push(i);
      }
    });
    if (opts.length > 0) {
      const idx = opts[Math.floor(Math.random(opts.length))];
      const seed = Math.random(1);
      this.grid[idx] = seed > 0.5 ? 4 : 2;
    }
  }

  move(direction) {

    //if (!this.isValidDirection()) {

    //}

    switch (direction) {
      //right
      case 0:
        this.horizontalSlide(false)
        break;
        //left
      case 1:
        this.horizontalSlide(true);
        break;
        //down
      case 2:
        this.verticalSlide(false);
        break;
        //up
      case 3:
        this.verticalSlide(true);
        break;
    }
  }

  isValidDirection(direction) {

    valid = false;

    switch (direction) {
      case 0:
        for (let row = 0; row < game.cellsPerRow; row++) {
          for (let col = 0; col < game.cellsPerRow; col++) {
            const idx = row * game.cellsPerRow + col;
            const idx2 = col == (game.cellsPerRow - 1) ? idx - 1 : idx + 1

            if (this.grid[idx] === this.grid[idx2]) {
              valid = true
            }
          }
        }
        break;
      case 1:
        for (let row = 0; row < game.cellsPerRow; row++) {
          for (let col = 0; col < game.cellsPerRow; col++) {
            const idx = row * game.cellsPerRow + col;
            const idx2 = col == (game.cellsPerRow - 1) ? idx - 1 : idx + 1

            if (this.grid[idx] === this.grid[idx2]) {
              valid = true
            }
          }
        }
        break;
      case 2:
        for (let row = 0; row < game.cellsPerRow; row++) {
          for (let col = 0; col < game.cellsPerRow; col++) {
            const idx = row * game.cellsPerRow + col;
            const idx2 = row == (game.cellsPerRow - 1) ? idx - game.cellsPerRow : idx + game.cellsPerRow;

            if (this.grid[idx] === this.grid[idx2]) {
              valid = true
            }
          }
        }
        break;
      case 3:
        for (let row = 0; row < game.cellsPerRow; row++) {
          for (let col = 0; col < game.cellsPerRow; col++) {
            const idx = row * game.cellsPerRow + col;
            const idx2 = row == (game.cellsPerRow - 1) ? idx - game.cellsPerRow : idx + game.cellsPerRow;

            if (this.grid[idx] === this.grid[idx2]) {
              valid = true
            }
          }
        }
        break;
    }
  }

  verticalSlide(up) {
    let past = Array.from(this.grid);
    for (let c = 0; c < this.cellsPerRow; c++) {
      let column = this.getVerticalRow(c);
      column = this.combine(column, up);
      column = column.filter(x => x > 0);
      const z = new Array(this.cellsPerRow - column.length).fill(0);
      column = up === true ? column.concat(z) : z.concat(column);
      this.setVerticalRow(column, c);
    }
    this.checkSlide(past);
  }

  horizontalSlide(left) {
    let past = Array.from(this.grid);
    for (let i = 0; i < this.cellsPerRow; i++) {
      let row = this.grid.slice(i * this.cellsPerRow, i * this.cellsPerRow + this.cellsPerRow);
      row = this.combine(row, left);
      row = row.filter(x => x > 0);
      const z = new Array(this.cellsPerRow - row.length).fill(0);
      row = left === true ? row.concat(z) : z.concat(row);
      this.grid.splice(i * this.cellsPerRow, this.cellsPerRow);
      this.grid.splice(i * this.cellsPerRow, 0, ...row);
    }
    this.checkSlide(past);
  }

  checkSlide(past) {
    if (this.somethingMoved(past)) {
      this.addNumber();
      this.hasMoved = true;
      this.noMoveCounter = 0
    } else {
      this.hasMoved = false
      this.noMoveCounter++
    }
  }

  movesLeft() {
    // check neighbors
    for (let row = 0; row < this.cellsPerRow; row++) {
      for (let col = 0; col < this.cellsPerRow; col++) {
        const current = this.grid[row * this.cellsPerRow + col];
        if (current === 0) {
          // grid still has empty spots
          return true;
        }
        // last column doesnt have a right neighbor
        const right = (col < this.cellsPerRow - 1) ? this.grid[row * this.cellsPerRow + col + 1] : 0;
        // last row doesnt have a bottom neighbor
        const bottom = (row < this.cellsPerRow - 1) ? this.grid[(row + 1) * this.cellsPerRow + col] : 0;
        if (current === right || current === bottom) {
          return true;
        }
      }
    }
    return false;
  }

  somethingMoved(past) {
    return !(this.grid.every((x, i) => x === past[i]));
  }

  setVerticalRow(column, c) {
    for (let i = 0; i < column.length; i++) {
      const val = column[i];
      const idx = i * this.cellsPerRow + c;
      this.grid[idx] = val;
    }
  }

  getVerticalRow(c) {
    const result = [];
    for (let i = 0; i < this.cellsPerRow; i++) {
      const val = this.grid[i * this.cellsPerRow + c];
      result.push(val);
    }
    return result;
  }

  combine(row, upLeft) {
    if (upLeft) {
      return this.combineUpLeft(row);
    } else {
      return this.combineDownRight(row);
    }
  }

  combineUpLeft(row) {
    const forStart = 0;
    return this.combineRow(row, forStart, (i, x) => i < x - 1, i => i + 1);
  }

  combineDownRight(row) {
    const forStart = row.length - 1;
    return this.combineRow(row, forStart, (i, x) => i > 0, i => i - 1);
  }

  combineRow(row, forStart, forCond, forIncr) {
    for (let i = forStart; forCond(i, row.length); i = forIncr(i)) {
      const a = row[i];
      let idx = forIncr(i);
      let b = row[idx];
      while (b === 0 && forCond(idx, row.length)) {
        idx = forIncr(idx);
        b = row[idx];
      }
      if (a === b && a !== 0) {
        row[i] = a + b;
        this.score += row[i];
        row[idx] = 0;
      }
    }
    return row;
  }

}