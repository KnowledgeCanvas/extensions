

export type ChromeTab = {
  executeScript: (args: any, callback: (_: any) => any) => any;
  favIconUrl: any;
  query: (_: any) => any;
  reload: () => any;
  id: any;
  title: string;
  url: string;
  remove: () => any;
  sendMessage: () => any;
  setZoom: () => any;
  setZoomSettings: () => any;
  ungroup: () => any;
  update: () => any
}

export type FirefoxTab = {
  query: any;
}
