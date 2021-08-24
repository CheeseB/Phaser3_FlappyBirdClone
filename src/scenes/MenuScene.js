import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
  constructor(config) {
    super('MenuScene', config);

    this.menu = [
      { scene: 'PlayScene', text: 'Play' },
      { scene: 'ScoreScene', text: 'Score' },
      { scene: null, text: 'Exit' },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGameObj = menuItem.textGameObj;
    textGameObj.setInteractive();

    textGameObj.on('pointerover', () => {
      textGameObj.setStyle({ fill: '#ff0', fontSize: '36px' });
    });

    textGameObj.on('pointerout', () => {
      textGameObj.setStyle({ fill: '#fff', fontSize: '34px' });
    });

    textGameObj.on('pointerup', () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === 'Exit') {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
