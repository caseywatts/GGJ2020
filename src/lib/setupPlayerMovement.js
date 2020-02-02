export default function setupMovement (scene, player, walkingSounds) {
    // Creates object for input with arrow keys
    const moveKeys = scene.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.UP,
        'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
        'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
        'right': Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    const playerSpeed = 160;
    player.body.velocity.normalize().scale(playerSpeed);

    // Enables movement of player with arrow keys
    scene.input.keyboard.on('keydown_UP', (event) => {
        player.setVelocityY(-playerSpeed);
        player.anims.play('grayPlayerWalkingUp');
        walkingSounds.play();
    });
    scene.input.keyboard.on('keydown_DOWN', (event) => {
        player.setVelocityY(playerSpeed);
        player.anims.play('grayPlayerWalkingDown');
        walkingSounds.play();
    });
    scene.input.keyboard.on('keydown_LEFT', (event) => {
        player.setVelocityX(-playerSpeed);
        player.anims.play('grayPlayerWalkingLeft');
        walkingSounds.play();
    });
    scene.input.keyboard.on('keydown_RIGHT', (event) => {
        player.setVelocityX(playerSpeed);
        player.anims.play('grayPlayerWalkingRight');
        walkingSounds.play();
    });

    const allKeysAreUp = function () { return moveKeys['up'].isUp && moveKeys['down'].isUp && moveKeys['left'].isUp && moveKeys['right'].isUp; }

    // Stops player acceleration on uppress of WASD keys
    scene.input.keyboard.on('keyup_UP', (event) => {
        if (moveKeys['down'].isUp) {
            player.setVelocityY(0);
        }
        if (allKeysAreUp()) {
            player.anims.stop(null, 1)
            walkingSounds.pause();
        }
    });
    scene.input.keyboard.on('keyup_DOWN', (event) => {
        if (moveKeys['up'].isUp) {
            player.setVelocityY(0);
        }
        if (allKeysAreUp()) {
            player.anims.stop(null, 1)
            walkingSounds.pause();
        }
    });
    scene.input.keyboard.on('keyup_LEFT', (event) => {
        if (moveKeys['right'].isUp) {
            player.setVelocityX(0);
        }
        if (allKeysAreUp()) {
            player.anims.stop(null, 1)
            walkingSounds.pause();
        }
    });
    scene.input.keyboard.on('keyup_RIGHT', (event) => {
        if (moveKeys['left'].isUp) {
            player.setVelocityX(0);
        }
        if (allKeysAreUp()) {
            player.anims.stop(null, 1)
            walkingSounds.pause();
        }
    });
}