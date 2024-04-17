import { GameComponent } from './components/GameComponent';
import './styles/global.css';

export function App() {
  const messages = [
    'Hello World!',
    'Another one 🤙',
    'Woooo there is now a messages panel :D',
  ];

  return (
    <div className="flex flex-wrap flex-row items-stretch">
      <GameComponent className="w-4/5 h-screen overflow-y-hidden" />
      <div className="w-1/5 bg-gray-600 flex justify-end items-end p-2 flex-col gap-y-2">
        {messages.map((message, i) => (
          <span
            key={i}
            className="text-xl px-4 py-2 rounded-2xl bg-gray-300 text-pretty"
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
