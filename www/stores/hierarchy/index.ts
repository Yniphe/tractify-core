import { createStore } from "vuex";
import { Hierarchy } from "./types/hierarchy";

export default createStore<Hierarchy>({
  state: {},

  mutations: {
    selectNode(state, nodeId: string) {
      state.selectedNodeId = nodeId;
    },
  },
});
