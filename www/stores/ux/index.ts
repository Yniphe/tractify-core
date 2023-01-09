import { createStore } from "vuex";
import { UXOptions } from "./interfaces/options";

export default createStore<UXOptions>({
  state: {
    windows: {
      hierarchy: { hidden: false },
      requestInfo: { hidden: false },
    },
  },

  mutations: {
    setWindowVisibility(
      state,
      payload: { name: "hierarchy" | "requestInfo"; hidden: boolean }
    ) {
      if (state.windows[payload.name]) {
        state.windows[payload.name].hidden = payload.hidden;
      }
    },
  },
});
