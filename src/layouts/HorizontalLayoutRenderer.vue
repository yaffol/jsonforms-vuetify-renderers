<template>
  <v-layout v-if="layout.visible" row>
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
import { VContainer, VLayout, VFlex } from "vuetify/lib";

const layoutRenderer = defineComponent({
  name: "horizontal-layout-renderer",
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
