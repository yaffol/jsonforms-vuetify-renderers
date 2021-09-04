<template>
  <div class="text-center d-flex align-center justify-space-around">
    <v-tooltip :id="id" bottom v-if="errors.length > 0">
      <template v-slot:activator="{ on: onTooltip }">
        <v-badge
          :color="color"
          :bordered="bordered"
          :inline="inline"
          :offsetX="offsetX"
          :offsetY="offsetY"
          :overlap="overlap"
        >
          <template v-slot:badge>
            <span v-on="onTooltip">{{errors.length}}</span>
          </template>
          <slot></slot>
        </v-badge>
      </template>

      <p>Validation Errors</p>
      <p
        v-for="(message, index) in tooltipMessages"
        :key="`${index}`"
        class="mb-0"
      >
        {{ message }}
      </p>
    </v-tooltip>
    <slot v-if="errors.length === 0"></slot>
  </div>
</template>


<script lang="ts">
import { defineComponent, CompType } from "../../../config/vue";
import { VBadge, VTooltip } from "vuetify/lib";
import { ErrorObject } from "ajv";
import findIndex from "lodash/findIndex";
import {
  createControlElement,
  createLabelDescriptionFrom,
} from "@jsonforms/core";

export default defineComponent({
  name: "validation-badge",
  components: {
    VBadge,
    VTooltip,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
    errors: {
      required: true,
      type: Array as CompType<ErrorObject, ArrayConstructor>,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "error",
    },
    inline: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: [Number, String],
      default: undefined,
    },
    offsetY: {
      type: [Number, String],
      default: undefined,
    },
    overlap: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tooltipMessages(): string[] {
      const error: {
        dataPath: string;
        schemaPath: string;
        labels: (string | undefined)[];
        message: string;
      }[] = [];

      for (const e of this.errors) {
        const errorObject = e as ErrorObject;
        const index = findIndex(error, { schemaPath: errorObject.schemaPath });
        if (errorObject.message) {
          if (index == -1) {
            error.push({
              schemaPath: errorObject.schemaPath,
              dataPath: errorObject.dataPath,
              labels: [
                createLabelDescriptionFrom(
                  createControlElement(errorObject.dataPath),
                  errorObject.schema
                ).text,
              ],
              message: errorObject.message,
            });
          } else {
            error[index].labels.push(
              createLabelDescriptionFrom(
                createControlElement(errorObject.dataPath),
                errorObject.schema
              ).text
            );
          }
        }
      }

      return error.map((v) => v.labels.join(",") + ": " + v.message);
    },
  },
});
</script>