<template>
  <ul class="tree-view">
    <template v-for="node in nodes">
      <div class="tree-view__label">
        <span>{{ node.label }}</span>
      </div>

      <tree-view-node :nodes="node.children"></tree-view-node>
    </template>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TreeViewNode from "./treeview-node.vue";

export default defineComponent({
  name: "TreeView",
  components: { TreeViewNode },
  props: {
    nodes: { type: Object, required: true },
  },

  methods: {
    select() {
      console.log("hello");
    },
  },
});
</script>

<style lang="scss" scoped>
.tree-view {
  margin: 0;
  padding: 15px;
  list-style-type: none;

  &__label {
    font-size: 12px;
    padding-bottom: 5px;
    color: #646464;
    display: flex;
    justify-content: space-between;
  }
}
</style>
