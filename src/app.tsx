import { GameComponent } from './components/GameComponent';
import './styles/global.css';
import Tab from './components/Tab';
import Tabs from './components/Tabs';
import Badge from './components/Badge';

export function App() {
  const messages = [
    'Hello World!',
    'Another one 🤙',
    'Woooo there is now a messages panel :D',
  ];

  return (
    <div className="h-screen max-h-screen bg-gray-800">
      <div className="flex gap-x-2 p-2 text-white items-center">
        <Badge color="yellow" text="Gold: 500" />
        <Badge color="slate" text="Rep: 8012" />
        <Badge color="green" text="Temperate" />
        <Badge color="blue" text="Full Screen" onClick={console.log} />
        <Badge color="red" text="Mute" onClick={console.log} />
      </div>
      <div className="flex flex-wrap h-[95%] flex-col items-stretch">
        <Tabs className="w-1/5 h-full">
          <Tab
            id="first"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-blue-300 border-4 border-b-0 ' : ''}bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-t-md`}
                onClick={onSelect}
              >
                Button
              </button>
            )}
          >
            <div className="">Hello1</div>
          </Tab>
          <Tab
            id="second"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-red-300 border-4 border-b-0 ' : ''}bg-red-500 w-1/3 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-t-md`}
                onClick={onSelect}
              >
                Button
              </button>
            )}
          >
            Hello2
          </Tab>
          <Tab
            id="third"
            className="bg-gray-600 h-full flex flex-col items-end justify-end gap-y-2 p-2"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-green-300 border-4 border-b-0 ' : ''}bg-green-500 w-1/3 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-t-md`}
                onClick={onSelect}
                // TODO: Change this to an icon maybe?
              >
                Messages
              </button>
            )}
          >
            {messages.map((message, i) => (
              <span
                key={i}
                className="text-xl px-4 py-2 rounded-2xl bg-gray-300 text-pretty"
              >
                {message}
              </span>
            ))}
          </Tab>
        </Tabs>
        <GameComponent className="w-4/5 h-full overflow-y-hidden" />
      </div>
    </div>
  );
}
