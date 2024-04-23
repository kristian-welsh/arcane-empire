import { ReactElement, useMemo } from 'preact/compat';

type Color = 'red' | 'green' | 'blue' | 'yellow' | 'slate';

type BadgeProps = {
  color: Color;
  onClick?: (evt: MouseEvent) => void;
} & ({ children: ReactElement } | { text: string });

export default function Badge(props: BadgeProps): ReactElement {
  const { color, onClick } = props;

  const className = useMemo(
    () =>
      onClick != null
        ? `hover:bg-${color}-700 bg-${color}-500 rounded-lg py-2 px-4 font-bold`
        : `bg-${color}-500 rounded-lg py-2 px-4 font-bold`,
    [color]
  );

  return onClick != null ? (
    <button className={className} onClick={onClick}>
      {'text' in props ? props.text : props.children}
    </button>
  ) : (
    <div className={className}>
      {'text' in props ? props.text : props.children}
    </div>
  );
}
