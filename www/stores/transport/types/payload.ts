export interface Payload {
  name: string;

  handles: {
    [key: string]: {
      url: string;
      fingerprint: string;
      path?: string;
      method?: string;
      icon?: string;
      name?: string;
    };
  };
}
