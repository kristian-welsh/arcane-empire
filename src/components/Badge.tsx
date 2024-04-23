import { ReactElement, useMemo } from 'preact/compat';
import { twMerge } from 'tailwind-merge';

type Color = 'red' | 'green' | 'blue' | 'yellow' | 'slate';

type BadgeProps = {
  color?: Color;
  onClick?: (evt: MouseEvent) => void;
  className?: string;
} & ({ children: ReactElement } | { text: string });

export default function Badge(props: BadgeProps): ReactElement {
  const { color, onClick, className } = props;

  const otherClassName = useMemo(
    () =>
      onClick != null
        ? `hover:bg-${color}-700 bg-${color}-500 rounded-lg py-[0.5px] px-3 font-bold`
        : `py-[0.5px] px-2 font-bold`,
    [color]
  );

  return onClick != null ? (
    <button
      className={twMerge(className, otherClassName)}
      onClick={onClick}
      style="letter-spacing: 0.03em;"
    >
      {'text' in props ? props.text : props.children}
    </button>
  ) : (
    <div
      className={twMerge(className, otherClassName)}
      style="letter-spacing: 0.06em;"
    >
      {'text' in props ? props.text : props.children}
    </div>
  );
}
