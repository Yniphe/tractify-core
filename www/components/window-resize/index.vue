<template>
  <div class="window-resize" ref="content">
    <span
      @mousedown="onMouseDown"
      v-for="type in types"
      class="window-resize__line"
      v-bind:class="[type]"
      :ref="type"
    >
    </span>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    /**
     * @type {}
     */

    facets: { type: String as () => "t" | "l" | "tl" | "r", required: true },

    maxWidth: { type: Number, required: false },
    minWidth: { type: Number, required: false, default: 130 },
    width: { type: Number, required: false },

    maxHeight: { type: Number, required: false },
    minHeight: { type: Number, required: false, default: 130 },
    height: { type: Number, required: false },
  },

  setup() {
    return { element: undefined } as { element?: HTMLDivElement };
  },

  data() {
    return { focused: false } as {
      ro?: ResizeObserver;
      focused: boolean;
      target: string;
    };
  },

  computed: {
    types() {
      return this.getTypes().map((type) => "line_".concat(type));
    },
  },

  mounted() {
    this.ro = new ResizeObserver(this.onContentResize);
    this.element = this.$refs.content as HTMLDivElement;
    this.ro.observe(this.element);

    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));

    const height = Math.min(this.height ?? 0, this.maxHeight ?? 0) || undefined;
    const width = Math.min(this.width ?? 0, this.maxWidth ?? 0) || undefined;

    Object.assign(this.element.style, {
      width,
      minWidth: width,
      maxWidth: width,
      height,
      minHeight: height,
      maxHeight: height,
    });

    this.draw();
  },

  unmounted() {
    if (this.element) {
      this.ro?.unobserve(this.element);
    }

    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  },

  methods: {
    getTypes() {
      return this.facets.split("");
    },

    onMouseUp() {
      this.focused = false;
    },

    onMouseDown(event: MouseEvent) {
      this.focused = true;

      const target = event.target as Element;
      const targetId = target.classList.item(1)!;

      if (!this.types.includes(targetId)) {
        return;
      }

      this.target = targetId;
    },

    onMouseMove(event: MouseEvent) {
      if (!this.element?.style || !this.focused || !this.target) {
        return;
      }

      const { width, height, y, x } = this.element.getBoundingClientRect();

      if (this.target === "line_l") {
        if (this.minWidth / 2 > event.pageX) {
          this.$emit("onHidden");
        }

        if (this.minWidth && this.minWidth > width) {
          return;
        }

        if (this.maxWidth && this.maxWidth < width) {
          return;
        }

        const X = this.maxWidth
          ? Math.min(
              this.minWidth
                ? Math.max(this.minWidth, event.pageX)
                : event.pageX,
              this.maxWidth
            )
          : event.pageX;

        Object.assign(this.element.style, {
          width: X,
          minWidth: X,
          maxWidth: X,
        });
      } else if (this.target === "line_t") {
        const elementHeight = height + (y - event.pageY);

        if (this.minHeight / 2 > elementHeight) {
          this.$emit("onHidden");
        }

        if (this.minHeight && this.minHeight > height) {
          return;
        }

        if (this.maxHeight && this.maxHeight < height) {
          return;
        }

        const Y = this.maxHeight
          ? Math.min(
              this.minHeight
                ? Math.max(this.minHeight, elementHeight)
                : elementHeight,
              this.maxHeight
            )
          : elementHeight;

        Object.assign(this.element.style, {
          height: Y,
          minHeight: Y,
          maxHeight: Y,
        });
      } else if (this.target === "line_r") {
        const elementWidth = width + (x - event.pageX);

        if (this.minWidth / 2 > elementWidth) {
          this.$emit("onHidden");
        }

        if (this.minWidth && this.minWidth > elementWidth) {
          return;
        }

        if (this.maxWidth && this.maxWidth < elementWidth) {
          return;
        }

        console.log("work");

        const X = this.maxWidth
          ? Math.min(
              this.minWidth
                ? Math.max(this.minWidth, elementWidth)
                : elementWidth,
              this.maxWidth
            )
          : elementWidth;

        Object.assign(this.element.style, {
          width: X,
          minWidth: X,
          maxWidth: X,
        });
      }
    },

    onContentResize() {
      this.draw();
    },

    draw() {
      const { width, height } = this.element!.getBoundingClientRect();
      const types = this.getTypes();

      if (types.includes("l")) {
        const [line] = this.$refs.line_l as HTMLDivElement[];

        Object.assign(line.style, {
          width: 5,
          height: height,
          marginLeft: width - 2.5,
        });
      }

      if (types.includes("t")) {
        const [line] = this.$refs.line_t as HTMLDivElement[];

        Object.assign(line.style, {
          width: width,
          height: 5,
          marginTop: -2.5,
        });
      }

      if (types.includes("r")) {
        const [line] = this.$refs.line_r as HTMLDivElement[];

        Object.assign(line.style, {
          width: 5,
          height: height,
          marginRight: -2.5,
        });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.window-resize {
  width: inherit;

  &__line {
    background-color: transparent;
    position: fixed;
    z-index: 2;

    &.line_l,
    &.line_r {
      cursor: col-resize;
    }

    &.line_t,
    &.line_b {
      cursor: row-resize;
    }
  }
}
</style>
