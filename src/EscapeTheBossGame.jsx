import React, { useState, useEffect, useCallback, useRef } from 'react';

const EscapeTheBossStory = () => {
  const audioContextRef = useRef(null);
  
  // Story & UI States
  const [gameState, setGameState] = useState('intro');
  const [storyPhase, setStoryPhase] = useState(0);
  const [bossName, setBossName] = useState('Mr. Boss');
  const [tempBossName, setTempBossName] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [difficulty, setDifficulty] = useState('normal');
  
  // Game States
  const [score, setScore] = useState(0);
  const [bossHealth, setBossHealth] = useState(5);
  const [playerInventory, setPlayerInventory] = useState({ shield: 0, speed: 0, bomb: 0 });
  const [notifications, setNotifications] = useState([]);
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [level, setLevel] = useState(1);

  const GRID_SIZE = 13;
  const CELL_SIZE = 40;

  // Story Dialogue
  const storyDialogues = [
    {
      title: "Day at the Office",
      dialogues: [
        "You arrive at work on a normal Monday morning...",
        "Everything seems fine at first...",
        "But then you hear a SCREAM from the boss's office!",
        "Mr. Boss bursts out, completely enraged!",
        "He's had enough! Time to escape!",
        "Run! Avoid! Survive! Get out of here!"
      ]
    },
    {
      title: "The Chase Begins",
      dialogues: [
        "You run through the office corridors...",
        "The boss is right behind you!",
        "Wait! You find some office supplies...",
        "💣 BOMBS! Perfect for defense!",
        "Use them strategically to trap the boss!",
        "Good luck, escape artist!"
      ]
    },
    {
      title: "Victory!",
      dialogues: [
        "You made it! You escaped!",
        "The boss is defeated!",
        "You are a TRUE office warrior!",
        "Congratulations on your escape!",
        "Time to celebrate your freedom!",
        "Will you survive another day?"
      ]
    }
  ];

  const playSound = (freq, dur) => {
    if (!soundOn) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const addNotification = (text, color = '#4CAF50') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, color }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 2000);
  };

  const startStory = () => {
    setStoryPhase(0);
    setGameState('story');
  };

  const nextStoryPhase = () => {
    if (storyPhase < storyDialogues[0].dialogues.length - 1) {
      setStoryPhase(storyPhase + 1);
      playSound(600, 0.1);
    } else {
      startGameplay();
    }
  };

  const startGameplay = () => {
    if (tempBossName.trim()) setBossName(tempBossName);
    setScore(0);
    setBossHealth(difficulty === 'hard' ? 7 : difficulty === 'easy' ? 3 : 5);
    setPlayerInventory({ shield: 0, speed: 0, bomb: 3 });
    setLevel(1);
    setGameState('playing');
    playSound(800, 0.2);
  };

  // Game Logic
  const gameDataRef = useRef({
    playerPos: { x: 1, y: 1 },
    bossPos: { x: 11, y: 11 },
    bombs: [],
    explosions: [],
    coins: [],
    powerUps: [],
    keys: {}
  });

  useEffect(() => {
    if (gameState !== 'playing') return;

    const initializeGame = () => {
      gameDataRef.current.coins = [];
      for (let i = 0; i < 8; i++) {
        let x, y;
        do {
          x = Math.floor(Math.random() * 11) + 1;
          y = Math.floor(Math.random() * 11) + 1;
        } while ((x === 1 && y === 1) || (x === 11 && y === 11));
        gameDataRef.current.coins.push({ x, y, val: 100 });
      }

      gameDataRef.current.powerUps = [];
      const types = ['shield', 'speed', 'bomb'];
      for (let i = 0; i < 3; i++) {
        let x, y;
        do {
          x = Math.floor(Math.random() * 11) + 1;
          y = Math.floor(Math.random() * 11) + 1;
        } while ((x === 1 && y === 1) || (x === 11 && y === 11));
        gameDataRef.current.powerUps.push({ x, y, type: types[i] });
      }
    };

    const handleKeyDown = (e) => {
      gameDataRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ') {
        e.preventDefault();
        placeBomb();
      }
    };

    const handleKeyUp = (e) => {
      gameDataRef.current.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    initializeGame();

    let gameLoopId;
    const gameLoop = setInterval(() => {
      const speed = playerInventory.speed > 0 ? 2 : 1;
      const keys = gameDataRef.current.keys;

      if (keys['arrowup'] || keys['w']) gameDataRef.current.playerPos.y = Math.max(0, gameDataRef.current.playerPos.y - speed);
      if (keys['arrowdown'] || keys['s']) gameDataRef.current.playerPos.y = Math.min(12, gameDataRef.current.playerPos.y + speed);
      if (keys['arrowleft'] || keys['a']) gameDataRef.current.playerPos.x = Math.max(0, gameDataRef.current.playerPos.x - speed);
      if (keys['arrowright'] || keys['d']) gameDataRef.current.playerPos.x = Math.min(12, gameDataRef.current.playerPos.x + speed);

      // Boss AI
      const dx = gameDataRef.current.playerPos.x - gameDataRef.current.bossPos.x;
      const dy = gameDataRef.current.playerPos.y - gameDataRef.current.bossPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0.5) {
        gameDataRef.current.bossPos.x += Math.sign(dx) * 0.1;
        gameDataRef.current.bossPos.y += Math.sign(dy) * 0.1;
      }

      gameDataRef.current.bossPos.x = Math.max(0, Math.min(12, gameDataRef.current.bossPos.x));
      gameDataRef.current.bossPos.y = Math.max(0, Math.min(12, gameDataRef.current.bossPos.y));

      // Bombs
      gameDataRef.current.bombs = gameDataRef.current.bombs.map(b => ({ ...b, timer: b.timer - 1 }));
      const explodedBombs = gameDataRef.current.bombs.filter(b => b.timer <= 0);
      gameDataRef.current.bombs = gameDataRef.current.bombs.filter(b => b.timer > 0);

      const newExplosions = [];
      explodedBombs.forEach(bomb => {
        newExplosions.push({ x: bomb.x, y: bomb.y, timer: 2 });
        playSound(500, 0.2);
        for (let i = 1; i <= 2; i++) {
          if (bomb.x + i < GRID_SIZE) newExplosions.push({ x: bomb.x + i, y: bomb.y, timer: 2 });
          if (bomb.x - i >= 0) newExplosions.push({ x: bomb.x - i, y: bomb.y, timer: 2 });
          if (bomb.y + i < GRID_SIZE) newExplosions.push({ x: bomb.x, y: bomb.y + i, timer: 2 });
          if (bomb.y - i >= 0) newExplosions.push({ x: bomb.x, y: bomb.y - i, timer: 2 });
        }
      });

      gameDataRef.current.explosions = [...gameDataRef.current.explosions, ...newExplosions];
      gameDataRef.current.explosions = gameDataRef.current.explosions.map(e => ({ ...e, timer: e.timer - 1 })).filter(e => e.timer > 0);

      setPlayerInventory(prev => ({
        shield: Math.max(0, prev.shield - 1),
        speed: Math.max(0, prev.speed - 1),
        bomb: prev.bomb
      }));
    }, 200);

    return () => {
      clearInterval(gameLoopId);
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, playerInventory]);

  const placeBomb = () => {
    if (playerInventory.bomb <= 0) return;
    gameDataRef.current.bombs.push({
      x: gameDataRef.current.playerPos.x,
      y: gameDataRef.current.playerPos.y,
      timer: 60
    });
    setPlayerInventory(prev => ({ ...prev, bomb: prev.bomb - 1 }));
    addNotification('💣 Bomb placed!', '#FF9800');
    playSound(400, 0.1);
  };

  const renderBoard = () => {
    const tiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isWall = (x % 2 === 0 && y % 2 === 0) || (x === 0 || y === 0 || x === 12 || y === 12);
        let content = null;
        let bg = isWall ? '#2c2c2c' : '#e8f5e9';

        if (gameDataRef.current.playerPos.x === x && gameDataRef.current.playerPos.y === y) {
          content = '🧑';
          if (playerInventory.shield > 0) bg = '#fff0d9';
          if (playerInventory.speed > 0) bg = '#fff9e6';
        } else if (gameDataRef.current.bossPos.x === x && gameDataRef.current.bossPos.y === y) {
          content = '😠';
        } else if (gameDataRef.current.bombs.some(b => b.x === x && b.y === y)) {
          content = '💣';
        } else if (gameDataRef.current.explosions.some(e => e.x === x && e.y === y)) {
          content = '💥';
          bg = '#ffcccc';
        } else if (gameDataRef.current.coins.some(c => c.x === x && c.y === y)) {
          content = '💰';
        } else if (gameDataRef.current.powerUps.some(p => p.x === x && p.y === y)) {
          const p = gameDataRef.current.powerUps.find(p => p.x === x && p.y === y);
          content = p.type === 'shield' ? '🛡️' : p.type === 'speed' ? '⚡' : '🎯';
        }

        tiles.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: bg,
              border: '2px solid #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            {content}
          </div>
        );
      }
    }
    return tiles;
  };

  // INTRO SCREEN
  if (gameState === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '700px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏢💣</div>
          <h1 style={{ fontSize: '52px', color: '#333', margin: '0 0 15px', fontWeight: 'bold' }}>
            ESCAPE THE BOSS
          </h1>
          <p style={{ fontSize: '20px', color: '#666', margin: '0 0 40px', lineHeight: '1.6' }}>
            A thrilling story of survival in the office.
            <br />
            Can you escape your angry boss?
          </p>

          <button
            onClick={startStory}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '15px',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            START ADVENTURE 🚀
          </button>

          <button
            onClick={() => setSoundOn(!soundOn)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              background: soundOn ? '#4CAF50' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {soundOn ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>

          <div style={{
            marginTop: '40px',
            textAlign: 'left',
            background: '#f5f5f5',
            padding: '25px',
            borderRadius: '12px',
            fontSize: '14px',
            color: '#555'
          }}>
            <p style={{ fontWeight: 'bold', marginTop: 0, fontSize: '16px' }}>📖 STORY MODE:</p>
            <p>✓ Experience an engaging office escape story</p>
            <p>✓ Follow the narrative from start to freedom</p>
            <p>✓ Make strategic moves to defeat the boss</p>
            <p>✓ Collect coins and power-ups to survive</p>
            <p style={{ marginBottom: 0 }}>✓ Can you escape and win?</p>
          </div>
        </div>
      </div>
    );
  }

  // STORY SCREEN
  if (gameState === 'story') {
    const dialogue = storyDialogues[0];
    const currentText = dialogue.dialogues[storyPhase];

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          padding: '50px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '100px', marginBottom: '30px', animation: 'bounce 1s infinite' }}>
            {storyPhase === 0 && '🏢'}
            {storyPhase === 1 && '😠'}
            {storyPhase === 2 && '💨'}
            {storyPhase === 3 && '🤬'}
            {storyPhase === 4 && '💣'}
            {storyPhase === 5 && '🏃'}
          </div>

          <h2 style={{ fontSize: '32px', color: '#667eea', margin: '0 0 30px' }}>
            {dialogue.title}
          </h2>

          <p style={{
            fontSize: '22px',
            color: '#333',
            lineHeight: '1.8',
            marginBottom: '40px',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentText}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {storyPhase > 0 && (
              <button
                onClick={() => setStoryPhase(storyPhase - 1)}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  background: '#f5f5f5',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ⬅️ Back
              </button>
            )}
            <button
              onClick={nextStoryPhase}
              style={{
                padding: '12px',
                fontSize: '14px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                gridColumn: storyPhase === 0 ? '1 / -1' : 'auto'
              }}
            >
              {storyPhase === storyDialogues[0].dialogues.length - 1 ? 'START GAME 🎮' : 'Next ➡️'}
            </button>
          </div>

          <div style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#666'
          }}>
            Phase {storyPhase + 1} of {storyDialogues[0].dialogues.length}
          </div>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  // GAMEPLAY SCREEN
  if (gameState === 'playing') {
    const healthBar = Array(Math.max(0, bossHealth)).fill('❤️').join('') || '💀';

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: "'Segoe UI', Arial, sans-serif"
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* HUD */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>💰 OT Pay</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>${Math.round(score)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>❤️ Boss HP</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{healthBar}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>💣 Bombs</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>{Math.round(playerInventory.bomb)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>📍 Level</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{level}</div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div style={{
                background: playerInventory.shield > 0 ? '#fff3e0' : '#f5f5f5',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid ' + (playerInventory.shield > 0 ? '#FF9800' : '#ddd')
              }}>
                <div style={{ fontSize: '20px' }}>🛡️</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Shield</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{Math.round(playerInventory.shield)}s</div>
              </div>
              <div style={{
                background: playerInventory.speed > 0 ? '#e3f2fd' : '#f5f5f5',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid ' + (playerInventory.speed > 0 ? '#2196F3' : '#ddd')
              }}>
                <div style={{ fontSize: '20px' }}>⚡</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Speed</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{Math.round(playerInventory.speed)}s</div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div style={{
            position: 'relative',
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            background: '#e8f5e9',
            border: '4px solid #333',
            margin: '0 auto 20px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}>
            {renderBoard()}
          </div>

          {/* Notifications */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 100
          }}>
            {notifications.map(notif => (
              <div key={notif.id} style={{
                background: notif.color,
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {notif.text}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: '0 0 15px', color: '#666', fontSize: '14px' }}>
              ⬆️⬇️⬅️➡️ or WASD to move • SPACE to place bomb
            </p>
            <button
              onClick={() => setGameState('intro')}
              style={{
                padding: '12px 24px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ↩️ Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GAME OVER
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ fontSize: '64px', margin: '0 0 20px', color: '#333' }}>🎊 VICTORY! 🎊</h1>
        <p style={{ fontSize: '22px', color: '#666', marginBottom: '30px' }}>
          You escaped from {bossName}!
        </p>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '15px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <p style={{ fontSize: '16px', margin: '0 0 15px' }}>Total OT Pay & Bonuses</p>
          <p style={{ fontSize: '56px', fontWeight: 'bold', margin: 0 }}>💰 ${Math.round(score)}</p>
        </div>
        <button
          onClick={() => setGameState('intro')}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Play Again 🎮
        </button>
      </div>
    </div>
  );
};

export default EscapeTheBossStory;
