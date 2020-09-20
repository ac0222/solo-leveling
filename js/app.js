let playerMoves = [
    {
        name: 'bash',
        damage: 5,
        block: 0,
        heal: 0,
        buffAtk: 0,
        buffDef: 0,
    },
    {
        name: 'barrier',
        damage: 0,
        block: 10,
        heal: 0,
        buffAtk: 0,
        buffDef: 0,
    },
    {
        name: 'do some push ups',
        damage: 0,
        block: 2,
        heal: 0,
        buffAtk: 2,
        buffDef: 2,
    },
    {
        name: 'inject roids',
        damage: 0,
        block: 0,
        heal: -5,
        buffAtk: 8,
        buffDef: -1,
    },
];

let player = {
    level: 0,
    currentExp: 0,
    maxExp: 10,
    hp: 50,
    atk: 5,
    def: 5,
    block: 0,
    imageUrl: 'assets/sungjinwoo.png',
    nextMove: null,
    moves: playerMoves,
    warningMessage: '' 
};

let goblin = {
    name: 'Goblin person',
    level: 1,
    exp: 5, // Exp gained if killed by player
    hp: 50,
    atk: 5,
    def: 5,
    block: 0,
    imageUrl: 'assets/goblin.png'
};

let orc = {
    name: 'Orc person',
    level: 1000,
    exp: 10, // Exp gained if killed by player
    hp: 50,
    atk: 5,
    def: 5,
    block: 0,
    imageUrl: 'assets/tusk.jpg'
};

let ant = {
    name: 'Ant person',
    level: 9000,
    exp: 10, // Exp gained if killed by player
    hp: 50,
    atk: 5,
    def: 5,
    block: 0,
    imageUrl: 'assets/ant.png'
};

let big_boss = {
    name: 'Statue person',
    level: 1000000,
    exp: 10, // Exp gained if killed by player
    hp: 50,
    atk: 5,
    def: 5,
    block: 0,
    imageUrl: 'assets/scary_statue.png'
};

let opponents = [
    goblin,
    orc,
    ant,
    big_boss
];

let opponentMoves = [
    {
        name: 'claw',
        damage: 10,
        block: 0,
        heal: 0,
        buffAtk: 0,
        buffDef: 0,
    },
    {
        name: 'eat candy',
        damage: 0,
        block: 5,
        heal: 5,
        buffAtk: 1,
        buffDef: 0,
    },
    {
        name: 'barrel roll',
        damage: 2,
        block: 4,
        heal: 0,
        buffAtk: 0,
        buffDef: 0,
    }
];

let game = {
    player: player,
    opponent: null
};

let activityLog = ''

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runTurn(game) {
    // player takes their turn
    applyMove(game.player, game.opponent, game.player.nextMove);
    // console.log(game);
    let res = checkWin(game);
    if (res !== 'continue') {
        return res;
    }

    // enemy takes their turn
    applyMove(game.opponent, game.player, game.opponent.nextMove);
    // console.log(game);
    return checkWin(game);
}

function runGame(game) {
    let i = 0;
    // console.log('turn: ', i);
    let res = runTurn(game);
    if (res !== 'continue') {
        if (res === 'win') {
            game.player.currentExp += game.opponent.exp;
            while (game.player.currentExp >= game.player.maxExp) { // Level up!
                game.player.level += 1;
                game.player.hp += 50;
                game.player.atk += 1;
                game.player.def += 1;
                game.player.currentExp -= game.player.maxExp;
            }
            game.opponent = null;
        }
        return;
    }
    prepareNextTurn(game);
    i += 1;
}

function applyMove(actor, target, move) {
    actor.hp += move.heal;
    if (move.block > 0) {
        actor.block += (move.block + actor.def);
    }
    actor.atk += move.buffAtk;
    actor.def += move.buffDef;

    if (move.damage > 0) {
        let damageDealt = (move.damage + actor.atk) - (target.block);
        if (damageDealt > 0) {
            target.hp -= damageDealt > target.hp ? target.hp : damageDealt;
        }
    }
    // block is removed at the end of the turn next turn
    target.block = 0;
}

function checkWin(game) {
    if (game.player.hp <= 0) {
        return 'lose';
    }
    if (game.opponent.hp <= 0) {
        return 'win';
    }
    return 'continue';
}

function getNextOpponentMove() {
    let i = getRandomInt(0, opponentMoves.length - 1);
    return opponentMoves[i];
}

function prepareNextTurn(game) {
    game.opponent.nextMove = getNextOpponentMove();
}

function init(game) {
    prepareNextTurn(game);
}

function startBattleWith (opponent) {
    game.opponent = { ...opponent, nextMove: null, moves: opponentMoves };
    init(game);
}

Vue.component('health-bar', {
    props: ['player'],
    template: '<div><h2>You</h2><div><img v-bind:src="player.imageUrl"></div><div>Level: {{ player.level }}</div><div>HP: {{ player.hp }}</div><div>EXP: {{ player.currentExp }}/{{ player.maxExp }}</div></div>'
});

Vue.component('opponent-summary', {
    props: ['opponent'],
    template: '<button v-on:click="startBattleWith(opponent)"><ul><li>Name: {{opponent.name}} </li><li>Level: {{ opponent.level }}</li><li>HP: {{ opponent.hp }}</li><li>EXP: {{ opponent.exp }}</li><li><img v-bind:src="opponent.imageUrl"></li></ul></button>'
});

Vue.component('move-details', {
    props: ['player'],
    template: `
    <div>
        <div>Attack for: {{ player.nextMove.damage > 0 ? player.atk + player.nextMove.damage : 0 }}</div>
        <div>Block for: {{ player.nextMove.block > 0 ? player.def + player.nextMove.block : 0 }}</div>
        <div>Heal for: {{ player.nextMove.heal }}</div>
        <div>Buff defense for: {{ player.nextMove.buffDef }}</div>
        <div>Buff attack for: {{ player.nextMove.buffAtk }}</div>
    </div>
`
});

Vue.component('player-moves', {
    props: ['player'],
    template: `
        <div class='unit-window'>
            <h2>Your moves</h2>
            <div id='player-moves'>
                <button
                    v-for='move in player.moves'
                    v-on:click='function () { player.nextMove=move; }'
                >{{move.name}}</button>
            </div>
            <h2>Move details</h2>
            <move-details v-if='player.nextMove !== null' v-bind:player='player'></move-details>
            <button v-if='player.nextMove === null' v-on:click='player.warningMessage="Pick a move first you noob";'>Go</button>
            <button v-else v-on:click='player.warningMessage=""; runGame(game);'>Go</button>
            <div>{{ player.warningMessage }}</div>
        </div>
`
});

Vue.component('opponent', {
    props: ['opponent'],
    template: `
        <div class='unit-window'> 
            <h2>The guy she tells you not to worry about</h2>
            <img v-bind:src='opponent.imageUrl'>
            <div>HP: {{ opponent.hp }}</div>
            <div>Current block: {{ opponent.block }}</span></div>
            <div>Next move: {{ opponent.nextMove !== null ? opponent.nextMove.name : '' }}</div>
            <h2>Move details</h2>
            <move-details v-if='opponent.nextMove !== null' v-bind:player='opponent'></move-details>
            </div>
        </div>
`
});

var scene = new Vue({
    el: '#scene',
    data: {
        player: player,
        opponents: opponents,
        game: game
    }
});
