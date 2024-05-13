import { Empire, WorldEvent } from '../types';

import icon_tornado_event_src from '../assets/ui/event_icons/icon_tornado.png';
import icon_fire_event_src from '../assets/ui/event_icons/icon_fire.png';
import icon_earthquake_event_src from '../assets/ui/event_icons/icon_earthquake.png';

export const EmpiresTab: React.FC<{
  empires: Empire[];
  worldEvents: WorldEvent[];
}> = (props) => {
  return (
    <div className="h-full w-full flex flex-col items-start justify-start gap-y-1 p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-green-500 pb-2">Empires</h2>
      {props.empires.map((empire) => (
        <EmpireStatus empire={empire} />
      ))}
      <h2 className="text-2xl text-green-500 pb-2">Arcane Anomalies</h2>
      {props.worldEvents.map((worldEvent) => (
        <WorldEventStatus worldEvent={worldEvent} />
      ))}
    </div>
  );
};

export const EmpireStatus: React.FC<{ empire: Empire }> = (props) => {
  const { empire } = props;

  let empireIconSrc;

  // Hash the empire use that to pick a random profile picture

  return (
    <div className={`w-full h-48 bg-slate-400 border-gray-800 rounded-lg border-2`}>
      <div className="flex items-center">
        <img
          src={empireIconSrc}
          alt={empire.empireName}
          className="mr-2 object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">{empire.rulerName}</h3>
        <h2 className="text-lg font-semibold">Of The</h2>
        <h3 className="text-lg font-semibold">{empire.empireName}</h3>
        <p className="text-sm text-gray-600">Capital: {empire.capitalName}</p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go To
      </button>
    </div>
  );
};

export const WorldEventStatus: React.FC<{ worldEvent: WorldEvent }> = (
  props
) => {
  const { worldEvent } = props;

  let eventIconSrc = '';

  switch (worldEvent.type) {
    case 'tornado':
      eventIconSrc = icon_tornado_event_src;
      break;
    case 'fire':
      eventIconSrc = icon_fire_event_src;
      break;
    case 'earthquake':
      eventIconSrc = icon_earthquake_event_src;
      break;
  }

  return (
    <div
      className={`w-full h-18 ${worldEvent.mission === undefined ? ' bg-slate-400' : 'bg-amber-400'} border-2 ${worldEvent.mission === undefined ? 'border-gray-800' : 'border-amber-800'} rounded-lg px-4 py-2 flex flex-row items-center justify-between`}
    >
      <div className="flex items-center">
        <img
          src={eventIconSrc}
          alt={worldEvent.type}
          className="mr-2 object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">{worldEvent.name}</h3>
        <p className="text-sm text-gray-600">
          {worldEvent.mission === undefined
            ? ''
            : worldEvent.mission.empireName}
        </p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go To
      </button>
    </div>
  );
};
