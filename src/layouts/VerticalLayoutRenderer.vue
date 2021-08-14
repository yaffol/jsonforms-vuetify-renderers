<template>
  <v-container v-if="layout.visible" fluid>
    <v-layout column>
      <v-flex
        v-for="(element, index) in layoutUiSchema.elements"
        :key="`${layout.path}-${index}`"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import {
  uiTypeIs,
  JsonFormsRendererRegistryEntry,
  Layout,
  VerticalLayout,
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
import { VContainer, VLayout, VFlex } from "vuetify/lib";

const layoutRenderer = defineComponent({
  name: "vertical-layout-renderer",
  components: {
    DispatchRenderer,
    VContainer,
    VLayout,
    VFlex,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    layoutUiSchema(): VerticalLayout {
      return this.layout.uischema as VerticalLayout;
    },
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, uiTypeIs("VerticalLayout")),
};
</script>
