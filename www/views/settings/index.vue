<script lang="tsx">
import { defineComponent, reactive } from "vue";

const content = reactive({ message: "Hello, World!" });

export default defineComponent({
  template: '<div class="Hello, World!">{{content.message}}</div>',
});
</script>
