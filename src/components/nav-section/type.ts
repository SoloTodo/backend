import { ReactElement } from "react";
import { BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

export type NavListPropsChildren = {
  title: string;
  path: string;
  children?: { title: string; path: string }[];
  hasPermission?: string
}

export type NavListProps = {
  title: string;
  path: string;
  icon?: ReactElement;
  info?: ReactElement;
  hasPermission?: string;
  children?: NavListPropsChildren[];
};

export type NavItemProps = {
  item: NavListProps;
  isCollapse?: boolean;
  active?: boolean | undefined;
  open?: boolean;
  onOpen?: VoidFunction;
  onMouseEnter?: VoidFunction;
  onMouseLeave?: VoidFunction;
};

export interface NavSectionProps extends BoxProps {
  isCollapse?: boolean;
  navConfig: {
    subheader: string;
    items: NavListProps[];
  }[];
}
