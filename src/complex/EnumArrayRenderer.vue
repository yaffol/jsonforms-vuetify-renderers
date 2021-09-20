<template>
  <v-layout v-if="control.visible" row>
    <v-flex v-for="(o, index) in control.options" :key="o.value">
      <v-container fluid>
        <v-checkbox
          :label="o.label"
          :value="o.value"
          :id="control.id + `-input-${index}`"
          :path="composePaths(control.path, `${index}`)"
          :error-messages="control.errors"
          :disabled="!control.enabled"
          multiple
          :indeterminate="control.data === undefined"
          v-model="control.data"
          @change="onChange"
        ></v-checkbox>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {
  and,
  ControlElement,
  hasType,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  mapDispatchToMultiEnumProps,
  mapStateToMultiEnumControlProps,
  rankWith,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs,
  composePaths,
  update,
  Dispatch,
  CoreActions,
} from "@jsonforms/core";
import { VCheckbox, VLayout, VFlex } from "vuetify/lib";
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useControl,
  ControlProps,
} from "../../config/jsonforms";
import { defineComponent, inject } from "../../config/vue";
import { useVuetifyMultiEnumControl } from "../util";

const useJsonFormsMultiEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToMultiEnumControlProps,
    mapDispatchToMultiEnumProps
  );
};

const controlRenderer = defineComponent({
  name: "enum-array-renderer",
  components: {
    DispatchRenderer,
    VCheckbox,
    VLayout,
    VFlex,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const dispatch = inject<Dispatch<CoreActions>>("dispatch");

    if (!dispatch) {
      throw new Error(
        "'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?"
      );
    }

    return {
      ...useVuetifyMultiEnumControl(useJsonFormsMultiEnumControl(props)),
      dispatch,
    };
  },
  methods: {
    composePaths,
    onChange() {
      this.dispatch(update(this.control.path, () => this.control.data));
    },
  },
});

export default controlRenderer;

const hasOneOfItems = (schema: JsonSchema): boolean =>
  schema.oneOf !== undefined &&
  schema.oneOf.length > 0 &&
  (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
    return entry.const !== undefined;
  });

const hasEnumItems = (schema: JsonSchema): boolean =>
  schema.type === "string" && schema.enum !== undefined;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    5,
    and(
      uiTypeIs("Control"),
      and(
        schemaMatches(
          (schema) =>
            hasType(schema, "array") &&
            !Array.isArray(schema.items) &&
            schema.uniqueItems === true
        ),
        schemaSubPathMatches("items", (schema) => {
          return hasOneOfItems(schema) || hasEnumItems(schema);
        })
      )
    )
  ),
};
</script>
