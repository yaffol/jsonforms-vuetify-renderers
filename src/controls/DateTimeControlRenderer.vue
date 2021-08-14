<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      type="datetime-local"
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
      v-model="dataTime"
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
  isDateTimeControl,
} from "@jsonforms/core";
import { defineComponent } from "../../config/vue";
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from "../../config/jsonforms";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVuetifyControl, parseDateTime } from "../util";
import { VTextField } from "vuetify/lib";

const controlRenderer = defineComponent({
  name: "datetime-control-renderer",
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsControl(props));
  },
  computed: {
    dataTime: {
      get() {
        const datetimeLocalFormat = "YYYY-MM-DDTHH:mm:ss.SSS";
        const saveFormat = this.appliedOptions.dateTimeSaveFormat ?? undefined;

        const dateTime = parseDateTime(this.control.data, saveFormat);
        return dateTime ? dateTime.local().format(datetimeLocalFormat) : "";
      },
      set(value: string) {
        const datetimeLocalFormats = [
          "YYYY-MM-DDTHH:mm:ss.SSS",
          "YYYY-MM-DDTHH:mm:ss",
          "YYYY-MM-DDTHH:mm",
        ];
        const saveFormat =
          this.appliedOptions.dateTimeSaveFormat ?? "YYYY-MM-DDTHH:mm:ssZ";

        const dateTime = parseDateTime(value, datetimeLocalFormats);
        const result = dateTime ? dateTime.format(saveFormat) : undefined;

        this.onChange(result);
      },
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateTimeControl),
};
</script>
