let player = {
    hitpoints: 50,
    atk: 5,
    def: 5,
    block: 0
};

let ant = {
    hitpoints: 50,
    atk: 5,
    def: 5,
    block: 0
};

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

let antMoves = [
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
    ant: ant,
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

function prepareNextTurn(game) {
    let antMove = getRandomInt(0, antMoves.length - 1);
    game.nextAntMove = antMove;
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

init(game);
