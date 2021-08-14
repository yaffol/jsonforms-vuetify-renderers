<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-select
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :label="control.label"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :readonly="appliedOptions.readonly"

      v-model="control.data"

      :items="options"
      item-text="label"
      item-value="value"

      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

  </control-wrapper>
</template>

<script lang="ts">
import {
  EnumOption,
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isOneOfEnumControl
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import { rendererProps, useJsonFormsOneOfEnumControl, RendererProps } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VSelect } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'enum-oneof-control-renderer',
  components: {
    ControlWrapper,
    VSelect
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsOneOfEnumControl(props));
  },
  computed: {
    options(): EnumOption[] {
      return [ {label : '', value: ''}, ...this.control.options ];
    }
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isOneOfEnumControl)
};
</script>
