import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
  constructor(config) {
    super('ScoreScene', { ...config, canGoBack: true });
  }

  create() {
    super.create();
    this.createBestScore();
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
}

export default ScoreScene;
