import Phaser from 'phaser';

const VELOCITY = 200;
const PIPES_TO_RENDER = 10;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = config;

    this.bird = null;
    this.pipes = null;

    this.pipeVerticalDistanceRange = [100, 250];
    this.pipeHorizontalDistanceRange = [300, 400];
    this.flapVelocity = 250;
  }

  preload() {
    this.load.image('sky-bg', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }

  create() {
    this.createBG();
    this.createBird();
    this.createPipes();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG() {
    this.add.image(0, 0, 'sky-bg').setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
      .setOrigin(0);
    this.bird.body.gravity.y = 400;
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-VELOCITY);
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  checkGameStatus() {
    if (this.bird.y < -this.bird.height || this.bird.y > this.config.height) {
      this.restartBirtPosition();
    }
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  restartBirtPosition() {
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
    this.bird.body.velocity.y = 0;
  }

  placePipe(uPipe, lPipe) {
    const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0, this.config.height - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
    const rightMostX = this.getRightMostPipe();

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = rightMostX + pipeHorizontalDistance;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  recyclePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
        }
      }
    });
  }
}

export default PlayScene;
