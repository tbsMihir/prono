# 3D Ping Pong Game 🏓

A fully-functional 3D ping pong game built with **Three.js** featuring:
- Real-time 3D graphics with advanced lighting
- Physics-based ball movement and collision detection
- Intelligent AI opponent with 3 difficulty levels
- Score tracking and win conditions
- Smooth, responsive controls

## 🎮 Features

✅ **3D Graphics Engine**
- Built with Three.js and WebGL
- Realistic lighting and shadows
- Smooth 60 FPS rendering
- Camera tracking and dynamic perspective

✅ **Physics System**
- Vector3D mathematics for accurate movement
- Gravity simulation
- Collision detection (ball-paddle, ball-walls)
- Realistic ball bouncing and velocity changes
- Speed scaling on paddle hits

✅ **AI Opponent**
- Predictive algorithm for ball trajectory
- 3 difficulty levels (Easy, Medium, Hard)
- Adaptive behavior based on difficulty
- Intelligent paddle positioning

✅ **Game Mechanics**
- Score tracking (first to 5 wins)
- Real-time ball speed display
- Game pause/resume functionality
- Reset capability
- Difficulty cycling mid-game

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/tbsMihir/prono.git
cd prono

# Option 1: Open directly in browser
open index.html

# Option 2: Run a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- WebGL support
- No dependencies to install (uses CDN for Three.js)

## 🎯 How to Play

### Objective
Be the first to score 5 points by preventing the ball from going past your paddle.

### Controls

| Key | Action |
|-----|--------|
| **↑** / **W** | Move paddle up |
| **↓** / **S** | Move paddle down |
| **SPACE** | Pause / Resume game |
| **D** | Cycle AI difficulty |
| **R** | Reset game |

### Game Rules

1. **Scoring**: Miss the ball → Opponent gets 1 point
2. **Ball Speed**: Increases with each paddle hit
3. **Paddle Movement**: Smooth movement with boundary constraints
4. **Win Condition**: First to 5 points wins
5. **Difficulty Modes**:
   - **Easy**: Slower AI, more prediction errors, longer reaction time
   - **Medium**: Balanced gameplay, standard AI behavior
   - **Hard**: Faster AI, accurate predictions, instant reactions

## 📁 Project Structure

```
prono/
├── index.html          # Main HTML file with UI
├── js/
│   ├── game.js         # Main game engine and Three.js setup
│   ├── physics.js      # Physics engine and utilities
│   └── ai.js           # AI opponent logic
├── package.json        # Project metadata
└── README.md          # This file
```

## 💻 Technical Details

### Game Engine (game.js)
- Three.js scene management and rendering
- Game loop with physics updates
- Paddle movement and user input handling
- Score tracking and game state management
- UI updates and game over conditions

### Physics Engine (physics.js)
- **Vector3D Class**: 3D vector mathematics (add, subtract, multiply, dot, cross)
- **Ball Class**: Ball object with velocity, acceleration, and gravity
- **Paddle Class**: Paddle object with movement constraints
- **Collision Detection**: Sphere-AABB collision checking
- **Gravity**: Realistic downward acceleration

### AI System (ai.js)
- **Trajectory Prediction**: Calculates where ball will be at paddle
- **Wall Bounce Simulation**: Accounts for wall bounces in prediction
- **Difficulty Scaling**: Adjusts speed, accuracy, and reaction time
- **Adaptive Behavior**: Different strategies for each difficulty level

### Rendering
- **Ambient & Directional Lighting**: Realistic scene illumination
- **Shadow Mapping**: Objects cast realistic shadows
- **Material Properties**: Metallic paddles, emissive surfaces
- **Anti-aliasing**: Smooth edges at any resolution

## 🎨 Customization

### Adjust Game Parameters

Edit constants in `js/game.js`:
```javascript
const WINNING_SCORE = 5;        // Points to win
const GAME_WIDTH = 40;          // Table width
const GAME_HEIGHT = 30;         // Table depth
const PADDLE_HEIGHT = 6;        // Paddle size
const BALL_SIZE = 0.4;          // Ball radius
```

### Modify AI Difficulty

Edit difficulty modifiers in `js/ai.js`:
```javascript
const difficultyModifiers = {
    'easy': {
        speedMultiplier: 0.6,
        predictionAccuracy: 0.7,
        reactionTimeMultiplier: 2.0
    },
    // ... more levels
};
```

### Change Colors and Materials

Modify Three.js materials in `js/game.js`:
```javascript
const paddleMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,        // RGB hex color
    metalness: 0.6,
    roughness: 0.4
});
```

## 📊 Performance

- **FPS**: Maintains 60 FPS on modern devices
- **Memory**: Minimal footprint (~5MB with Three.js)
- **Optimization**: Efficient collision detection and physics calculations
- **Responsive**: Automatic aspect ratio adjustment

## 🐛 Known Limitations

- Single player mode only (AI opponent)
- No sound effects
- No mobile touch controls
- Physics simplified for game balance

## 🔄 Future Enhancements

- [ ] Multiplayer (local or online)
- [ ] Sound effects and music
- [ ] Mobile/touch controls
- [ ] Power-ups and special effects
- [ ] Leaderboard system
- [ ] Different game modes
- [ ] Advanced AI learning
- [ ] Customizable paddle/ball skins

## 📝 License

MIT License - Feel free to use, modify, and distribute

## 👨‍💻 Author

**tbsMihir** - Created this 3D ping pong game

## 🎓 Technical Stack

- **Three.js** - 3D Graphics Library
- **WebGL** - Graphics API
- **JavaScript ES6+** - Game Logic
- **HTML5/CSS3** - UI and Styling

## 📞 Support

If you encounter any issues:
1. Make sure your browser supports WebGL
2. Clear your browser cache
3. Try a different browser
4. Check the browser console for error messages

---

**Enjoy the game! 🏓** Feel free to fork, modify, and share your improvements.
