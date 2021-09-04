<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >

    <v-hover v-slot="{ hover }">
      <v-text-field

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
        :maxlength="appliedOptions.restrict ? control.schema.maxLength : undefined"
        :counter="control.schema.maxLength !== undefined ? control.schema.maxLength: undefined"

        :clearable="hover == true"
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </v-hover>
  </control-wrapper>
  <!--         :full-width="!appliedOptions.trim || control.schema.maxLength === undefined" -->
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import { rendererProps, useJsonFormsControl, RendererProps } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VHover, VTextField } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'string-control-renderer',
  components: {
    ControlWrapper,
    VHover,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsControl(props), value => value || undefined);
  }
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isStringControl)
};
</script>
