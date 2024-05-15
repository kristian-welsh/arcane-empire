import { Wizard, WizardCollection } from '../types';
import { WizardProfile } from './WizardProfile';

export const WizardsTab: React.FC<{ wizards: WizardCollection }> = (props) => {
  const { wizards } = props;

  return (
    <div className="flex flex-col p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-blue-400 pb-2">Wizards</h2>
      <div className="text-cyan-300 py-2">
        <h3 className="text-xl">Air</h3>
        <p className="text-sm">Air Wizards ignore terrain penalties.</p>
        <WizardGroup wizardRow={wizards.air} />
      </div>
      <div className="text-emerald-400 py-2">
        <h3 className="text-xl">Earth</h3>
        <p className="text-sm">Earth wizards are more hardy.</p>
        <WizardGroup wizardRow={wizards.earth} />
      </div>
      <div className="text-orange-500 py-2">
        <h3 className="text-xl">Fire</h3>
        <p className="text-sm">Fire wizards complete tasks faster.</p>
        <WizardGroup wizardRow={wizards.fire} />
      </div>
      <div className="text-blue-400 py-2">
        <h3 className="text-xl">Water</h3>
        <p className="text-sm">Water wizards earn reputation faster.</p>
        <WizardGroup wizardRow={wizards.water} />
      </div>
    </div>
  );
};

export const WizardGroup: React.FC<{ wizardRow: Wizard[] }> = (props) => {
  const idleWizards = props.wizardRow.filter(
    (wizard) => wizard.status === 'idle'
  );
  const awayWizards = props.wizardRow.filter(
    (wizard) => wizard.status === 'away'
  );

  return (
    <div className="flex flex-wrap items-center justify-start mb-4">
      {idleWizards.map((wizard) => (
        <WizardProfile key={wizard.name} wizard={wizard} />
      ))}
      {awayWizards.map((wizard) => (
        <WizardProfile key={wizard.name} wizard={wizard} />
      ))}
    </div>
  );
};
