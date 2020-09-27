function initGame() {
    // game logic and controllers
    let game = new SoloLevelingGame();
    let gameController = new GameController(game);
    // init the UI
    return new Vue({
        el: '#game-window',
        data: {
            game: game,
            gameController: gameController,
        }
    });
}
    
initGame();