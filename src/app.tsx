import { GameComponent } from './components/GameComponent';
import './styles/global.css';
import Tab from './components/Tab';
import Tabs from './components/Tabs';
import Badge from './components/Badge';
import React from 'preact/compat';
import { Wizard, WizardCollection } from './types';

export function App() {
  const messages = [
    'Hello World!',
    'Another one 🤙',
    'Woooo there is now a messages panel :D',
  ];

  const mockWizardsData: WizardCollection = {
    air: [
      { name: 'Aero', status: 'idle' },
      { name: 'Sky', status: 'away' },
      { name: 'Winno', status: 'away' },
    ],
    earth: [{ name: 'Terrat', status: 'idle' }],
    fire: [
      { name: 'Pyro', status: 'idle' },
      { name: 'Flama', status: 'away' },
      { name: 'Infar', status: 'idle' },
    ],
    water: [
      { name: 'Aqua', status: 'idle' },
      { name: 'Tidal', status: 'idle' },
    ],
  };

  const mockGold = 300;
  const mockScore = 32300;

  return (
    <div className="h-screen max-h-screen bg-gray-800">
      <div className="flex h-[5%] w-4/5 ml-auto bg-gray-600 py-2 px-6 justify-between text-white items-center rounded-lg">
        <div className="flex gap-4">
          <Badge className="text-yellow-300" text={`Gold: ${mockGold}`} />
          <Badge className="text-cyan-200" text={`Score: ${mockScore}`} />
        </div>
        <div className="flex gap-4">
          <Badge color="blue" text="Full Screen" onClick={console.log} />
          <Badge color="red" text="Mute" onClick={console.log} />
        </div>
      </div>
      <div className="flex flex-wrap h-[95%] flex-col items-stretch">
        <Tabs className="w-1/5 h-full">
          <Tab
            id="first"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-blue-600 bg-blue-700 border-4 ' : ''}bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-t-md`}
                onClick={onSelect}
              >
                Wizards
              </button>
            )}
          >
            <WizardsTab wizards={mockWizardsData} />
          </Tab>
          <Tab
            id="second"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-red-600 bg-red-700 border-4 ' : ''}bg-red-500 w-1/3 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-t-md`}
                onClick={onSelect}
              >
                Tower
              </button>
            )}
          >
            <TowerTab />
          </Tab>
          <Tab
            id="third"
            className="bg-gray-600 h-full flex flex-col items-end justify-end gap-y-2 p-2"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-green-600 bg-green-700 border-4 ' : ''}bg-green-500 w-1/3 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-t-md`}
                onClick={onSelect}
              >
                Kingdom
              </button>
            )}
          >
            <KingdomTab messages={messages} />
          </Tab>
        </Tabs>
        <GameComponent className="w-4/5 h-full overflow-y-hidden" />
      </div>
    </div>
  );
}

const WizardsTab: React.FC<{ wizards: WizardCollection }> = (props) => {
  const { wizards } = props;

  return (
    <div className="h-full p-2">
      <h2 className="text-2xl text-purple-400 pb-2">Wizards</h2>
      <div className="text-cyan-300 py-2">
        <h3 className="text-xl">Air</h3>
        <p className="text-sm">Air Wizards ignore terrain penalties.</p>
        <ElementRow wizardRow={wizards.air} />
      </div>
      <div className="text-emerald-400 py-2">
        <h3 className="text-xl">Earth</h3>
        <p className="text-sm">Earth wizards are more hardy.</p>
        <ElementRow wizardRow={wizards.earth} />
      </div>
      <div className="text-orange-500 py-2">
        <h3 className="text-xl">Fire</h3>
        <p className="text-sm">Fire wizards complete tasks faster.</p>
        <ElementRow wizardRow={wizards.fire} />
      </div>
      <div className="text-blue-400 py-2">
        <h3 className="text-xl">Water</h3>
        <p className="text-sm">Water wizards earn reputation faster.</p>
        <ElementRow wizardRow={wizards.water} />
      </div>
    </div>
  );
};

const TowerTab = () => (
  <div className="h-full p-2">
    <h2 className="text-2xl text-green-500 pb-2">Tower</h2>
  </div>
);

const KingdomTab: React.FC<{ messages: string[] }> = (props) => {
  return (
    <div className="h-full flex flex-col items-end justify-end gap-y-1 p-2">
      {props.messages.map((message, i) => (
        <span
          key={i}
          className="text-xl px-4 py-2 rounded-2xl bg-gray-300 text-pretty"
        >
          {message}
        </span>
      ))}
    </div>
  );
};

const ElementRow: React.FC<{ wizardRow: Wizard[] }> = (props) => {
  const idleWizards = props.wizardRow.filter(
    (wizard) => wizard.status === 'idle'
  );
  const awayWizards = props.wizardRow.filter(
    (wizard) => wizard.status === 'away'
  );

  return (
    <div className="flex flex-wrap items-center justify-start mb-4">
      {idleWizards.map((wizard) => (
        <WizardCircle key={wizard.name} wizard={wizard} />
      ))}
      {awayWizards.map((wizard) => (
        <WizardCircle key={wizard.name} wizard={wizard} />
      ))}
    </div>
  );
};

const WizardCircle: React.FC<{ wizard: Wizard }> = (props) => {
  const statusColor =
    props.wizard.status === 'idle' ? 'bg-green-500' : 'bg-gray-300';
  return (
    <div
      className={`h-12 w-12 rounded-full ${statusColor} flex items-center justify-center m-1`}
    >
      <span className="text-white text-sm">{props.wizard.name}</span>
    </div>
  );
};
