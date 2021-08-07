<template>

    <v-card v-if="layout.visible" :class="styles.group.root">
      <v-tabs v-model="activeCategory" :vertical="layout.direction == 'row'">
        <v-tab 
          v-for="(element, index) in visibleCategories"
          :key="`${layout.path}-${index}`"
        >
          {{ element.label }}
        </v-tab>
      </v-tabs>  

      <v-tabs-items v-model="activeCategory"> 
        <v-tab-item
          v-for="(element, index) in visibleCategories"
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
        </v-tab-item>
      </v-tabs-items>
    </v-card>   
    
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  and,
  uiTypeIs,
  Categorization,
  Category,
  UISchemaElement,
  Tester,
  isVisible,
  JsonFormsSubStates
} from "@jsonforms/core";
import { defineComponent, inject, ref } from "../../config/vue";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,

} from "../../config/jsonforms";
import { useVuetifyLayout } from "../util";

const layoutRenderer = defineComponent({
  name: "categorization-renderer",
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>()
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(0);

    return { ...useVuetifyLayout(useJsonFormsLayout(props)), activeCategory };
  },
  computed: {
    visibleCategories(): (Category | Categorization)[] {
      const jsonforms = inject<JsonFormsSubStates>('jsonforms');

      if (!jsonforms) {
        throw "'jsonforms' couldn't be injected. Are you within JSON Forms?";
      }

      return (this.layout.uischema as Categorization).elements.filter((category: (Category | Categorization)) => isVisible(category, this.layout.data, undefined, jsonforms?.core?.ajv));
    }
  },
});

export default layoutRenderer;

export const isSingleLevelCategorization: Tester = and(
  uiTypeIs("Categorization"),
  (uischema: UISchemaElement): boolean => {
    const categorization = uischema as Categorization;
    const reducer = (acc: boolean, e: (Category | Categorization)) => acc && e.type === 'Category';

    return categorization.elements && categorization.elements.reduce(reducer, true);
  }
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, isSingleLevelCategorization),
};
</script>
