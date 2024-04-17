import { GameComponent } from './components/GameComponent';
import './styles/global.css';

export function App() {
  return (
    <div style="display: flex; flex-wrap: wrap; flex-direction: row; align-items: stretch;">
      <GameComponent style="width: 80%; height: 100vh; overflow-y: hidden;" />
      <div style="width: 20%; background-color: #333; display: flex; align-items: stretch;">
        <div style="margin: 1rem; width: 100%; display: flex; align-items: center; text-align: center; justify-content: center; background-color: #555; border-radius: 0.5rem;">
          <span style="font-size: xx-large; padding: 0.5rem 1rem; border-radius: 1.25rem; background-color: #b4b4b4;">
            Hello World!
          </span>
        </div>
      </div>
    </div>
  );
}
