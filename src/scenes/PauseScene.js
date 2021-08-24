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
      console.log('click');
    });
  }
}

export default PauseScene;
