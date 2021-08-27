import BaseScene from './BaseScene';

const VELOCITY = 200;
const PIPES_TO_RENDER = 10;

class PlayScene extends BaseScene {
  constructor(config) {
    super('PlayScene', config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.flapVelocity = 250;

    this.score = 0;
    this.scoreText = '';

    this.currentDifficulty = 'easy';
    this.defficulties = {
      easy: {
        pipeHorizontalDistanceRange: [400, 500],
        pipeVerticalDistanceRange: [170, 200],
      },
      normal: {
        pipeHorizontalDistanceRange: [300, 400],
        pipeVerticalDistanceRange: [130, 160],
      },
      hard: {
        pipeHorizontalDistanceRange: [200, 300],
        pipeVerticalDistanceRange: [100, 120],
      },
    };
  }

  create() {
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createDifficulty();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', {
        start: 8,
        end: 15,
      }),
      frameRate: 8, // default: 24
      repeat: -1, // infinite
    });

    this.bird.play('fly');
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
      .setOrigin(0)
      .setScale(3)
      .setFlipX(true);

    this.bird.setBodySize(this.bird.width - 2, this.bird.height - 8);
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-VELOCITY);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');

    this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: '32px', fill: '#000' });
    this.add.text(16, 52, `Best Score: ${bestScore || 0}`, { fontSize: '28px', fill: '#000' });
  }

  createDifficulty() {
    this.currentDifficulty = 'easy';
    this.difficultyText = this.add.text(16, 88, this.currentDifficulty, {
      fontSize: '28px',
      fill: '#000',
    });
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, 'pause')
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on('pointerdown', this.pauseGame, this);
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  pauseGame() {
    this.isPaused = true;
    this.physics.pause();
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }
    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(...this.screenCenter, this.initialTime, this.fontOptions)
        .setOrigin(0.5);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText(this.initialTime);

    if (this.initialTime <= 0) {
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
      this.isPaused = false;
    }
  }

  checkGameStatus() {
    if (this.bird.y <= 0 || this.bird.getBounds().bottom >= this.config.height) {
      this.gameOver();
    }
  }

  recyclePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.defficulties[this.currentDifficulty];
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0, this.config.height - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
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

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
  }

  increaseDifficulty() {
    if (this.score === 10) {
      this.currentDifficulty = 'normal';
      this.difficultyText.setText(this.currentDifficulty);
      this.difficultyText.setColor('#f88');
    }

    if (this.score === 20) {
      this.currentDifficulty = 'hard';
      this.difficultyText.setText(this.currentDifficulty);
      this.difficultyText.setColor('#f00');
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }
}

export default PlayScene;
