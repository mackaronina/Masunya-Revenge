import Interactable from './Interactable.js';

export default class TableInteractable extends Interactable {
    constructor(scene, x, y) {
        super(scene, x, y, 'table_interactable');
    }

    onInteract() {
        this.scene.activateEndArrow();
        this.scene.pause();
        this.scene.events.emit('ui_show_notepad');
    }
}