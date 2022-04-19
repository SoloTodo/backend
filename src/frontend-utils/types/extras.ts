export type Option = {
  key?: number;
  text: string;
  path: string;
  hasPermission?: boolean;
  renderObject?: any
};

export type Detail = {
  key: string;
  label: string;
  renderData?: Function;
}