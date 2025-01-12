# Wormhole Exodus

A thrilling space-themed 3D shooter game where you navigate through wormholes while clearing dangerous debris to save the universe.

Live demo, visit [Wormhole Exodus](https://wormhole-exodus-game.vercel.app/)

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Development Process](#development-process)

## Demo

![Game Screenshot 1](./public/images/demo1.png)
_Main Menu Screen_

![Game Screenshot 2](./public/images/demo2.png)
_Gameplay Screen_

## Features

- 🎮 Immersive 3D wormhole navigation system
- 🎯 Dynamic shooting mechanics with crosshair targeting
- 💫 Beautiful visual effects including bloom and particle systems
- 🌟 Progressive difficulty levels with scoring system
- 💾 Save game progress functionality
- 🔊 Atmospheric sound effects and background music
- ⚡ Real-time obstacle interaction
- 🏆 Star-based level completion system

## Tech Stack

- **Frontend Framework**: React.js
- **3D Graphics**: Three.js
- **State Management**: React Context API
- **Routing**: React Router
- **Styling**: CSS3 with modern animations
- **Version Control**: Git

### Key Libraries

- three.js - For 3D graphics rendering
- typewriter-effect - For text animation effects
- prop-types - For type checking

## Installation

1. Clone the repository:

```bash
git clone https://github.com/aimless-coder/wormhole_exodus_game.git
```

2. Navigate to the project directory:

```bash
cd wormhole_exodus_game
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## Development Process

### 1. Game Architecture Design

- **Component Structure**

  - Implemented a modular component architecture separating UI, game logic, and 3D rendering
  - Created reusable components like `Button`, `Preloader`, and `Planet3D` for consistent UI elements
  - Developed a flexible routing system using React Router for seamless navigation between game states

- **State Management**
  - Implemented `GameContext` using React Context API for global state management
  - Managed game states including:
    - Current level progression
    - Sound settings
    - Score tracking
    - Save/load game functionality
  - Created custom hooks like `useExitConfirmation` for better user experience

### 2. 3D Environment Setup

- **Wormhole Creation**

  - Utilized Three.js for creating the immersive wormhole tunnel effect
  - Implemented custom geometry and materials for the tunnel path
  - Added dynamic lighting and particle effects for enhanced visuals

- **Visual Effects**

  - Integrated post-processing effects using `EffectComposer`:
    - Implemented `UnrealBloomPass` for the neon glow effect
    - Added fog effects for depth perception
    - Created custom shaders for the space environment
  - Optimized rendering performance with proper scene management

- **Obstacle System**
  - Developed procedurally generated obstacles
  - Implemented obstacle pooling for better performance
  - Created dynamic collision boundaries

### 3. Game Mechanics Implementation

- **Shooting System**

  - Developed precise raycasting for shooting mechanics
  - Implemented projectile physics and collision detection
  - Created visual and audio feedback for successful hits
  - Added particle effects for projectile impacts

- **Level Progression**

  - Designed increasing difficulty curves
  - Implemented a star-based rating system (0-3 stars)
  - Created level-specific configurations including:
    - Time limits
    - Score goals
    - Obstacle patterns
    - Speed variations

- **Score System**
  - Developed real-time score tracking
  - Implemented performance-based star rewards
  - Created persistent high score storage

### 4. User Interface Development

- **Main Menu**

  - Created an atmospheric home screen with 3D planet visualization
  - Implemented smooth transitions between menu states
  - Added sound toggle and game save management

- **In-Game UI**

  - Developed heads-up display showing:
    - Current score
    - Time remaining
    - Level progress
    - Target goals
  - Implemented responsive design for various screen sizes

- **Game Flow**
  - Created narrative elements with typewriter effect
  - Implemented level completion screens
  - Added save game functionality with local storage

### 5. Audio Integration

- **Sound System**
  - Implemented multi-layer audio management:
    - Background music for different game states
    - Sound effects for shooting
    - Collision and explosion sounds
    - UI interaction sounds
  - Added volume control and mute functionality
  - Implemented audio preloading for smooth playback

### 6. Performance Optimization

- **Resource Management**

  - Implemented object pooling for projectiles and obstacles
  - Optimized 3D model geometries and textures
  - Added asset preloading system

- **Render Optimization**
  - Implemented efficient render cycles
  - Added frustum culling for off-screen objects
  - Optimized post-processing effects
  - Implemented proper cleanup of Three.js resources

### 7. Testing and Refinement

- **Performance Testing**

  - Conducted FPS monitoring and optimization
  - Tested memory usage and leak prevention
  - Optimized for various device capabilities

- **Game Balance**

  - Fine-tuned difficulty progression
  - Balanced scoring system
  - Adjusted obstacle patterns and speeds
  - Refined shooting mechanics based on playtest feedback

- **Bug Fixes and Polish**
  - Implemented comprehensive error handling
  - Added loading screens to prevent visual glitches
  - Fixed audio playback issues
  - Enhanced visual feedback for player actions

### 8. Future Development Plans

- Implement multiplayer functionality
- Add new level types and obstacles
- Create additional visual themes
- Develop power-up system
- Add leaderboard functionality
