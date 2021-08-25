<template>
  <validation-badge
    v-if="errors && errors.length > 0"
    :id="id"
    :errors="errors"
  >
    <v-icon color="error"> mdi-alert-circle-outline </v-icon>
  </validation-badge>
</template>


<script lang="ts">
import { defineComponent, CompType } from "../../../config/vue";
import { ErrorObject } from "ajv";
import { ValidationBadge } from "./";
import { VIcon } from "vuetify/lib";

export default defineComponent({
  name: "validation-icon",
  components: {
    ValidationBadge,
    VIcon,
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
  },
});
</script>