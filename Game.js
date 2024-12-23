class Game {
    constructor(ctx, canvasSize, fps) {
        this.ctx = ctx;

        this.canvasSize = canvasSize;

        this.targetFrameTime = Math.floor(1000 / fps);

        this.gameLoop = this.gameLoop.bind(this)


        this.background
        this.collisionBlocks
        this.doors
        this.notes


        this.player = new Player({
            x: 210, y: 200,
            canvasSize: canvasSize,
            imageSrc: './img/king/idle.png',
            frameRate: 11,
            pauseGame: () => this.pauseGame(),

            animations: {
                idleRight: {
                    imageSrc: './img/king/idle.png',
                    frameRate: 11,
                    frameBuffer: 4,
                },
                idleLeft: {
                    imageSrc: './img/king/idleLeft.png',
                    frameRate: 11,
                    frameBuffer: 4,
                },
                runRight: {
                    imageSrc: './img/king/runRight.png',
                    frameRate: 8,
                    frameBuffer: 4,
                },
                runLeft: {
                    imageSrc: './img/king/runLeft.png',
                    frameRate: 8,
                    frameBuffer: 4,
                },
                enterDoor: {
                    imageSrc: './img/king/enterDoor.png',
                    frameRate: 8,
                    frameBuffer: 4,
                    loop: false,
                    onComplete: () => {
                        gsap.to(this.overlay, {
                            opacity: 1,
                            duration: 1,
                            onComplete: () => {
                                if (this.level == Object.keys(this.levels).length) {
                                    this.level = 1;
                                }
                                else {
                                    this.level++;
                                }

                                this.#initCurrentLevel();
                                gsap.to(this.overlay, {
                                    opacity: 0,
                                    duration: 1
                                })
                            }
                        })
                    }
                }
            },
            currentAnimation: 'idleRight'
        })

        this.level = 1;
        this.levels = {
            1: {
                background: new Sprite({
                    position: {
                        x: 0, y: 0
                    },
                    imageSrc: './img/backgroundLevel1.png'
                }),

                collisionBlocks: getCollisionBlocks(backgroundCollisions[1].parse2D()),

                doors: [
                    new Sprite({
                        position: {
                            x: 762, y: 270
                        },
                        imageSrc: './img/doorOpen.png',
                        frameRate: 5,
                        loop: false,
                        autoplay: false
                    })
                ],

                notes: [
                    new Note({
                        position: {
                            x: 480, y: 320
                        },
                        imageSrc: './img/note.png',
                        canvasSize: canvasSize
                    })
                ],

                playerPosition: {
                    x: 220,
                    y: 278
                }
            },
            2: {
                background: new Sprite({
                    position: {
                        x: 0, y: 0
                    },
                    imageSrc: './img/backgroundLevel2.png'
                }),

                collisionBlocks: getCollisionBlocks(backgroundCollisions[2].parse2D()),

                doors: [
                    new Sprite({
                        position: {
                            x: 772, y: 333
                        },
                        imageSrc: './img/doorOpen.png',
                        frameRate: 5,
                        loop: false,
                        autoplay: false
                    })
                ],

                notes: [],

                playerPosition: {
                    x: 120,
                    y: 83
                }
            },
            3: {
                background: new Sprite({
                    position: {
                        x: 0, y: 0
                    },
                    imageSrc: './img/backgroundLevel3.png'
                }),

                collisionBlocks: getCollisionBlocks(backgroundCollisions[3].parse2D()),

                doors: [
                    new Sprite({
                        position: {
                            x: 175, y: 334
                        },
                        imageSrc: './img/doorOpen.png',
                        frameRate: 5,
                        loop: false,
                        autoplay: false
                    })
                ],

                notes: [],

                playerPosition: {
                    x: 750,
                    y: 138
                }
            }
        }

        this.#initCurrentLevel();


        this.overlay = {
            position: { x: 0, y: 0 },
            width: canvasSize.width,
            height: canvasSize.height,
            opacity: 0
        }

        this.paused = false;
    }

    #initCurrentLevel() {
        const currentLevel = this.levels[this.level];
        this.background = currentLevel.background

        this.collisionBlocks = currentLevel.collisionBlocks
        this.player.collisionBlocks = this.collisionBlocks

        this.doors = currentLevel.doors;
        this.doors = this.doors.map(door => {
            door.currentFrame = 0;
            door.autoplay = false;
            return door;
        })

        this.notes = currentLevel.notes;

        this.player.doors = this.doors;
        this.player.notes = this.notes;

        this.player.switchSprite('idleRight')
        this.player.position.x = currentLevel.playerPosition.x;
        this.player.position.y = currentLevel.playerPosition.y;
        this.player.preventInput = false;
    }

    start() {
        console.log('Started');
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(timestamp) {
        requestAnimationFrame(this.gameLoop);
        if ((timestamp - this.lastPaintTime) < this.targetFrameTime) {
            return;
        }


        this.lastPaintTime = timestamp;

        this.gameEngine();
    }

    #drawOverlay(ctx) {
        ctx.save();
        ctx.globalAlpha = this.overlay.opacity;
        ctx.fillStyle = 'black';
        ctx.fillRect(
            this.overlay.position.x, this.overlay.position.y, this.overlay.width, this.overlay.height
        )
        ctx.restore();
    }

    pauseGame() {
        this.paused = true;
    }

    gameEngine() {
        // update
        this.background.draw(this.ctx)

        this.player.update();

        // draw
        this.doors.forEach(door => {
            door.draw(this.ctx)
        })
        this.notes.forEach(note => {
            note.draw(this.ctx)
            note.drawInteractionHint(this.ctx)
        })
        this.player.draw(this.ctx);

        this.notes.forEach(note => {
            note.drawNoteScreen(this.ctx)
        })
        // this.collisionBlocks.forEach(block => {
        //     block.draw(this.ctx)
        // })


        this.#drawOverlay(this.ctx);
    }

}