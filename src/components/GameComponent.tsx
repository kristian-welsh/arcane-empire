import Phaser from 'phaser';
import { useEffect, useRef } from 'preact/hooks';
import GameScene from '../scenes/GameScene';
import InitialScene from '../scenes/InitialScene';
import MenuScene from '../scenes/MenuScene';
import PostGameScene from '../scenes/PostGameScene';

export const GameComponent = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  let game: Phaser.Game | null = null;

  const resize = () => {
    if (game) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.min(width / 800, height / 600);

      game.scale.setGameSize(800 * scale, 600 * scale);
    }
  };

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [InitialScene, MenuScene, GameScene, PostGameScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    game = new Phaser.Game(config);

    window.addEventListener('resize', resize);
    resize();

    return () => {
      game && game.destroy(true);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (game && gameContainerRef.current) {
      gameContainerRef.current.appendChild(game.canvas);
    }
  }, [game]);

  return <div ref={gameContainerRef} />;
};
