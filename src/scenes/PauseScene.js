import BaseScene from './BaseScene';

class PauseScene extends BaseScene {
  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      { scene: 'PlayScene', text: 'Continue' },
      { scene: 'MenuScene', text: 'Menu' },
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
      if (menuItem.scene && menuItem.text === 'Continue') {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop('PlayScene');
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
