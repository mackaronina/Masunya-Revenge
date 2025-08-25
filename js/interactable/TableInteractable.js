import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class TableInteractable extends PhysicObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'table_interactable');
        this.setOrigin(0.5);
        this.setScale(3);
        this.depth = config.depth.interactable;
        this.postFX.addShine(1, 0.3, 5);
        this.visible = false;
        this.scene.physics.add.collider(this, this.scene.player, () => {
            if (!this.visible) return;
            this.visible = false;
            this.scene.showRecipe();
        });
    }

    static preload(scene) {
        scene.load.image('table_interactable', 'assets/images/table_interactable.png');
    }

    activate() {
        this.visible = true;
    }
}
