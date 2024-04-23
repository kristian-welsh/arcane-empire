import { ReactElement, ReactNode } from 'preact/compat';

export interface TabProps {
  id: string;
  className?: string;
  button: (selected: boolean, onSelect: () => void) => ReactNode;
  children: ReactNode;
}

export default function Tab(props: TabProps): ReactElement {
  const { id, className, button: _button, children } = props;

  return (
    <div className={className} data-tab-id={id}>
      {children}
    </div>
  );
}
