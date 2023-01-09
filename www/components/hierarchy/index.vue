<template>
  <div class="hierarchy">
    <div class="hierarchy__header">
      <div class="header__actions">
        <div class="header__actions-button">
          <i class="actions__button-label bi-gear-fill"></i>
        </div>
      </div>
    </div>
    <div class="hierarchy__content">
      <slot>
        <tree-view label="Example" :nodes="state.nodes" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import TreeView from "./treeview.vue";

export default defineComponent({
  name: "Hierarchy",
  components: {
    TreeView,
  },

  methods: {
    select() {
      console.log("hello");
    },
  },

  setup() {
    const state = reactive({
      nodes: [
        {
          id: Math.random().toString(36).substr(2, 9),
          label: "All",
          collapsed: false,
          type: "group",
          children: [
            {
              id: Math.random().toString(36).substr(2, 9),
              label: "Apps",
              type: "folder",
              collapsed: false,
              children: [
                {
                  id: Math.random().toString(36).substr(2, 9),
                  label: "Google Chrome",
                  type: "app",

                  children: [
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      label: "sale-me.com",
                      type: "url",
                    },
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      label: "github.com",
                      type: "url",
                    },
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      label: "api.github.com",
                      type: "url",
                    },
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      label: "stackoverflow.com",
                      type: "url",
                    },
                  ],
                },
              ],
            },
            {
              id: Math.random().toString(36).substr(2, 9),
              label: "Domains",
              type: "domains",
              icon: "bi-globe",
              collapsed: false,
              children: [
                {
                  id: Math.random().toString(36).substr(2, 9),
                  label: "google.ru",
                  type: "url",
                },
                {
                  id: Math.random().toString(36).substr(2, 9),
                  label: "icons.getbootstrap.com",
                  type: "url",
                },
              ],
            },
          ],
        },
      ],
    });

    return {
      state,
    };
  },
});
</script>

<style scoped lang="scss">
.hierarchy {
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;

  flex-direction: column;
  border-right: var(--container-border-width) solid
    var(--container-border-color);

  &__header {
    border-bottom: var(--container-border-width) solid
      var(--container-border-color);

    height: var(--header-height);
    max-height: var(--header-height);
    min-height: var(--header-height);

    .header__actions {
      width: auto;
      height: 100%;
      background-color: transparent;
      align-items: center;
      display: flex;
      margin-right: 7.5px;
      justify-content: end;

      .header__actions-button {
        width: 30px;
        height: 30px;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        cursor: pointer;

        .actions__button-label {
          color: #606060;
          font-size: 14px;
        }

        &:nth-of-type(n + 2) {
          margin-left: 5px;
        }

        &:hover {
          background-color: #e7e7e7;
        }
      }
    }
  }
}
</style>
