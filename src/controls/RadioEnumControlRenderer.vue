<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >

    <v-radio-group 
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

      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      >

      <v-radio
        v-for="o in control.options"
        :key="o.value"
        :label="o.label"
        :value="o.value"
      ></v-radio>
    </v-radio-group>


  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isEnumControl,
  optionIs,
  and
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import { rendererProps, useJsonFormsEnumControl, RendererProps } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';

const controlRenderer = defineComponent({
  name: 'radio-enum-control-renderer',
  components: {
    ControlWrapper
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsEnumControl(props));
  }
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(20, and(isEnumControl, optionIs('format', 'radio')))
};
</script>
