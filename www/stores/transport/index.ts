import { createStore } from "vuex";
import { Payload } from "./types/payload";

export default createStore<Payload>({
  state: { name: "Ivan Chikishev", handles: {} },

  actions: {
    proxyHandle(store, event: any) {
      const { fingerprint, connect, request, response, properties } =
        event.detail as any;

      if (!store.state.handles[fingerprint]) {
        store.state.handles[fingerprint] = {
          fingerprint: fingerprint as string,
          url: request?.host || connect?.host,
        };
      }

      const handle = store.state.handles[fingerprint];

      handle.path = request?.path;
      handle.method = request?.method ?? "CONNECT";

      if (properties.icon) {
        handle.icon = `data:image/png;base64, ${properties.icon}`;
      }

      if (properties.name) {
        handle.name = properties.name;
      }
    },
  },
});
