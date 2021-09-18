<template>
  <v-container v-if="layout.visible" :class="styles.horizontalLayout.root">
    <v-row>
      <v-col
        v-for="(element, index) in layoutUiSchema.elements"
        :key="`${layout.path}-${index}`" :class="styles.horizontalLayout.item"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  uiTypeIs,
  JsonFormsRendererRegistryEntry,
  Layout,
  HorizontalLayout,
  rankWith,
} from "@jsonforms/core";
import { defineComponent } from "../../config/vue";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from "../../config/jsonforms";
import { useVuetifyLayout } from "../util";
import { VContainer, VRow, VCol } from "vuetify/lib";

const layoutRenderer = defineComponent({
  name: "horizontal-layout-renderer",
  components: {
    DispatchRenderer,
    VContainer,
    VRow,
    VCol,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    layoutUiSchema(): HorizontalLayout {
      return this.layout.uischema as HorizontalLayout;
    },
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, uiTypeIs("HorizontalLayout")),
};
</script>
