<template>
  <div v-if="isLayoutWithElements">
    <dispatch-renderer
      :schema="otherProps"
      :path="path"
      :uischema="foundUISchema"
    />
  </div>
</template>

<script lang="ts">
import { Generate, JsonSchema, UISchemaElement } from "@jsonforms/core";
import _ from "lodash";
import { defineComponent } from "../../../config/vue";
import { DispatchRenderer } from "../../../config/jsonforms";

interface CombinatorProps {
  schema: JsonSchema;
  combinatorKeyword: "oneOf" | "anyOf";
  path: string;
}

export default defineComponent({
  name: "combinator-properties",
  components: {
    DispatchRenderer,
  },
  props: {
    schema: {
      required: true,
      type: JsonSchema,
    },
    combinatorKeyword: {
      required: true,
      type: "oneOf" | "anyOf",
    },
    path: {
      required: true,
      type: String,
    },
  },
  setup(props: CombinatorProps) {
    const otherProps: JsonSchema = _.omit(
      props.schema,
      props.combinatorKeyword
    ) as JsonSchema;
    const foundUISchema: UISchemaElement = Generate.uiSchema(
      otherProps,
      "VerticalLayout"
    );

    const isLayout = (uischema: UISchemaElement): uischema is Layout =>
      uischema.hasOwnProperty("elements");

    let isLayoutWithElements = false;
    if (foundUISchema !== null && isLayout(foundUISchema)) {
      isLayoutWithElements = foundUISchema.elements.length > 0;
    }

    return {
      otherProps,
      foundUISchema,
      isLayoutWithElements,
    };
  },
});
</script>