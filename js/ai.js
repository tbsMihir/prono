// AI Opponent Logic

class AI {
    constructor(paddle, ball) {
        this.paddle = paddle;
        this.ball = ball;
        this.difficulty = 'medium'; // easy, medium, hard
        this.predictedBallZ = 0;
        this.reactionTime = 0;
        this.reactionTimeMax = 10;
    }

    update() {
        this.reactionTime--;

        // Only update prediction every few frames to add AI personality
        if (this.reactionTime <= 0) {
            this.predictBallTrajectory();
            this.reactionTime = this.reactionTimeMax;
        }

        this.moveTowardsBall();
        this.applyDifficultyModifier();
    }

    predictBallTrajectory() {
        // Predict where the ball will be when it reaches the AI paddle
        const distanceToAI = Math.abs(this.ball.position.x - this.paddle.position.x);
        
        if (this.ball.velocity.x < 0) { // Ball moving toward AI
            const timeToReach = distanceToAI / Math.abs(this.ball.velocity.x);
            
            // Estimate ball Z position at collision
            this.predictedBallZ = this.ball.position.z + (this.ball.velocity.z * timeToReach);
            
            // Account for wall bounces
            const GAME_HEIGHT = 30;
            while (Math.abs(this.predictedBallZ) > GAME_HEIGHT / 2) {
                if (this.predictedBallZ > GAME_HEIGHT / 2) {
                    this.predictedBallZ = GAME_HEIGHT - this.predictedBallZ;
                } else {
                    this.predictedBallZ = -GAME_HEIGHT + this.predictedBallZ;
                }
            }
        } else {
            this.predictedBallZ = this.ball.position.z;
        }
    }

    moveTowardsBall() {
        const targetZ = this.predictedBallZ;
        const distance = Math.abs(targetZ - this.paddle.position.z);
        const paddleSpeed = this.paddle.userData.speed;

        // Move toward predicted position
        if (Math.abs(targetZ - this.paddle.position.z) > 0.1) {
            const direction = Math.sign(targetZ - this.paddle.position.z);
            this.paddle.position.z += direction * paddleSpeed;
        }

        // Constrain paddle to boundaries
        const GAME_HEIGHT = 30;
        const PADDLE_DEPTH = 0.5;
        this.paddle.position.z = Math.max(-GAME_HEIGHT / 2 + PADDLE_DEPTH,
                                          Math.min(GAME_HEIGHT / 2 - PADDLE_DEPTH, this.paddle.position.z));
    }

    applyDifficultyModifier() {
        const difficultyModifiers = {
            'easy': {
                speedMultiplier: 0.6,
                predictionAccuracy: 0.7,
                reactionTimeMultiplier: 2.0
            },
            'medium': {
                speedMultiplier: 1.0,
                predictionAccuracy: 0.9,
                reactionTimeMultiplier: 1.0
            },
            'hard': {
                speedMultiplier: 1.4,
                predictionAccuracy: 1.0,
                reactionTimeMultiplier: 0.5
            }
        };

        const modifier = difficultyModifiers[this.difficulty] || difficultyModifiers['medium'];
        
        // Apply speed modifier
        this.paddle.userData.speed = 0.35 * modifier.speedMultiplier;
        
        // Apply reaction time
        this.reactionTimeMax = 10 * modifier.reactionTimeMultiplier;

        // Add prediction noise based on difficulty
        if (Math.random() > modifier.predictionAccuracy) {
            this.predictedBallZ += (Math.random() - 0.5) * 2;
        }
    }

    cycleDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        this.difficulty = difficulties[(currentIndex + 1) % difficulties.length];
        console.log('AI Difficulty:', this.difficulty.toUpperCase());
    }

    setDifficulty(level) {
        if (['easy', 'medium', 'hard'].includes(level)) {
            this.difficulty = level;
        }
    }
}
