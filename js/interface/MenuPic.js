import PhysicObject from '../PhysicObject.js';

export default class MenuPic extends PhysicObject {
    constructor(scene, y, sprite, frame = 0) {
        super(scene, scene.game.config.width / 2, y, sprite, frame);
        this.depth = 99;
        this.setOrigin(0.5);
        this.setScrollFactor(0);
    }
}