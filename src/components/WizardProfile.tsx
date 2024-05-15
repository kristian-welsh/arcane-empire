import { Wizard } from '../types';

export const WizardProfile: React.FC<{ wizard: Wizard }> = (props) => {
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
