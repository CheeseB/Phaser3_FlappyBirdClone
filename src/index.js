import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);

let bird = null;
let upperPipe = null;
let lowerPipe = null;
let pipeHorizontalDistance = 0;

const VELOCITY = 200;
const flapVelocity = 250;
const PIPES_TO_RENDER = 4;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };
const pipeVerticalDistanceRange = [100, 250];

function preload() {
  this.load.image('sky-bg', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create() {
  this.add.image(0, 0, 'sky-bg').setOrigin(0);

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    pipeHorizontalDistance += 300;
    let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    let pipeVerticalPosition = Phaser.Math.Between(0, config.height - pipeVerticalDistance);

    upperPipe = this.physics.add
      .sprite(pipeHorizontalDistance, pipeVerticalPosition, 'pipe')
      .setOrigin(0, 1);
    lowerPipe = this.physics.add
      .sprite(pipeHorizontalDistance, upperPipe.y + pipeVerticalDistance, 'pipe')
      .setOrigin(0);

    upperPipe.body.velocity.x = -VELOCITY;
    lowerPipe.body.velocity.x = -VELOCITY;
  }

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

function update() {
  if (bird.y < -bird.height || bird.y > config.height) {
    restartBirtPosition();
  }
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartBirtPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}
