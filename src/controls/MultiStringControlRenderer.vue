<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
      <v-textarea

        :id="control.id + '-input'"
        :class="styles.control.textarea"
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
        :size="appliedOptions.trim && control.schema.maxLength !== undefined ? control.schema.maxLength : undefined"

        :clearable="hover == true"
        multi-line
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </v-hover>  
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  isMultiLineControl,
  and
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import { rendererProps, useJsonFormsControl, RendererProps } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VHover, VTextarea } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'multi-string-control-renderer',
  components: {
    ControlWrapper,
    VHover,
    VTextarea
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
  tester: rankWith(2, and(isStringControl, isMultiLineControl))
};
</script>
