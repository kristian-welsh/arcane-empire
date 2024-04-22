import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useResizeObserver } from 'usehooks-ts';
import GameScene from '../scenes/GameScene';
import InitialScene from '../scenes/InitialScene';
import MenuScene from '../scenes/MenuScene';
import PostGameScene from '../scenes/PostGameScene';

export const GameComponent = ({ className }: { className?: string }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const [game, setGame] = useState<Phaser.Game | null>(null);

  const { width, height } = useResizeObserver({
    ref: gameContainerRef,
    onResize: ({ width, height }): void => {
      if (game != null && width != null && height != null) {
        game.scale.resize(width, height);
        game.scale.updateCenter();
      }
    },
  });

  useEffect(() => {
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width,
        height,
        scene: [InitialScene, MenuScene, GameScene, PostGameScene],
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
          },
        },
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.NONE,
          autoCenter: Phaser.Scale.NO_CENTER,
        },
        callbacks: {
          postBoot: (game) => {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
          },
        },
      };

      const game = new Phaser.Game(config);
      setGame(game);

      gameContainerRef.current.appendChild(game.canvas);
      return () => {
        if (game != null) {
          game.destroy(true);
        }
      };
    }
  }, []);

  return <div className={className || ''} ref={gameContainerRef} />;
};
