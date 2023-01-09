<template>
  <div class="table-view" ref="viewport" @wheel="onScrollViewport">
    <table>
      <thead>
        <tr>
          <th v-for="header in headers">{{ header.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in content" v-bind:class="[custom]">
          <td v-for="header in headers">
            {{ row[header.property] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import transportStorage from "~/stores/transport";

export default defineComponent({
  name: "TableView",

  props: {
    headers: {
      type: Array<{ label: string; property: string }>,
      required: true,
    },
    content: { type: Array<{ [p: string]: string }>, required: true },
    custom: {
      type: String as () => "none" | "stripped",
      required: false,
      default: "none",
    },
  },

  mounted() {
    document.addEventListener("proxy->handle", (event) => {
      console.log("message");
      transportStorage.dispatch("proxyHandle", event);
    });
  },

  unmounted() {
    document.removeEventListener("proxy->handle", (event) =>
      transportStorage.dispatch("proxyHandle", event)
    );
  },

  updated() {
    if (this.scrollAnchor) {
      const element = this.$refs?.viewport as HTMLDivElement;
      element.scrollTop = element.scrollHeight;
    }
  },

  setup() {
    const handles = transportStorage.state.handles;
    const scrollAnchor = true;

    return {
      scrollAnchor,
      handles,
    };
  },

  methods: {
    onScrollViewport(event: Event) {
      const element = this.$refs?.viewport as HTMLDivElement;

      this.scrollAnchor =
        element.scrollHeight - element.scrollTop - element.clientHeight <= 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.table-view {
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  background-color: rgb(255, 255, 255);

  table {
    border-spacing: 0;

    thead {
      position: sticky;

      tr > th {
        background-color: rgb(250, 248, 248);
        min-width: 200px;
        border-left: 0.5px solid rgb(201, 201, 201);
        text-align: start;
        font-size: 13px;
        font-weight: bold;
        top: 0;
        position: sticky;
        padding: 3px 10px 3px 10px;
        width: 200px;
        max-width: 200px;

        &:last-of-type {
          width: 100%;
        }

        &:first-of-type {
          border-left: none;
        }

        border-bottom: 0.5px solid rgb(201, 201, 201);
      }
    }

    tbody {
      tr {
        cursor: pointer;

        td {
          font-size: 11.5px;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 10px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: inherit;
          max-width: inherit;

          width: 200px;
          max-width: 200px;

          .application-icon {
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-size: 100%;
          }
        }

        &.stripped {
          &:nth-of-type(odd) {
            background-color: rgb(241, 241, 241);
          }
        }
      }
    }
  }
}
</style>
