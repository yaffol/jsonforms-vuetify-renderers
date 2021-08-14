<template>
  <v-label v-if="layout.visible" :class="styles.label.root">
    {{ this.layoutUiSchema.text }}
  </v-label>
  <!--
  <label v-if="layout.visible" :class="styles.label.root">
    {{ this.layout.uischema.text }}
  </label>
  -->
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  uiTypeIs,
  LabelElement,
} from "@jsonforms/core";
import { defineComponent } from "../../config/vue";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from "../../config/jsonforms";
import { useVuetifyLayout } from "../util";
import { VLabel } from "vuetify/lib";

const labelRenderer = defineComponent({
  name: "label-renderer",
  components: {
    DispatchRenderer,
    VLabel,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    // reuse layout bindings for label
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    layoutUiSchema(): LabelElement {
      return this.layout.uischema as LabelElement;
    },
  },
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: labelRenderer,
  tester: rankWith(1, uiTypeIs("Label")),
};
</script>
