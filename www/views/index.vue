<template>
  <div class="container">
    <window-resize
      facets="l"
      :width="300"
      :max-width="450"
      @onHidden="onHierarchyHidden"
      v-if="!uxState.windows.hierarchy.hidden"
    >
      <hierarchy />
    </window-resize>

    <div class="container__content">
      <Header class="container__content-header" />
      <div class="container__content-viewport">
        <table-view
          custom="stripped"
          :headers="[
            { label: 'ID', property: 'id' },
            { label: 'URL', property: 'url' },
            { label: 'Client', property: 'client' },
            { label: 'Method', property: 'method' },
            { label: 'Status', property: 'status' },
            { label: 'Code', property: 'code' },
            { label: 'Time', property: 'time' },
            { label: 'Duration', property: 'duration' },
            { label: 'Request', property: 'request' },
            { label: 'Response', property: 'response' },
            { label: 'SSL', property: 'ssl' },
          ]"
          :content="
            new Array(100).fill({
              id: 1,
              url: 'https://google.com',
              client: 'Postman',
              method: 'GET',
              status: '200',
              code: 'OK',
              time: '2021-01-01 00:00:00',
              duration: '0.1',
              request: '0.1',
              response: '0.1',
              ssl: '0.1',
            })
          "
        />
        <window-resize
          facets="t"
          :height="300"
          :max-height="500"
          :min-height="300"
          @onHidden="onRequestInfoHidden"
          v-if="!uxState.windows.requestInfo.hidden"
        >
          <request-details />
        </window-resize>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "~/components/header";
import Hierarchy from "~/components/hierarchy";
import TableView from "~/components/table-view";
import RequestDetails from "~/components/request-details";
import WindowResize from "~/components/window-resize";
import hierarchy from "~/stores/hierarchy";
import UXStore from "~/stores/ux";

export default defineComponent({
  name: "Index",
  components: {
    Header,
    Hierarchy,
    TableView,
    RequestDetails,
    WindowResize,
  },

  computed: {
    uxState() {
      return UXStore.state;
    },
  },

  methods: {
    onHierarchyHidden() {
      UXStore.commit("setWindowVisibility", {
        name: "hierarchy",
        hidden: true,
      });
    },

    onRequestInfoHidden() {
      UXStore.commit("setWindowVisibility", {
        name: "requestInfo",
        hidden: true,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  background-color: transparent;
  z-index: 1;
  width: 100%;
  height: 100%;

  &__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-self: start;
    background-color: rgb(239, 239, 239);

    &-viewport {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
