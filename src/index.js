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
}

const VELOCITY = 200;
let bird = null;

function create() {
  this.add.image(0, 0, "sky-bg").setOrigin(0);
  bird = this.physics.add
    .sprite(config.width / 10, config.height / 2, "bird")
    .setOrigin(0);
  bird.body.velocity.x = VELOCITY;
}

function update() {
  if (bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -VELOCITY;
  } else if (bird.x <= 0) {
    bird.body.velocity.x = VELOCITY;
  }
}
