const DUNGEON_SIZE = 5;

class Hunter {
    constructor(level, hp, atk, def, block, imageUrl) {
        this.level = level;
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.block = block;
        this.imageUrl = imageUrl;
        this.isPlayer = false;
    }
}

class Player extends Hunter {
    constructor(level, hp, atk, def, block, imageUrl) {
        super(level, hp, atk, def, block, imageUrl);
        this.currentExp = 0;
        this.maxExp = 10;
        this.moves = [
            allMoves['bash'], 
            allMoves['barrier'], 
            allMoves['pushups'], 
            allMoves['roids']
        ];
        this.nextMove = null;
        this.warningMessage = '';
        this.canLevelUp = false;
        this.isPlayer = true;
    }

    setNextMove(move) {
        this.nextMove = move;
    }

    levelUp() {
        while (this.currentExp >= this.maxExp) {
            this.level += 1;
            this.hp += 50;
            this.atk += 1;
            this.def += 1;
            this.currentExp -= this.maxExp;

            if (this.level >= 100) {
                this.imageUrl = 'assets/sungjinwoo100.jpg';
            }
        }
    }

    rest() {
        this.hp = Math.min(50, this.hp + Math.floor(this.hp * 0.05));
    }

    becomePlayer() {
        this.hp = 50; 
        this.canLevelUp = true;
    }

    resetStats() {
        this.atk = 5;
        this.def = 5;
    }
}

class Monster extends Hunter {
    constructor(monsterType, name, level, hp, atk, def, block, imageUrl, exp) {
        super(level, hp, atk, def, block, imageUrl);
        this.monsterType = monsterType;
        this.name = name;
        this.exp = exp;
        this.nextMove = null;
        this.moves = [
            allMoves['claw'], 
            allMoves['eatCandy'], 
            allMoves['barrelRoll']
        ];
    }

    prepareNextMove() {
        let i = getRandomInt(0, this.moves.length - 1);
        this.nextMove = this.moves[i];
    }
}

class MonsterFactory {
    static create(monsterType) {
        let newMonster = null;
        if (monsterType === 'goblin') {
            newMonster = new Monster(monsterType, 'Goblin person', 1, 50, 5, 5, 0, 'assets/goblin.png', 5);
        } else if (monsterType === 'orc') {
            newMonster = new Monster(monsterType, 'Orc person', 100, 1000, 20, 20, 0, 'assets/tusk.jpg', 100);
        } else if (monsterType === 'ant') {
            newMonster = new Monster(monsterType, 'Ant person', 9000, 10000, 1000, 1000, 0, 'assets/ant.png', 1000);
        } else if (monsterType == 'statue') {
            newMonster = new Monster(monsterType, 'Statue person', 1000000, 1000000, 10000, 10000, 0, 'assets/scary_statue.png', 10000);
        } else {
            newMonster = new Monster('unknown', 'Mystery???', 69, 69, 69, 69, 69, 'assets/mystery.png', 69);
        }
        return newMonster;
    };
}

class Move {
    constructor(name, damage, block, heal, buffAtk, buffDef) {
        this.name = name;
        this.damage = damage;
        this.block = block;
        this.heal = heal;
        this.buffAtk = buffAtk;
        this.buffDef = buffDef;
    }

    resolve(actor, target) {
        // apply healing
        actor.hp += this.heal;

        // apply block 
        if (this.block > 0) {
            actor.block += (this.block + actor.def);
        }

        // apply buffs
        actor.atk += this.buffAtk;
        actor.def += this.buffDef;
        
        // deal damage
        if (this.damage > 0) {
            let damageDealt = (this.damage + actor.atk) - (target.block);
            if (damageDealt > 0) {
                // prevent negative HP
                target.hp -= damageDealt > target.hp ? target.hp : damageDealt;
            }
        }

        // block is removed at the end of the turn next turn
        target.block = 0;
    }
}

let allMoves = {
    bash: new Move('bash', 5, 0, 0, 0, 0),
    barrier: new Move('barrier', 0, 10, 0, 0, 0),
    pushups: new Move('do some push ups', 0, 2, 0, 2, 2),
    roids: new Move('inject roids', 0, 0, -5, 8, -1),
    claw: new Move('claw', 10, 0, 0, 0, 0),
    eatCandy: new Move('eat candy', 0, 5, 5, 1, 0),
    barrelRoll: new Move('barrel roll', 2, 4, 0, 0, 0)
}

class Dungeon {
    constructor(player, monsters, width, height) {
        this.player = player;
        this.monsters = monsters;
        this.currentBattle = null;
        this.cells = [];
        this.selectedCell = null;
        this.playerLocation = null;
        this.init();
    }

    isBattleInProgress () {
        return this.currentBattle && this.currentBattle.status !== 'resolved';
    }

    startBattleWith (opponent, location) {
        this.currentBattle = new Battle(this.player, MonsterFactory.create(opponent.monsterType), location);
    }

    movePlayerToCell (cell) {
        // remove player from old cell
        this.playerLocation.units = this.playerLocation.units.filter(x => !x.isPlayer);
        // put them in the new cell
        cell.units.push(this.player);
        this.playerLocation = cell;
        this.revealAdjacentCells(cell);
        // immediately start battle if there are monsters in the new cell
        if (cell.units.length > 1) {
            this.startBattleWith(cell.units[0], cell);
        }
    }

    canMovePlayerToCell (cell) {
        let dx = Math.abs(cell.x - this.playerLocation.x) ;
        let dy = Math.abs(cell.y - this.playerLocation.y);
        return dx <= 1 && dy <= 1 && (dx + dy != 0);
    }

    revealAdjacentCells (cell) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let x = cell.x + i;
                let y = cell.y + j;
                if (x >= 0 && x < DUNGEON_SIZE && y >= 0 && y < DUNGEON_SIZE) {
                    this.cells[x][y].isRevealed = true;
                }
            }
        }
    }

    init() {
        let cells = [];
        for (let i = 0; i < DUNGEON_SIZE; i++) {
            let row = [];
            for (let j = 0; j < DUNGEON_SIZE; j++) {
                let newCell = new DungeonCell(i, j, [], []);
                row.push(newCell);
            }
            cells.push(row);
        }
        // place units in the cells
        cells[0][0].units.push(this.player);
        let monsterLocations = getRandomSubarray([...Array(DUNGEON_SIZE**2).keys()].slice(1), this.monsters.length);
        for (let i = 0; i < monsterLocations.length; i++) {
            let monster = this.monsters[i];
            let locIndex = monsterLocations[i];
            let x = Math.floor(locIndex/DUNGEON_SIZE);
            let y= locIndex % DUNGEON_SIZE;
            cells[x][y].units.push(monster);
        }
        this.cells = cells;
        this.selectedCell = null;
        this.playerLocation = this.cells[0][0];
        this.revealAdjacentCells(this.playerLocation);
    }
}

class DungeonCell {
    constructor(x, y, units, materials) {
        this.x = x;
        this.y = y;
        this.units = units;
        this.isSelected = false;
        this.isRevealed = false;
        this.materials = materials;
    }

    isEmpty() {
        return this.units.length == 0;
    }
}

class Battle {
    constructor(player, monster, location) {
        this.player = player;
        this.monster = monster;
        this.status = 'incomplete'
        this.location = location;
        this.initBattle();
    }

    progressBattle() {
        this.runTurn();
        if (this.status !== 'incomplete' && this.status !== 'resolved') {
            this.finishBattle();
        } else {
            this.prepareNextTurn();
        }
    }

    checkWin() {
        if (this.player.hp <= 0) {
            this.status = 'lose';
            return;
        }
        if (this.monster.hp <= 0) {
            this.status = 'win';
            return;
        }
        this.status = 'incomplete';
    }

    runTurn() {
        // player takes their turn
        this.player.nextMove.resolve(this.player, this.monster);
        this.checkWin();
        if (this.status !== 'incomplete') {
            return;
        }

        // enemy takes their turn
        this.monster.nextMove.resolve(this.monster, this.player);
        this.checkWin();
    }

    finishBattle() {
        if (this.status !== 'incomplete' && this.status !== 'resolved') {
            // grant exp to the player if they won
            if (this.status === 'win') {
                this.location.units = [this.player];
                if (this.player.canLevelUp) {
                    this.player.currentExp += this.monster.exp;
                    this.player.levelUp();
                } else {
                    this.player.resetStats(); // Can't level up if not player...
                }
                this.status = 'resolved';
            }
        }
    }
    
    prepareNextTurn() {
        this.monster.prepareNextMove();
    }
    
    isPlayerTransformationPossible() {
        return !this.player.canLevelUp 
            && this.player.hp === 0
            && this.monster.monsterType === "statue"
    }

    initBattle() {
        this.prepareNextTurn();
    }
}

class SoloLevelingGame {
    constructor() {
        this.dungeon = null;
        this.player = null;
        this.initGame();
    }

    initGame() {
        this.player = new Player(0, 50, 5, 5, 0,'assets/sungjinwoo.png');
        let monsters = [
            MonsterFactory.create('goblin'), 
            MonsterFactory.create('orc'), 
            MonsterFactory.create('ant'), 
            MonsterFactory.create('statue')
        ] 
        this.dungeon = new Dungeon(this.player, monsters, 5, 5);
    }
}