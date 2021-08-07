<template>
  <fieldset v-if="layout.visible" :class="styles.group.root">
    <legend v-if="groupLayoutUiSchema.label" :class="styles.group.label">
      {{ groupLayoutUiSchema.label }}
    </legend>
    <div
      v-for="(element, index) in groupLayoutUiSchema.elements"
      :key="`${layout.path}-${index}`"
      :class="styles.group.item"
    >
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </div>
  </fieldset>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  GroupLayout,
  rankWith,
  and,
  isLayout,
  uiTypeIs
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps
} from '../../config/jsonforms';
import { useVuetifyLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'group-renderer',
  components: {
    DispatchRenderer
  },
  props: {
    ...rendererProps<Layout>()
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    groupLayoutUiSchema(): GroupLayout {
      return this.layout.uischema as GroupLayout
    }
  }  
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isLayout, uiTypeIs('Group')))
};
</script>
