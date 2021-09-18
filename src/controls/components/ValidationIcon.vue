<template>
  <validation-badge v-if="errors && errors.length > 0" :errors="errors">
    <v-icon color="error">{{
      `${this.$vuetify.icons.iconfont}-alert-circle-outline`
    }}</v-icon>
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
    errors: {
      required: true,
      type: Array as CompType<ErrorObject, ArrayConstructor>,
    },
  },
});
</script>