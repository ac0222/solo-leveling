let player = {
    level: 0,
    currentExp: 0,
    maxExp: 10,
    currentHp: 50,
    maxHp: 50,
    atk: 5,
    def: 5,
    block: 0,
    imageUrl: 'assets/sungjinwoo.png'
};

let goblin = {
    name: 'Goblin person',
    level: 1,
    exp: 10, // Exp gained if killed by player
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

let currentOpponent = { current: null };

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
    opponent: null,
    nextPlayerMove: -1,
    nextAntMove: 0
};

let activityLog = ''

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runTurn(game) {
    // player takes their turn
    applyMove(game.player, game.ant, playerMoves[game.nextPlayerMove]);
    console.log(game)
    let res = checkWin(game);
    if (res !== 'continue') {
        return res;
    }

    // enemy takes their turn
    applyMove(game.ant, game.player, antMoves[game.nextAntMove]);
    console.log(game)
    return checkWin(game);
}

function runGame(game) {
    let i = 0;
    console.log('turn: ', i);
    let res = runTurn(game);
    prepareNextTurn(game);
    i += 1;
}

function applyMove(actor, target, move) {
    actor.hitpoints += move.heal;
    if (move.block > 0) {
        actor.block += (move.block + actor.def);
    }
    actor.atk += move.buffAtk;
    actor.def += move.buffDef;

    if (move.damage > 0) {
        let damageDealt = (move.damage + actor.atk) - (target.block);
        if (damageDealt > 0) {
            target.hitpoints -= damageDealt;
        }
    }
    // block is removed at the end of the turn next turn
    target.block = 0;
}

function checkWin(game) {
    if (game.player.hitpoints <= 0) {
        return 'lose';
    }
    if (game.ant.hitpoints <= 0) {
        return 'win';
    }
    return 'continue';
}

function updatePlayerMoveDetails(game) {
    document.createElement();
}

function createMoveDetails(actor, move) {
    let moveDetails = document.createElement('div');
    let attackFor = move.damage > 0 ? actor.atk + move.damage : 0;
    let blockFor = move.block > 0 ? actor.def + move.block : 0;
    moveDetails.appendChild(document.createElement('div')).textContent = 'Attack for: ' + attackFor;
    moveDetails.appendChild(document.createElement('div')).textContent = 'Block for: ' + blockFor;
    moveDetails.appendChild(document.createElement('div')).textContent = 'heal for: ' +  move.heal;
    moveDetails.appendChild(document.createElement('div')).textContent = 'Buff defense by: ' + move.buffDef;
    moveDetails.appendChild(document.createElement('div')).textContent = 'Buff attack by: ' + move.buffAtk;
    return moveDetails;
}

function updateUI(game) {
    document.getElementById('player-hp').textContent = game.player.hitpoints;
    document.getElementById('ant-hp').textContent = game.ant.hitpoints;
    document.getElementById('ant-current-block').textContent = game.ant.block;
    document.getElementById('next-ant-move').textContent = antMoves[game.nextAntMove].name;
    document.getElementById('ant-move-details').innerHTML = '';
    document.getElementById('ant-move-details').appendChild(createMoveDetails(game.ant, antMoves[game.nextAntMove]));
}

function getNextOpponentMove() {
    let i = getRandomInt(0, opponentMoves.length - 1);
    return opponentMoves[i];
}

function prepareNextTurn(game) {
    game.opponent.nextMove = getNextOpponentMove();
    updateUI(game);
}

function init(game) {
    
    let i = 0;
    for (move of playerMoves) {
        let moveButton = document.createElement('button');
        moveButton.addEventListener('click', function(e) {
            console.log(e.target.getAttribute('index'));
            game.nextPlayerMove = e.target.getAttribute('index');
            document.getElementById('player-move-details').innerHTML = '';
            document.getElementById('player-move-details').appendChild(createMoveDetails(game.player, playerMoves[game.nextPlayerMove]));
        });
        moveButton.textContent = move.name;
        moveButton.setAttribute('index', i);
        document.getElementById('player-moves').appendChild(moveButton);
        i += 1;
    }

    document.getElementById('end-turn').addEventListener('click', function() {
        if (game.nextPlayerMove === -1) {
            document.getElementById('warning-message').textContent = 'Pick a move first you noob';
        } else {
            document.getElementById('warning-message').textContent = '';
            runGame(game);
        }
    });
    prepareNextTurn(game);
}

function startBattleWith (opponent) {
    currentOpponent.current = { ...opponent, nextMove: getNextOpponentMove(), moves: opponentMoves };
}

Vue.component('health-bar', {
    props: ['player'],
    template: '<ul><li>You</li><li>Level: {{ player.level }}</li><li>HP: {{ player.currentHp }}/{{ player.maxHp }}</li><li>EXP: {{ player.currentExp }}/{{ player.maxExp }}</li><li><img v-bind:src="player.imageUrl"></li></ul>'
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
            <button id='end-turn'>Go</button>
            <div id='warning-message'></div>
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
            <div>Next move: {{ opponent.nextMove.name }}</div>
            <h2>Move details</h2>
            <move-details v-if='opponent.nextMove !== null' v-bind:player='opponent'></move-details>
            </div>
        </div>
`
});

var scene = new Vue({
    el: '#scene',
    data: {
        player: { ...player, nextMove: null,  moves: playerMoves },
        opponent: currentOpponent,
        opponents: opponents,
        game: game
    }
});
