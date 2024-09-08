


function deg2rad(deg: number) {
    return deg * Math.PI / 180;
}

class Ball {
    x: number;
    y: number;
    radius: number = 10;
    direction: [number, number] = [Math.cos(deg2rad(-30)), Math.sin(deg2rad(-30))];
    velocity: number = 5;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

enum Moving {
    UP = "UP",
    DOWN = "DOWN",
    STANDSTILL = "STANDSTILL"
}

enum Field {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

class Paddle {
    static width: number = 10;
    static height: number = 50;

    x: number;
    y: number;
    field: Field;
    direction: Moving = Moving.STANDSTILL;
    velocity: number = 7;

    constructor(x: number, y: number, field: Field) {
        this.x = x;
        this.y = y;
        this.field = field;
    }

    paddleLine(): number {
        let paddle_face_offset = Paddle.width / 2;
        if (this.field === Field.LEFT) {
            return this.x + paddle_face_offset;
        } else {
            return this.x - paddle_face_offset;
        }
    }

    paddleYBounds(): [number, number] {
        let half_paddle_height = Paddle.height / 2;
        return [this.y - half_paddle_height, this.y + half_paddle_height];
    }

    // face(): [[number, number], [number, number]] {
    //     let x_offset = Paddle.width / 2;
    //     let y_offset = Paddle.height / 2;

    //     let x = this.x - x_offset;
    //     if (this.field === Field.LEFT) {
    //         let x = this.x + x_offset;
    //     }

    //     return [
    //         [x, this.y + y_offset],
    //         [x, this.y - y_offset]
    //     ]
    // }
}

function lineSegmentIntersection(p1: [number, number], p2: [number, number], p3: [number, number], p4: [number, number]) {
    function t(p1: [number, number], p2: [number, number], p3: [number, number], p4: [number, number]): number {
        let numerator = ((p1[0] - p3[0]) * (p3[1] - p4[1])) - ((p1[1] - p3[1]) * (p3[0] - p4[0]))
        let denominator = ((p1[0] - p2[0]) * (p3[1] - p4[1])) - ((p1[1] - p2[1]) * (p3[0] - p4[0]))
        return numerator / denominator
    }
    function u(p1: [number, number], p2: [number, number], p3: [number, number], p4: [number, number]): number {
        let numerator = ((p1[0] - p2[0]) * (p1[1] - p3[1])) - ((p1[1] - p2[1]) * (p1[0] - p3[0]))
        let denominator = ((p1[0] - p2[0]) * (p3[1] - p4[1])) - ((p1[1] - p2[1]) * (p3[0] - p4[0]))
        return -(numerator / denominator)
    }

    let tval = t(p1, p2, p3, p4);
    if (!(0 <= tval && tval <= 1)) {
        console.log("Not intersecting")
    }
    let uval = u(p1, p2, p3, p4);
    if (!(0 <= uval && uval <= 1)) {
        console.log("Not intersecting")
    }

    let [x1, y1] = [p1[0] + tval * (p2[0] - p1[0]), p1[1] + tval * (p2[1] - p1[1])]
    let [x2, y2] = [p3[0] + uval * (p4[0] - p3[0]), p3[1] + uval * (p4[1] - p3[1])]

    if (x1 !== x2) {
        console.log(`weird`)
    }
    if (y1 !== y2) {
        console.log(`weird`)
    }

    return [x1, y1]

}

// This was an overkill implementation.
// if (this.ball.x + this.ball.radius > p2face[0][0]) {
//     prevBallXY[0] += this.ball.radius;
//     newBallXY[0] += this.ball.radius;
//     console.log("passed paddle 2")
//     let [x, y] = lineSegmentIntersection(
//         prevBallXY,
//         newBallXY,
//         p2face[0],
//         p2face[1],
//     )
//     console.log(`x: ${x}, y: ${y}`)
// }

enum WhoScored {
    PLAYER1 = "PLAYER 1",
    PLAYER2 = "PLAYER 2",
    NONE = "NONE"
}

class Pong {
    ctx: CanvasRenderingContext2D;
    height: number;
    width: number;
    ball: Ball;
    p1paddle: Paddle;
    p2paddle: Paddle;
    noLose: boolean;

    constructor(canvas: HTMLCanvasElement, noLose: boolean = false) {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.height = canvas.height;
        this.width = canvas.width;
        this.ball = new Ball(this.width / 2, this.height / 2);
        this.p1paddle = new Paddle(10, this.height / 2, Field.LEFT);
        this.p2paddle = new Paddle(this.width - 10, this.height / 2, Field.RIGHT);
        this.noLose = noLose;
        document.addEventListener("keydown", (event) => {

            switch (event.code) {
                case "KeyA":
                    this.p1paddle.direction = Moving.UP;
                    break;
                case "KeyZ":
                    this.p1paddle.direction = Moving.DOWN;
                    break;
                case "KeyK":
                    this.p2paddle.direction = Moving.UP;
                    break;
                case "KeyM":
                    this.p2paddle.direction = Moving.DOWN;
                    break;
                default:
                    break;
            }
            //console.log(`Pressed ${event.code} P1: ${this.p1paddle.direction}, P2: ${this.p2paddle.direction}`);
        });

        document.addEventListener("keyup", (event) => {
            switch (event.code) {
                case "KeyA":
                    if (this.p1paddle.direction === Moving.UP) {
                        this.p1paddle.direction = Moving.STANDSTILL;
                    }
                    break;
                case "KeyZ":
                    if (this.p1paddle.direction === Moving.DOWN) {
                        this.p1paddle.direction = Moving.STANDSTILL;
                    }
                    break;
                case "KeyK":
                    if (this.p2paddle.direction === Moving.UP) {
                        this.p2paddle.direction = Moving.STANDSTILL;
                    }
                    break;
                case "KeyM":
                    if (this.p2paddle.direction === Moving.DOWN) {
                        this.p2paddle.direction = Moving.STANDSTILL;
                    }
                    break;
                default:
                    break;
            }
        });
    }

    drawNet() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.moveTo(this.width / 2, 5);
        this.ctx.lineTo(this.width / 2, this.height - 5);
        this.ctx.stroke();
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#ff5400";
        this.ctx.fill();
    }

    draw() {
        // Draw the net
        this.drawNet()
        // Draw the ball
        this.drawBall();
        // Draw the paddles
        this.ctx.fillStyle = "#ffbd00";
        this.ctx.fillRect(this.p1paddle.x - (Paddle.width / 2), this.p1paddle.y - (Paddle.height / 2), Paddle.width, Paddle.height);
        this.ctx.fillStyle = "#ff0054";
        this.ctx.fillRect(this.p2paddle.x - (Paddle.width / 2), this.p2paddle.y - (Paddle.height / 2), Paddle.width, Paddle.height);

    }

    private movePaddle(paddle: Paddle) {
        if (paddle.direction === Moving.UP) {
            paddle.y -= paddle.velocity;
            if (paddle.y - (Paddle.height / 2) < 0) {
                paddle.y = Paddle.height / 2;
            }
        } else if (paddle.direction === Moving.DOWN) {
            paddle.y += paddle.velocity;
            if (paddle.y + (Paddle.height / 2) > this.height) {
                paddle.y = this.height - (Paddle.height / 2);
            }
        }
    }

    private moveBall(): WhoScored {
        let prevBallX = this.ball.x;

        this.ball.x += this.ball.velocity * this.ball.direction[0];
        this.ball.y += this.ball.velocity * this.ball.direction[1];

        let newBallX = this.ball.x;

        if (this.ball.direction[0] > 0) {

            // Did it pass the paddle line?
            let prevBallXEdge = prevBallX + this.ball.radius;
            let newBallXEdge = newBallX + this.ball.radius;

            let p2PaddleLine = this.p2paddle.paddleLine()
            if (prevBallXEdge < p2PaddleLine && newBallXEdge > p2PaddleLine) {
                // Is the ball within the paddle bounds?
                let [ytop, ybottom] = this.p2paddle.paddleYBounds();
                if (this.ball.y > ytop && this.ball.y < ybottom) {
                    // We did hit the paddle.
                    // How much did the step overshoot?
                    let overshoot = newBallXEdge - p2PaddleLine;
                    this.ball.x -= overshoot;
                    // The ball should go in the other direction now.
                    this.ball.direction[0] = -this.ball.direction[0];
                }
            }

            else if (this.ball.x + this.ball.radius > this.width) {
                if (this.noLose) {
                    this.ball.x = this.width - this.ball.radius;
                    this.ball.direction[0] = -this.ball.direction[0];
                } else {
                    console.log("Player 1 scores!");
                    return WhoScored.PLAYER1;
                }
            }
        } else {
            // Did it pass the paddle line?
            let prevBallXEdge = prevBallX - this.ball.radius;
            let newBallXEdge = newBallX - this.ball.radius;
            let p1PaddleLine = this.p1paddle.paddleLine();
            if (prevBallXEdge > p1PaddleLine && newBallXEdge < p1PaddleLine) {
                // Is the ball within the paddle bounds?
                let [ytop, ybottom] = this.p1paddle.paddleYBounds();
                if (this.ball.y > ytop && this.ball.y < ybottom) {
                    // We did hit the paddle.
                    // How much did the step overshoot?
                    let overshoot = p1PaddleLine - newBallXEdge;
                    this.ball.x += overshoot;
                    // The ball should go in the other direction now.
                    this.ball.direction[0] = -this.ball.direction[0];
                }
            }

            if (this.ball.x - this.ball.radius < 0) {
                if (this.noLose) {
                    this.ball.x = this.ball.radius;
                    this.ball.direction[0] = -this.ball.direction[0];
                } else {
                    console.log("Player 2 scores!")
                    return WhoScored.PLAYER2;
                }
            }
        }

        if (this.ball.y - this.ball.radius < 0) {
            this.ball.y = this.ball.radius;
            this.ball.direction[1] = -this.ball.direction[1];
        } else if (this.ball.y + this.ball.radius > this.height) {
            this.ball.y = this.height - this.ball.radius;
            this.ball.direction[1] = -this.ball.direction[1];
        }

        return WhoScored.NONE;
    }


    tick(): WhoScored {
        // This a naive implementation where we move the paddles first
        // and then move the ball. In theory the ball could move passed the
        // paddles before the paddle got to the position.
        this.movePaddle(this.p1paddle);
        this.movePaddle(this.p2paddle);
        return this.moveBall();

    }
}

class Player {
    score: number = 0
}

enum States {
    START = "START",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    ROUND_OVER = "ROUND_OVER",
    GAMEOVER = "GAMEOVER"
}

class GameManager {
    canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player1 = new Player();
    player2 = new Player();
    round: number = 0;
    pong: Pong;
    state: States = States.START;

    constructor() {
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.pong = new Pong(this.canvas);
        this.pong.draw();

        document.addEventListener("keydown", this.keyboardInput.bind(this));
        this.drawScore();

    }

    keyboardInput(event: KeyboardEvent) {

        if (this.state === States.PAUSED) {
            if (event.code === "KeyP") {
                this.state = States.PLAYING;
                this.gameLoop();
            }

            return;
        }

        if (this.state === States.PLAYING) {
            if (event.code === "KeyP") {
                this.state = States.PAUSED;
                return;
            }
            return;
        }

        if (this.state === States.ROUND_OVER || this.state === States.START) {
            if (event.code === "Space") {
                this.state = States.PLAYING;
                console.log("Starting game");
                this.countDown();
            }
            return;
        }
    }

    drawScore() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${this.player1.score} ${this.player2.score}`, this.pong.width / 2, 30);
    }

    countDown() {
        let count = 3;

        let countDownInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.pong.width, this.pong.height);
            this.pong.draw();
            this.drawScore();
            this.ctx.font = "60px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "center";
            this.ctx.fillText(`${count}`, this.pong.width / 2, this.pong.height / 3);
            count -= 1;
            if (count < 0) {
                clearInterval(countDownInterval);
                this.gameLoop();
            }
        }, 1000);
    }

    roundOver(whoScored: WhoScored) {
        if (whoScored === WhoScored.PLAYER1) {
            this.player1.score += 1;
        } else {
            this.player2.score += 1;
        }
        this.ctx.clearRect(0, 0, this.pong.width, this.pong.height);
        this.pong.draw();
        this.drawScore();
        this.round += 1;

        this.ctx.font = "40px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${whoScored} SCORED!`, this.pong.width / 2, this.pong.height / 3);

        this.pong = new Pong(this.canvas);
    }



    gameLoop() {
        let whoScored: WhoScored = this.pong.tick();
        this.ctx.clearRect(0, 0, this.pong.width, this.pong.height);
        this.pong.draw();
        this.drawScore();
        if (whoScored !== WhoScored.NONE) {
            this.state = States.ROUND_OVER;
            this.roundOver(whoScored);
        }
        if (this.state === States.PLAYING) {
            requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }
    }

}

let game = new GameManager();


