<template>
  <div class="request">
    <div class="request__header">
      <span class="request__header-label">GET</span>
      <span class="request__header-label success">200</span>

      <span class="request__header-link"
        >https://vk.com/users?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan?search=ivan</span
      >
    </div>
    <div class="request__content">
      <window-resize facets="l" :min-width="500" :width="500">
        <div class="request__content-block">
          <div class="request__content-block-header">
            <span class="request__content-block-header-label">Request</span>
            <div class="request__content-block-header-content-tabs">
              <span class="request__content-block-header-content-tabs-item">
                Headers
              </span>
              <span class="request__content-block-header-content-tabs-item"
                >Body</span
              >
              <span class="request__content-block-header-content-tabs-item"
                >Raw</span
              >
            </div>
          </div>
          <div class="request__content-block-content">
            <!-- <div class="request__content-block-content-viewport" id="headers">
            <table-view
              :headers="[
                { label: 'Key', property: 'key' },
                { label: 'Value', property: 'value' },
              ]"
              :content="[
                {
                  key: 'Content-Type',
                  value: 'application/json',
                },
                {
                  key: 'User-Agent',
                  value: 'PostmanRuntime/7.30.0',
                },
                {
                  key: 'Accept-Encoding',
                  value: 'gzip, deflate, br',
                },
                {
                  key: 'Connection',
                  value: 'keep-alive',
                },
              ]"
            ></table-view>
          </div> -->
            <div class="request__content-block-content-viewport" id="body">
              <span class="hljs-punctuation">{</span>
              <span class="hljs-attr">&quot;test&quot;</span
              ><span class="hljs-punctuation">:</span>
              <span class="hljs-string">&quot;Hello, World!&quot;</span
              ><span class="hljs-punctuation">,</span>
              <span class="hljs-attr">&quot;name&quot;</span
              ><span class="hljs-punctuation">:</span>
              <span class="hljs-string">&quot;test&quot;</span>
              <span class="hljs-punctuation">}</span>
            </div>
          </div>
        </div>
      </window-resize>

      <div class="request__content-block">
        <div class="request__content-block-header">
          <span class="request__content-block-header-label">Response</span>
        </div>
        <div class="request__content-block-content"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import WindowResize from "~/components/window-resize";
import TableView from "~/components/table-view";

export default defineComponent({
  name: "RequestDetails",
  components: {
    WindowResize,
    TableView,
  },
});
</script>

<style lang="scss" scoped>
$header-height: 30px;
$header-background-color: rgb(239, 239, 239);

.request {
  width: 100%;
  height: 100%;
  background-color: #fff;

  &__header {
    width: 100%;
    font-size: 11px;
    background-color: $header-background-color;
    max-height: $header-height;
    height: $header-height;
    min-height: $header-height;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0 10px;
    border-top: var(--container-border-width) solid
      var(--container-border-color);

    &-label {
      padding: 2.5px 5px;
      background-color: rgb(218, 218, 218);
      border-radius: 4px;
      font-weight: bold;
      color: rgb(118, 118, 118);

      &.success {
        color: rgb(255, 255, 255);
        background-color: rgb(22, 217, 71);
      }

      &:nth-of-type(n + 2) {
        margin-left: 5px;
      }
    }

    &-link {
      margin-left: 10px;
      color: rgb(0, 0, 238);
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__content {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    &-block {
      height: 100%;
      width: 100%;
      background-color: white;

      &:first-of-type {
        border-right: var(--container-border-width) solid
          var(--container-border-color);
      }

      &-content {
        height: calc(100% - #{$header-height + 30});
        width: 100%;

        &-viewport {
          height: 100%;
          width: 100%;
          overflow: auto;
          user-select: text;

          &#body {
            padding: 5px;
          }
        }
      }
    }

    &-block-header {
      width: 100%;
      height: $header-height;
      max-height: $header-height;
      min-height: $header-height;
      background-color: $header-background-color;
      display: flex;
      justify-content: start;
      align-items: center;
      padding: 0 10px;
      border-top: var(--container-border-width) solid
        var(--container-border-color);
      border-bottom: var(--container-border-width) solid
        var(--container-border-color);

      &-label {
        font-size: 11px;
        font-weight: bold;
        color: rgb(118, 118, 118);
      }

      &-content-tabs {
        margin-left: 10px;
        display: flex;
        justify-content: start;
        align-items: center;

        &-item {
          font-size: 13px;
          padding: 2.5px 5px;
          border-radius: 4px;
          color: rgb(118, 118, 118);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
