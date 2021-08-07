<template>
  <div v-if="layout.visible" :class="styles.group.root">
    <v-stepper
      non-linear
      v-model="activeCategory"
      :vertical="layout.direction == 'row'"
    >
      <v-stepper-header>
        <template v-for="(element, index) in visibleCategories">
          <v-stepper-step :key="`${layout.path}-${index}`" :step="index">
            {{ element.label }}
          </v-stepper-step>
          <v-divider v-if="index !== visibleCategories.length - 1" :key="index"></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content
          v-for="(element, index) in visibleCategories"
          :key="`${layout.path}-${index}`"
          :step="index"
        >
          <v-card elevation="0">
            <dispatch-renderer
              :schema="layout.schema"
              :uischema="element"
              :path="layout.path"
              :enabled="layout.enabled"
              :renderers="layout.renderers"
              :cells="layout.cells"
            />

            <div v-if="!!appliedOptions.showNavButtons">
              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  text
                  rigtht
                  color="primary"
                  :disabled="activeCategory >= visibleCategories.length - 1"
                  @click="activeCategory++"
                >
                  Next
                </v-btn>

                <v-btn
                  text
                  left
                  color="secondary"
                  :disabled="activeCategory <= 0"
                  @click="activeCategory--"
                >
                  Previous
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
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
  optionIs,
  Tester,
  isVisible,
  JsonFormsSubStates,
  categorizationHasCategory,
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
  name: "categorization-stepper-renderer",
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(0);

    return { ...useVuetifyLayout(useJsonFormsLayout(props)), activeCategory };
  },
  computed: {
    visibleCategories(): (Category | Categorization)[] {
      const jsonforms = inject<JsonFormsSubStates>("jsonforms");

      if (!jsonforms) {
        throw "'jsonforms' couldn't be injected. Are you within JSON Forms?";
      }

      return (this.layout.uischema as Categorization).elements.filter(
        (category: Category | Categorization) =>
          isVisible(category, this.layout.data, undefined, jsonforms?.core?.ajv)
      );
    },
  },
});

export default layoutRenderer;

export const categorizationStepperTester: Tester = and(
  uiTypeIs("Categorization"),
  categorizationHasCategory,
  optionIs("variant", "stepper")
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(3, categorizationStepperTester),
};
</script>
