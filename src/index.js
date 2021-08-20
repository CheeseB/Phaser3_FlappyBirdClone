import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
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

function preload() {
  this.load.image("sky-bg", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

let bird = null;
let upperPipe = null;
let lowerPipe = null;
const flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };

function create() {
  this.add.image(0, 0, "sky-bg").setOrigin(0);

  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 400;

  upperPipe = this.physics.add.sprite(400, 300, "pipe").setOrigin(0, 1);
  lowerPipe = this.physics.add
    .sprite(400, upperPipe.y + 100, "pipe")
    .setOrigin(0);

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown_SPACE", flap);
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
