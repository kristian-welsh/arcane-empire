import { ReactElement, useCallback, useEffect, useRef } from 'preact/compat';
import useFindNestedChildren from '../hooks/useFindNestedChildren';
import Tab, { TabProps } from './Tab';
import { VNode } from 'preact';

interface TabsProps {
  initialSelected?: string;
  className?: string;
  children: VNode<TabProps> | VNode<TabProps>[];
  selected: string;
  setSelected: (id: string) => void;
}

export default function Tabs(props: TabsProps): ReactElement {
  const { className, children, selected, setSelected } = props;

  const tabChildren = useFindNestedChildren(children, Tab);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current != null) {
      [...panelRef.current.children].forEach((el) => {
        const id = el.getAttribute('data-tab-id');
        if (id != null && id !== selected) {
          el.classList.add('hidden');
        }
      });
    }
  }, [panelRef.current]);

  const onSelect = useCallback(
    (id: string) => {
      if (panelRef.current != null) {
        const children = [...panelRef.current.children];
        children
          .find((el) => el.getAttribute('data-tab-id') === selected)
          ?.classList.add('hidden');
        children
          .find((el) => el.getAttribute('data-tab-id') === id)
          ?.classList.remove('hidden');
        setSelected(id);
      }
    },
    [panelRef.current, selected]
  );

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex grow-0 shrink-0 flex-row gap-x-0.5">
        {tabChildren.map((child) =>
          child.props.button(child.props.id === selected, () =>
            onSelect(child.props.id)
          )
        )}
      </div>
      <div className="grow shrink" ref={panelRef}>
        {children}
      </div>
    </div>
  );
}
