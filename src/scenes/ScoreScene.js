import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
  constructor(config) {
    super('ScoreScene', config);
  }

  create() {
    super.create();
    this.createBestScore();
    this.createBackButton();
  }

  createBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    this.add
      .text(...this.screenCenter, `Best Score: ${bestScoreText || 0}`, {
        fontSize: '32px',
        fill: '#fff',
      })
      .setOrigin(0.5);
  }

  createBackButton() {
    const backBtn = this.add
      .text(16, 16, '< menu', { fontSize: '20px', fill: '#fff' })
      .setInteractive()
      .setOrigin(0);

    backBtn.on('pointerover', () => {
      backBtn.setStyle({ fontSize: '22px', fill: '#ff0' });
    });

    backBtn.on('pointerout', () => {
      backBtn.setStyle({ fontSize: '20px', fill: '#fff' });
    });

    backBtn.on('pointerup', () => {
      this.scene.start('MenuScene');
    });
  }
}

export default ScoreScene;
