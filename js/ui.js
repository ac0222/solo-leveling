
Vue.component('health-bar', {
    props: ['player'],
    template: `
    <div>
        <h2>You</h2>
        <div>
            <img v-bind:src="player.imageUrl">
        </div>
        <div v-if="player.canLevelUp">Level: {{ player.level }}</div>
        <div>HP: {{ player.hp }}</div>
        <div v-if="player.canLevelUp">EXP: {{ player.currentExp }}/{{ player.maxExp }}</div>
    </div>
    `
});

Vue.component('opponent-summary', {
    props: [
        'opponent',
        'gameController'
    ],
    template: `
    <button v-on:click="gameController.startBattleWith(opponent)">
        <ul>
            <li>Name: {{opponent.name}} </li>
            <li>Level: {{ opponent.level }}</li>
            <li>HP: {{ opponent.hp }}</li>
            <li>EXP: {{ opponent.exp }}</li>
            <li><img v-bind:src="opponent.imageUrl"></li>
        </ul>
    </button>
    `
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
    props: [
        'player',
        'gameController'
    ],
    template: `
        <div class='unit-window'>
            <h2>Your moves</h2>
            <div id='player-moves'>
                <button
                    v-for='move in player.moves'
                    v-on:click='gameController.selectPlayerMove(move)'
                >{{move.name}}</button>
            </div>
            <h2>Move details</h2>
            <move-details v-if='player.nextMove !== null' v-bind:player='player'></move-details>
            <button v-on:click='gameController.progressBattle()'>Go</button>
            <div>{{ gameController.warningMessage }}</div>
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

Vue.component('solo-leveling', {
    props: [
        'game',
        'gameController'
    ],
    template: `
    <div>
        <h1>SOLO LEVELING</h1>
        <dungeon
            v-bind:dungeon='game.dungeon'
            v-bind:gameController='gameController'
        >
        </dungeon>
    </div>
    `
});


Vue.component('modal', {
    template: `
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">

                <div class="modal-header">
                <slot name="header">
                    default header
                </slot>
                </div>

                <div class="modal-body">
                <slot name="body">
                    default body
                </slot>
                </div>

                <div class="modal-footer">
                <slot name="footer">
                    default footer
                </slot>
                </div>

            </div>
        </div>
    </div>
    `
});

Vue.component('game-over', {
    props: [
        'gameController'
    ],
    template: `
    <modal v-if='gameController.showGameOverModal'>
        <h3 slot="header">Game Over</h3>
        <p slot="body">Game over, you dead!</p>
        <div slot='footer'>
            <button v-on:click='gameController.respawn()'>Respawn</button>
        </footer>
    </modal>
    `
});

Vue.component('become-player', {
    props: [
        'gameController'
    ],
    template: `
    <modal v-if='gameController.showBecomePlayerModal'>
        <h3 slot="header">WARNING!</h3>
        <p slot="body">You're about to die! Do you want to become a player?</p>
        <div slot="footer">
            <button v-on:click='gameController.acceptTransform()'>Yes</button>
            <button v-on:click='gameController.rejectTransform()'>No</button>
        </div>
    </modal>
    `
});

Vue.component('dungeon', {
    props: [
        'dungeon',
        'gameController'
    ],
    template: `
    <div>
        <div v-if='!dungeon.isBattleInProgress()'>
            <div class='dungeon-window'>
                <health-bar v-bind:player='dungeon.player'></health-bar>
                <battle-select 
                    v-bind:monsters='dungeon.monsters'
                    v-bind:gameController='gameController'
                >
                </battle-select>
            </div>
        </div>
        <div v-else>
            <battle
                v-bind:battle='dungeon.currentBattle'
                v-bind:gameController='gameController'
            >
            </battle>
        </div>
    </div>
    `
});

Vue.component('battle-select', {
    props: [
        'monsters',
        'gameController'
    ],
    template: `
    <div>
        <p>Select opponent:</p>
        <opponent-summary 
            v-for='opponent in monsters' 
            v-bind:opponent='opponent'
            v-bind:gameController='gameController'
        >
        </opponent-summary>
    </div>
    `
});

Vue.component('battle', {
    props: [
        'battle',
        'gameController',
    ],
    template: `
    <div class='battle-window'>
        <game-over v-bind:gameController='gameController'></game-over>
        <become-player v-bind:gameController='gameController'></become-player>
        <div>
            <health-bar v-bind:player='battle.player'></health-bar>
            <player-moves
                v-bind:player='battle.player'
                v-bind:gameController='gameController'
            ></player-moves>
        </div>
        <div>
            <opponent v-bind:opponent='battle.monster'></opponent>
        </div>
    </div>
    `
});



