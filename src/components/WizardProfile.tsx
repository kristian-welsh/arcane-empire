import { Wizard } from '../types';

export const WizardProfile: React.FC<{
  wizard: Wizard;
  clickedCallback: () => void;
}> = (props) => {
  const statusColor =
    props.wizard.status === 'idle' ? 'bg-green-500' : 'bg-gray-300';

  return (
    <div
      className={`h-12 w-12 m-1 rounded-full ${statusColor} flex items-center justify-center cursor-pointer`}
      onClick={props.clickedCallback}
    >
      <span className="text-white text-sm select-none">
        {props.wizard.initials}
      </span>
    </div>
  );
};
