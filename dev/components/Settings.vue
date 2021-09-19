<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn large icon dark @click.stop="settings = !settings" v-on="onTooltip">
          <v-icon size="30" color="primary">mdi-cog</v-icon>
        </v-btn>
      </template>
      Settings
    </v-tooltip>
    <v-navigation-drawer
      v-model="settings"
      :right="!$vuetify.rtl"
      app
      hide-overlay
      temporary
      width="300"
    >
      <v-toolbar flat>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="settings = false">
            <v-icon>$close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-divider />
      <v-container>
        <v-row dense>
          <v-col>
            <v-select
              dense
              v-model="validation"
              :items="validationModes"
              @change="$emit('validation-change', validation)"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: "Settings",
  props: {
    validationMode: { type: String, required: true },
  },
  data: function () {
    return {
      settings: false,
      validation: this.validationMode,
      validationModes: [
        { text: "Validate And Show", value: "ValidateAndShow" },
        { text: "Validate And Hide", value: "ValidateAndHide" },
        { text: "No Validation", value: "NoValidation" },
      ],
    };
  },
};
</script>
<style scoped></style>