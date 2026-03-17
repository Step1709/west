import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

class Creature extends Card {
    constructor() {
        super();
    }

    getDescriptions() {
        return [getCreatureDescription(this), ...super.getDescriptions()];
    }
}

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}



// Основа для утки.
class Duck extends Creature {
    constructor(name = 'Мирная утка', power = 2) {
        super();
        this.name = name;
        this.power = power;
    }
    quacks() { console.log('quack') };
    swims() { console.log('float: both;') };
}


// Основа для собаки.
class Dog extends Creature {
    constructor(name = 'Пес-бандит', power = 3) {
        super();
        this.name = name;
        this.power = power;
    }
}

class Gatling extends Creature {
    constructor(name = 'Гатлинг', power = 6) {
        super();
        this.name = name;
        this.power = power;
    }

    attack(gameContext) {
        const enemyCards = gameContext.oppositePlayer.table;

        enemyCards.forEach(card => {
            gameContext.taskQueue.addTask(() => {
                if (card) {
                    card.takeDamage(this.power, gameContext);
                }
            });
        });
    }
}

class Trasher extends Dog {
    constructor(name = 'Громила', power = 5) {
        super(name, power);
    }

    modifyTakenDamage(damage) {
        this.view.signalAbility(() => {});
        return Math.max(0, damage - 1);
    }

    getDescriptions() {
        return ['Получает на 1 меньше урона', ...super.getDescriptions()];
    }
}

class PseudoDuck extends Dog {
    constructor(name = 'Pseudo Duck', power = 3) {
        super();
    }
    quacks() { console.log('quack') };
    swims() { console.log('float: both;') };

    getDescriptions() {
        return ['утка-собака', getCreatureDescription(this)];
    }
}


// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Gatling(),
];
const banditStartDeck = [
    new Trasher(),
    new Dog(),
    new Dog(),
];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});
