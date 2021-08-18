import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: {
    preload,
    create,
  },
};

new Phaser.Game(config);

function preload() {
  this.load.image("sky-bg", "assets/sky.png");
}

function create() {
  this.add.image(0, 0, "sky-bg").setOrigin(0);
}
