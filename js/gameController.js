class GameController {
    constructor(game) {
        this.game = game;
        this.warningMessage = '';
        this.showGameOverModal = false;
        this.showBecomePlayerModal = false;
        this.init();
    }

    // dungeon commands
    selectCell(cell) {
        // deselect old cell
        if (this.game.dungeon.selectedCell) {
            this.game.dungeon.selectedCell.isSelected = false;;
        }
        // select the new cell
        this.game.dungeon.selectedCell = cell;
        this.game.dungeon.selectedCell.isSelected = true;

    }

    movePlayerToCell(cell) {
        this.game.dungeon.movePlayerToCell(cell);
    }

    rest() {
        this.game.player.rest();
    }

    canMovePlayerToCell(cell) {
        return this.game.dungeon.canMovePlayerToCell(cell);
    }

    // battle commands
    selectPlayerMove(moveKey) {
        this.game.dungeon.currentBattle.player.setNextMove(moveKey);
        this.warningMessage = '';
    }

    progressBattle() {
        if (this.game.dungeon.currentBattle.player.nextMove === null) {
            this.warningMessage = 'Pick a move first you noob';
        } else {
            this.game.dungeon.currentBattle.progressBattle();
        }

        if (this.game.dungeon.currentBattle.isPlayerTransformationPossible()) {
            this.showBecomePlayerModal = true;
        } else {
            this.showGameOverModal = this.game.player.hp === 0;
        };
    }

    acceptTransform() {
        this.game.player.becomePlayer();
        this.game.dungeon.currentBattle.status = 'resolved';
        this.movePlayerToCell(this.game.dungeon.cells[0][0]);
        this.showBecomePlayerModal = false;
    }

    rejectTransform() {
        this.showBecomePlayerModal = false;
        this.showGameOverModal = true;
    }


    // general
    respawn() {
        this.game.initGame();
        this.init();
    }

    init() {
        this.warningMessage = '';
        this.showGameOverModal = false;
        this.showBecomePlayerModal = false;
    }
}