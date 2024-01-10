<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <h4>Blur Count: {{ blurCounter }}</h4>
    <h4>Touched: {{ touched }}</h4>
    <h4>Filtered Errors: {{ filteredErrors }}</h4>
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
        @blur="onBlur"
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
import {computed, defineComponent, ref} from 'vue';
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
    const vControl = useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
      300
    );
    const blurCounter = ref(0)
    const onBlur = () => {
      vControl.isFocused.value = false;
      blurCounter.value = blurCounter.value + 1
    }
    // const filteredErrors = (vControl.control.value.errors ?? []).filter(error => error.keyword !== 'required')
    const touched = computed(() => blurCounter.value > 0);
    const filteredErrors = computed(() => {
      if (touched.value) return vControl.control.value.errors
      if (vControl.control.value.errors === 'is required') return ""
      return vControl.control.value.errors
    })

    return {
      ...vControl,
      filteredErrors,
      onBlur,
      blurCounter,
      touched
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
