<template>
  <v-card :elevation="nesting">
    <v-card-title>
      {{ control.label }}
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" class="ml-2"
            >mdi-information-outline</v-icon
          >
        </template>
        <span>{{ control.description }}</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>
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
import { VCard, VCardText, VCardTitle, VTooltip, VIcon } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'object-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardText,
    VCardTitle,
    VTooltip,
    VIcon,
  },
  props: {
    ...rendererProps(),
  },
  setup(props: RendererProps<ControlElement>) {
    const p = useJsonFormsControlWithDetail(props);
    const control: any = p.control;
    const nesting = control.value.path.split('.').length - 1 > 0 ? 0 : 1;
    return { nesting, ...p };
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
