<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
      <!-- value={Number(data || schema.default)} -->

      <v-slider
        :step="control.schema.multipleOf || 1"
        :min="control.schema.minimum"
        :max="control.schema.maximum"
        :thumb-label=true

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
      />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isRangeControl
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import { rendererProps, useJsonFormsControl, RendererProps } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VSlider } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'slider-control-renderer',
  components: {
    ControlWrapper,
    VSlider,
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsControl(props), value => Number(value));
  }
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, isRangeControl)
};
</script>
