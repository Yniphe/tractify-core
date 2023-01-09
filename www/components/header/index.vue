<template>
  <div class="header">
    <div
      class="header__actions"
      v-bind:class="{ trafficOutside: uxState.windows.hierarchy.hidden }"
    >
      <div
        v-if="uxState.windows.hierarchy.hidden"
        class="header__actions-button"
      >
        <i class="actions__button-label bi-gear-fill"></i>
      </div>
      <div class="header__actions-button">
        <i class="actions__button-label bi-pause-fill"></i>
      </div>
      <div class="header__actions-button">
        <i class="actions__button-label bi-trash"></i>
      </div>
    </div>
    <div class="header__toolbox">
      <div class="header__toolbox-status">
        <span class="header__toolbox-status__host">
          <span class="header__toolbox-status__state"></span>
          Listening on: http://192.168.31.196:9000
        </span>
        <span class="header__toolbox-status__notification">5 New Updates</span>
      </div>
    </div>
    <div class="header__layout-actions">
      <div
        @click="onHierarchyVisible"
        class="header__actions-button"
        v-bind:class="{ focused: !uxState.windows.hierarchy.hidden }"
      >
        <i class="actions__button-label bi-layout-sidebar-inset"></i>
      </div>
      <div
        @click="onRequestInfoVisible"
        class="header__actions-button"
        v-bind:class="{ focused: !uxState.windows.requestInfo.hidden }"
      >
        <i class="actions__button-label bi-layout-sidebar-inset transform"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UXStore from "~/stores/ux";

export default defineComponent({
  name: "Header",
  components: {},

  computed: {
    uxState() {
      return UXStore.state;
    },
  },

  methods: {
    onHierarchyVisible() {
      UXStore.commit("setWindowVisibility", {
        name: "hierarchy",
        hidden: !this.uxState.windows.hierarchy.hidden,
      });
    },

    onRequestInfoVisible() {
      UXStore.commit("setWindowVisibility", {
        name: "requestInfo",
        hidden: !this.uxState.windows.requestInfo.hidden,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.header {
  height: var(--header-height);
  min-height: var(--header-height);
  max-height: var(--header-height);
  width: 100%;
  background-color: rgb(250, 248, 248);
  border-bottom: var(--container-border-width) solid
    var(--container-border-color);
  display: flex;

  .trafficOutside {
    margin-left: 92px;
  }

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
      font-size: 20px;

      &.bi-trash {
        font-size: 14px;
      }

      &.bi-gear-fill {
        font-size: 14px;
      }
    }

    &:nth-of-type(n + 2) {
      margin-left: 5px;
    }

    &:hover {
      background-color: #e7e7e7;
    }
  }

  &__actions {
    width: auto;
    height: 100%;
    background-color: transparent;
    align-items: center;
    display: flex;
    margin-left: 15px;
  }
  &__toolbox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;

    .header__toolbox-status {
      max-width: 500px;
      min-width: 350px;
      width: 80%;
      background-color: rgb(238, 234, 231);
      border-radius: 5px;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__state {
        width: 10px;
        height: 10px;
        background-color: #00ff00;
        border-radius: 50%;
        display: inline-block;
        margin-right: 5px;
      }

      &__host {
        color: #606060;
        font-size: 12px;
        margin-right: 5px;
      }

      &__notification {
        color: #606060;
        font-size: 12px;
        display: inline-block;
      }
    }
  }

  &__layout-actions {
    width: auto;
    height: 100%;
    background-color: transparent;
    align-items: center;
    display: flex;
    margin-right: 15px;

    .header__actions-button {
      .actions__button-label {
        color: rgb(198, 198, 198);
      }

      &.focused {
        background-color: #e7e7e7;

        .actions__button-label {
          color: #606060;
        }
      }

      .actions__button-label {
        &.bi-layout-sidebar-inset {
          font-size: 16px;

          &.transform {
            transform: rotate(270deg) scale(0.9, 1.1);
          }
        }
      }
    }
  }
}
</style>
