import { useState } from 'preact/hooks';
import { GameComponent } from './components/GameComponent';
import './styles/global.css';

export function App() {
  const [activeMenuTab, setActiveMenuTab] = useState(0);

  const messages = [
    'Hello World!',
    'Another one 🤙',
    'Woooo there is now a messages panel :D',
  ];

  return (
    <div className="h-screen max-h-screen">
      <div className="flex h-[5%] bg-gray-800 text-white items-center">
        TOPBAR
      </div>
      <div className="flex flex-wrap h-[95%] flex-col items-stretch">
        <div className="flex h-[7%] flex-nowrap items-stretch">
          <button
            className="bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setActiveMenuTab(0)}
          >
            Button
          </button>
          <button
            className="bg-red-500 w-1/3 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setActiveMenuTab(1)}
          >
            Button
          </button>
          <button
            className="bg-green-500 w-1/3 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setActiveMenuTab(2)}
          >
            Button
          </button>
        </div>
        <div className="w-1/5 h-[93%] bg-gray-600 flex justify-end items-start p-2 flex-col gap-y-2 rounded-lg">
          {activeMenuTab === 0 && <div className="text-white">Hello1</div>}
          {activeMenuTab === 1 && <div className="text-white">Hello2</div>}
          {activeMenuTab === 2 &&
            messages.map((message, i) => (
              <span
                key={i}
                className="text-xl px-4 py-2 rounded-2xl bg-gray-300 text-pretty"
              >
                {message}
              </span>
            ))}
        </div>
        <GameComponent className="w-4/5 h-full overflow-y-hidden" />
      </div>
    </div>
  );
}
