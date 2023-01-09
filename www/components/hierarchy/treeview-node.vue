<template>
  <template v-for="node in nodes">
    <li
      class="tree-view-node"
      v-bind:class="[
        viewDepthSelector,
        { focused: node.id === selectedNodeId },
      ]"
      @dblclick="node.children && (node.collapsed = !node.collapsed)"
      @click="onSelect(node)"
    >
      <span class="tree-view-node__label">
        <span v-if="node.children" @click="node.collapsed = !node.collapsed">
          <div class="icon bi-chevron-right" v-if="node.collapsed"></div>
          <div class="icon bi-chevron-down" v-else></div>
        </span>
        <div
          class="icon"
          v-bind:class="[
            node.type === 'folder'
              ? 'bi-stack'
              : node.type === 'app'
              ? 'bi-browser-chrome'
              : node.type === 'url'
              ? 'bi-link-45deg'
              : node.icon,
          ]"
        ></div>

        <span class="tree-view-node__label-text">
          {{ node.label }}
        </span>
      </span>
    </li>
    <transition-group
      @enter="onEnter"
      @before-enter="onBeforeEnter"
      @leave="onLeave"
    >
      <div
        v-if="node.children && !node.collapsed"
        class="tractify-list-animate"
      >
        <tree-view-node
          v-for="children in node.children"
          :nodes="[children]"
          :depth="depth + 1"
        ></tree-view-node>
      </div>
    </transition-group>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import hierarchyStore from "~/stores/hierarchy";
import gsap from "gsap";

export default defineComponent({
  name: "TreeViewNode",
  props: {
    nodes: { type: Object, required: true },
    depth: { type: Number, required: false, default: 0 },
  },
  computed: {
    viewDepthSelector(): string {
      return `depth-offset-${this.depth}`;
    },

    selectedNodeId(): string | undefined {
      return hierarchyStore.state.selectedNodeId;
    },
  },

  methods: {
    onSelect(node: { id: string }) {
      hierarchyStore.commit("selectNode", node.id);
    },

    onLeave(el: Element, done: gsap.Callback) {
      gsap.to(el, {
        duration: 0.15,
        ease: "circ.out",
        onComplete: done,
        height: 0,
      });
    },

    onEnter(el: Element, done: gsap.Callback) {
      gsap.to(el, {
        duration: 0.15,
        ease: "circ.inOut",
        onComplete: done,
        height: "auto",
      });
    },

    onBeforeEnter(el: Element) {
      const element = el as HTMLElement;
      element.style.height = "0";
    },
  },
});
</script>

<style lang="scss" scoped>
.tree-view-node {
  font-size: 13px;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: transparent;
  color: #3e3e3e;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 5px;

  &__label {
    padding-left: 10px;
    padding-right: 15px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: start;

    &-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 2px;
      font-size: 13px;
    }

    .icon {
      font-size: 12px;
      margin-right: 5px;
      width: 12px;
      height: 12px;
      color: #4a4646;
    }
  }

  &.focused {
    background-color: rgb(236, 236, 236);
  }

  @for $i from 0 through 20 {
    &.depth-offset-#{$i} {
      padding-left: 10px * $i;
    }
  }
}
</style>
