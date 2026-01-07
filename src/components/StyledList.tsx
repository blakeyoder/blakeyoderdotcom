import {
  Children,
  ReactNode,
  isValidElement,
  cloneElement,
  ReactElement,
} from "react";

interface StyledListProps {
  children: ReactNode;
  variant?: "bordered" | "sidebar";
}

interface StyledListItemProps {
  children: ReactNode;
  isLast?: boolean;
  variant?: "bordered" | "sidebar";
}

export function StyledList({
  children,
  variant = "bordered",
}: StyledListProps) {
  const childArray = Children.toArray(children);
  const lastIndex = childArray.length - 1;

  return (
    <ul className="list-none p-0 m-0">
      {Children.map(children, (child, index) => {
        if (isValidElement(child) && child.type === StyledListItem) {
          return cloneElement(child as ReactElement<StyledListItemProps>, {
            isLast: index === lastIndex,
            variant,
          });
        }
        return child;
      })}
    </ul>
  );
}

export function StyledListItem({
  children,
  isLast = false,
  variant = "bordered",
}: StyledListItemProps) {
  if (variant === "sidebar") {
    return (
      <li
        className={`pl-4 border-l-2 border-border text-text-secondary leading-relaxed ${
          isLast ? "" : "mb-5"
        }`}
      >
        {children}
      </li>
    );
  }

  return (
    <li className={`${isLast ? "" : "pb-4 mb-4 border-b border-border"}`}>
      {children}
    </li>
  );
}
