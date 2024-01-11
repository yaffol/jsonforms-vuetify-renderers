<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <div v-if="isDevMode">
      <h4>Blur Count: {{ blurCounter }}</h4>
      <h4>Touched: {{ touched }}</h4>
      <h4>Filtered Errors: {{ filteredErrors }}</h4>
      <h4>Error Filtering Mode: {{ errorFilteringMode }}</h4>
      <h4>Is Required Message: {{ isRequiredMessage }}</h4>
    </div>
    <v-hover v-slot="{ isHovering }">
      <v-combobox
        v-if="suggestions !== undefined"
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :required="control.required"
        :error-messages="filteredErrors"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        :counter="
          control.schema.maxLength !== undefined
            ? control.schema.maxLength
            : undefined
        "
        :clearable="isHovering"
        :model-value="control.data"
        :items="suggestions"
        hide-no-data
        v-bind="vuetifyProps('v-combobox')"
        @update:model-value="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <v-text-field
        v-else
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :required="control.required"
        :error-messages="filteredErrors"
        :model-value="control.data"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        :counter="
          control.schema.maxLength !== undefined
            ? control.schema.maxLength
            : undefined
        "
        :clearable="isHovering"
        v-bind="vuetifyProps('v-text-field')"
        @update:model-value="onChange"
        @focus="isFocused = true"
        @blur="onFieldBlur"
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
} from '@jsonforms/core';
import {computed, defineComponent, inject, ref} from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VHover, VTextField, VCombobox } from 'vuetify/components';
import { DisabledIconFocus } from './directives';
import isArray from 'lodash/isArray';
import every from 'lodash/every';
import isString from 'lodash/isString';
import { useFieldInteraction, ErrorFilteringMode } from "../util";

const controlRenderer = defineComponent({
  name: 'string-control-renderer',
  components: {
    ControlWrapper,
    VHover,
    VTextField,
    VCombobox,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const errorFilteringMode = inject('errorFilteringMode', ref(ErrorFilteringMode.NoFiltering));
    const isRequiredMessage = inject('isRequiredMessage', ref(null));
    const isDevMode = process.env.NODE_ENV === 'development'
    const vControl = useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
      300
    );

    const { blurCounter, onFieldBlur, touched, getFilteredErrors } = useFieldInteraction();

    const filteredErrors = computed(() => {
      return getFilteredErrors(vControl.control.value.errors, errorFilteringMode.value, isRequiredMessage.value);
    });

    return {
      ...vControl,
      filteredErrors,
      onFieldBlur,
      blurCounter,
      touched,
      isDevMode,
      errorFilteringMode,
      isRequiredMessage
    }
  },
  computed: {
    suggestions(): string[] | undefined {
      const suggestions = this.control.uischema.options?.suggestion;

      if (
        suggestions === undefined ||
        !isArray(suggestions) ||
        !every(suggestions, isString)
      ) {
        // check for incorrect data
        return undefined;
      }
      return suggestions;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isStringControl),
};
</script>
