<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <h6>Geonames Lookup</h6>
    <v-hover v-slot="{ hover }">
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
        :error-messages="control.errors"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        :counter="
          control.schema.maxLength !== undefined
            ? control.schema.maxLength
            : undefined
        "
        :clearable="hover"
        :value="control.data"
        :items="suggestions"
        hide-no-data
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <v-text-field
        v-else
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
        :error-messages="control.errors"
        :value="control.data"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        :counter="
          control.schema.maxLength !== undefined
            ? control.schema.maxLength
            : undefined
        "
        :clearable="hover"
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="onInput"
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
import { defineComponent } from '../vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VHover, VTextField, VCombobox } from 'vuetify/lib';
import { DisabledIconFocus } from './directives';
import isArray from 'lodash/isArray';
import every from 'lodash/every';
import isString from 'lodash/isString';

const controlRenderer = defineComponent({
  name: 'geonames-lookup-renderer',
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
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  methods: {
    onInput (e: string) {
      console.log(e)
      let url = new URL('http://api.geonames.org/getJSON')

      const params = { geonameId: e, username: 'roradmin' } // or:

      url.search = new URLSearchParams(params).toString();
        fetch(url.toString() )
            .then(response => {
              const info = response
              console.log(info.text())
            })
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
  tester: rankWith(10, isStringControl),
};
</script>
