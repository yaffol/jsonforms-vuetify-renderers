<template>
  <v-card elevation="2">
    <v-card-text>
      this is the object elevated renderer
      <dispatch-renderer
        :schema="control.schema"
        :uischema="detailUiSchema"
        :path="control.path"
        :enabled="enabled"
        :renderers="renderers"
        :cells="cells"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  ControlElement,
  isObjectControl,
  findUISchema,
  UISchemaElement,
  GroupLayout,
} from '@jsonforms/core';
import {
  RendererProps,
  rendererProps,
  useJsonFormsControlWithDetail,
  DispatchRenderer,
} from '@jsonforms/vue2';
import { defineComponent } from '@vue/composition-api';
import { VCard, VCardText } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'object-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardText,
  },
  props: {
    ...rendererProps(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useJsonFormsControlWithDetail(props);
  },
  computed: {
    detailUiSchema(): UISchemaElement {
      const uischema = findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        'VerticalLayout',
        this.control.uischema,
        this.control.rootSchema
      );
      // TODO what shall be the default behavior
      uischema.options = {
        ...uischema.options,
        intented: true,
      };
      (uischema as GroupLayout).label = this.control.label;
      return uischema;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isObjectControl),
};
</script>
