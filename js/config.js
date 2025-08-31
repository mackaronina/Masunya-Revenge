const config = {
    debug: false,
    startLevel: 4,
    reactionTime: 400,
    mouseSensitivity: 1.25,
    bullet: {
        speed: 4500
    },
    grenade: {
        speed: 2000,
        explosionTime: 1500,
        countBullets: 32
    },
    chaos: {
        health: 3
    },
    entity: {
        runSpeed: 1000,
        stepSpeed: 400,
    },
    grenadesBox: {
        maxGrenades: 5
    },
    depth: {
        background: -1,
        floor: 0,
        blood: 2,
        furniture: 10,
        brokenGlass: 11,
        interactable: 11,
        deadBody: 12,
        droppedWeapon: 13,
        entity: 15,
        bullet: 16,
        arrow: 19,
        glass: 20,
        door: 30,
        walls: 30,
        grenadesBox: 31,
        interface: 99,
        cursor: 100
    },
    movingPattern: {
        patrol: 'patrol',
        random: 'random',
        stand: 'stand'
    },
    brokenGlassTiles: {
        124: 125,
        164: 165,
        204: 205,
        161: 201,
        162: 202,
        163: 203
    },
    text: {
        ru: {
            interactGrenadesBox: 'ПКМ - Взять гранату',
            controls: `WASD - Движение
LMB - Стрельба/удар
RMB - Поднять/выкинуть
оружие
SPACE - Добивание
SHIFT - Осмотреться`,
            intro: `Некославия, город Северсталь, завод пилка
            
В этот день Масюня пошла не только против некоарков,
но и всего мира`,
            deathCount: 'Смертей:',
            ending: `В результате террористической 
атаки на завод пилка зверски 
убито 46 сотрудников завода. 
Также был безвозвратно утерян 
рецепт пилка, в связи с чем 
завод не сможет возобновить 
производство. Полиция 
Некославии объявила о начале 
расследования. На фоне этих
событий акции PILK Industries
упали на 80% за один день`
        }
    }
}
export default config;