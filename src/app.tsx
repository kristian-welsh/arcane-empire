import { GameComponent } from './components/GameComponent';
import './styles/global.css';
import Tab from './components/Tab';
import Tabs from './components/Tabs';
import Badge from './components/Badge';
import React, { useEffect, useState } from 'preact/compat';
import {
  ElementType,
  GameData,
  Tower,
  Wizard,
  WizardCounts,
  WizardCollection,
} from './types';
import { eventEmitter } from './events/EventEmitter';
import fire_wizard_src from '../src/assets/wizards/wizard_red.png';
import water_wizard_src from '../src/assets/wizards/wizard_blue.png';
import earth_wizard_src from '../src/assets/wizards/wizard_brown.png';
import air_wizard_src from '../src/assets/wizards/wizard_white.png';
import { Tile } from './systems/world_generation/Tile';
import { eventImages } from './app-utils/image-maps';
import { EmpiresTab } from './components/EmpiresTab';



export function App() {
  const [gameState, setGameState] = useState<GameData>(null);
  const [selectedTab, setSelectedTab] = useState<string>('first');
  const [currentTile, setCurrentTile] = useState<Tile | null>(null);

  const appEvent = eventEmitter.subscribe('update-app-data', () => {});
  const tileEvent = eventEmitter.subscribe('tile-clicked', (tile: Tile) =>
    handleTileClicked(tile)
  );

  useEffect(() => {
    const unsubscribe = () => {
      appEvent();
      tileEvent();
    };
    return () => unsubscribe();
  }, []);

  const sendGameStateToPhaser = (gameState: GameData) => {
    eventEmitter.emit('update-phaser-data', gameState);
  };

  const buyWizard = (elementType: ElementType): void => {
    eventEmitter.emit('buy-wizard', elementType);
  };
  const handleTileClicked = (tile: Tile) => {
    (
      document.querySelector('[aria-hidden="true"]') as HTMLButtonElement | null
    )?.click();
    setCurrentTile(tile);
  };

  const emptyWizardsData: WizardCollection = {
    air: [],
    earth: [],
    fire: [],
    water: [],
  };

  const emptyTowerData: Tower = {
    baseWizardCost: 0,
    perExtraWizardCost: 0,
    wizardCapacities: {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
    },
  };

  return (
    <div className="h-screen max-h-screen bg-gray-800">
      <div className="flex h-[5%] w-4/5 ml-auto bg-gray-600 py-2 px-6 justify-between text-white items-center rounded-lg">
        <div className="flex gap-4">
          <Badge
            className="text-yellow-300"
            text={`Gold: ${gameState?.playerGold ?? 0}`}
          />
          <Badge
            className="text-cyan-200"
            text={`Score: ${gameState?.reputation ?? 0}`}
          />
        </div>
        <div className="flex gap-4">
          <Badge color="blue" text="Full Screen" onClick={console.log} />
          <Badge color="red" text="Mute" onClick={console.log} />
        </div>
      </div>
      <div className="flex flex-wrap h-[95%] flex-col items-stretch">
        <Tabs
          className="w-1/5 h-full"
          selected={selectedTab}
          setSelected={setSelectedTab}
        >
          <Tab
            id="first"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-blue-600 bg-blue-700 border-4 ' : ''}bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold rounded-t-md min-h-[40px]`}
                onClick={onSelect}
              >
                Wizards
              </button>
            )}
          >
            <WizardsTab wizards={gameState?.wizards ?? emptyWizardsData} />
          </Tab>
          <Tab
            id="second"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-red-600 bg-red-700 border-4 ' : ''}bg-red-500 w-1/3 hover:bg-red-700 text-white font-bold rounded-t-md min-h-[40px]`}
                onClick={onSelect}
              >
                Tower
              </button>
            )}
          >
            <TowerTab
              wizards={gameState?.wizards ?? emptyWizardsData}
              tower={gameState?.tower ?? emptyTowerData}
              playerGold={gameState?.playerGold ?? 0}
              buy={buyWizard}
            />
          </Tab>
          <Tab
            id="third"
            className="bg-gray-600 h-full flex flex-col items-end justify-end gap-y-2 p-2"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-green-600 bg-green-700 border-4 ' : ''}bg-green-500 w-1/3 hover:bg-green-700 text-white font-bold rounded-t-md min-h-[40px]`}
                onClick={onSelect}
              >
                Empires
              </button>
            )}
          >
            <EmpiresTab
              empires={gameState?.empires ?? []}
              worldEvents={gameState?.events ?? []}
            />
          </Tab>
          <Tab
            id="fourth"
            className="bg-gray-600 h-full flex flex-col items-start justify-end gap-y-2 p-2"
            button={(_, onSelect) => {
              return (
                <button
                  style={{ display: 'none' }}
                  onClick={onSelect}
                  aria-hidden="true"
                ></button>
              );
            }}
          >
            <TilesTab
              currentTile={currentTile}
              wizards={gameState?.wizards ?? emptyWizardsData}
            />
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
    <div className="flex flex-col p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-blue-400 pb-2">Wizards</h2>
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
      <span className="text-white text-sm">{props.wizard.initials}</span>
    </div>
  );
};

const TowerTab: React.FC<{
  wizards: WizardCollection;
  tower: Tower;
  playerGold: number;
  buy: (element: ElementType) => void;
}> = (props) => {
  const { wizards, tower, playerGold, buy } = props;

  return (
    <div className="flex flex-col p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-red-500 pb-2">Tower</h2>
      {['fire', 'water', 'earth', 'air'].map((element) => (
        <div className="py-2">
          <WizardShopPanel
            elementType={element}
            playerGold={playerGold}
            wizardTypeCount={wizards[element as keyof WizardCollection].length}
            wizardTypeCapacity={
              tower.wizardCapacities[element as keyof WizardCounts]
            }
            wizardCost={
              tower.baseWizardCost +
              tower.perExtraWizardCost *
                (wizards[element as keyof WizardCollection].length - 1)
            }
            buy={buy}
          />
        </div>
      ))}
    </div>
  );
};

const TilesTab: React.FC<{
  currentTile: Tile | null;
  wizards: WizardCollection;
}> = (props) => {
  const { currentTile, wizards } = props;

  if (!currentTile) return <p className="text-white">No tile selected</p>;

  return (
    <div className="flex flex-col max-h-[90vh] h-full overflow-auto">
      <h2 className="text-2xl text-purple-400 pb-2">
        {`(${currentTile.coordinates.x}, ${currentTile.coordinates.y}) ${currentTile.terrainData.name}`}
      </h2>
      <p className="text-white">
        {currentTile.terrainData.is_walkable ? 'Walkable' : 'Not walkable'}
      </p>
      <p className="text-white pt-2">
        Structure:{' '}
        {currentTile.structureData ? currentTile.structureData.name : 'None'}
      </p>
      <div className="text-white py-2">
        Event:{' '}
        {currentTile.currentEvent
          ? currentTile.currentEvent.eventData.type
          : 'None'}
        {currentTile.currentEvent ? (
          <img
            src={eventImages[currentTile.currentEvent.eventData.type]}
            width={'100%'}
            className={'py-2'}
          />
        ) : null}
      </div>
      <p className="text-white">Wizards here: </p>
      <p className="text-white">(none)</p>
      <p className="text-white pt-2">Send a wizard here: </p>
      {wizards.air.map((wizard) => (
        <WizardCircle key={wizard.name} wizard={wizard} />
      ))}
      {wizards.earth.map((wizard) => (
        <WizardCircle key={wizard.name} wizard={wizard} />
      ))}
      {wizards.fire.map((wizard) => (
        <WizardCircle key={wizard.name} wizard={wizard} />
      ))}
      {wizards.water.map((wizard) => (
        <WizardCircle key={wizard.name} wizard={wizard} />
      ))}
    </div>
  );
};

const WizardShopPanel: React.FC<{
  elementType: string;
  playerGold: number;
  wizardTypeCount: number;
  wizardTypeCapacity: number;
  wizardCost: number;
  buy: (element: ElementType) => void;
}> = (props) => {
  const {
    elementType,
    playerGold,
    wizardTypeCount,
    wizardTypeCapacity,
    wizardCost,
    buy,
  } = props;

  let bgColor;
  let btnColor;
  let btnHoverColor;
  let wizardImgSrc;

  switch (elementType) {
    case 'fire':
      bgColor = 'bg-red-400';
      btnColor = 'bg-red-600';
      btnHoverColor = 'hover:bg-red-900';
      wizardImgSrc = fire_wizard_src;
      break;
    case 'water':
      bgColor = 'bg-blue-400';
      btnColor = 'bg-blue-600';
      btnHoverColor = 'hover:bg-blue-900';
      wizardImgSrc = water_wizard_src;
      break;
    case 'earth':
      bgColor = 'bg-amber-400';
      btnColor = 'bg-amber-600';
      btnHoverColor = 'hover:bg-amber-900';
      wizardImgSrc = earth_wizard_src;
      break;
    case 'air':
      bgColor = 'bg-slate-400';
      btnColor = 'bg-gray-600';
      btnHoverColor = 'hover:bg-gray-900';
      wizardImgSrc = air_wizard_src;
      break;
    default:
      bgColor = 'bg-gray-400';
      btnColor = 'bg-gray-700';
      btnHoverColor = 'hover:bg-gray-900';
      wizardImgSrc = fire_wizard_src;
  }

  return (
    <div
      className={`${bgColor} w-full h-48 rounded-lg p-4 flex flex-row justify-between`}
    >
      <div className="w-1/3 h-full">
        <img
          src={`${wizardImgSrc}`}
          alt={`${elementType} wizard`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-white">Capacity:</p>
          <p className="text-white">
            {wizardTypeCount} of {wizardTypeCapacity}
          </p>
        </div>
        <button
          className={`${btnColor} text-white px-3 py-4 rounded-md shadow-md ${btnHoverColor} hover:text-gray disabled:bg-[#333333ff] `}
          disabled={
            wizardTypeCount >= wizardTypeCapacity || playerGold < wizardCost
          }
          onClick={() => {
            buy(elementType as ElementType);
          }}
        >
          <p>Buy {elementType} Wizard:</p>
          <p>{wizardCost} Gold</p>
        </button>
      </div>
    </div>
  );
};
