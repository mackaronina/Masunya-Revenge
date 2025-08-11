import Interactable from './Interactable.js';

export default class TableInteractable extends Interactable {
    constructor(scene, x, y) {
        super(scene, x, y, 'table_interactable');
    }

    static preload(scene) {
        scene.load.image('table_interactable', 'assets/images/table_interactable.png');
    }

    onInteract() {
        this.scene.activateEndArrow();
        this.scene.pause();
        this.scene.events.emit('ui_show_notepad');
    }
}