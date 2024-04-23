import { VNode } from 'preact';
import {
  Children,
  ComponentType,
  ReactNode,
  isValidElement,
  useMemo,
} from 'preact/compat';

export default function useFindNestedChildren<P extends {}>(
  children: ReactNode,
  Component: ComponentType<P> | ComponentType<P>[]
): VNode<P>[] {
  return useMemo(() => {
    const foundChildren: VNode<P>[] = [];
    let childStack = Children.toArray(children).reverse();
    const Components = Array.isArray(Component) ? Component : [Component];

    while (childStack.length > 0) {
      const child = childStack.pop();
      if (child != null && isValidElement(child)) {
        if (Components.includes(child.type as any)) {
          foundChildren.push(child as VNode<P>);
        } else if ('children' in child.props) {
          childStack = childStack.concat(
            Children.toArray(child.props.children).reverse()
          );
        }
      }
    }

    return foundChildren;
  }, [Component, children]);
}
