<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Examples </v-list-item-title>
          <v-list-item-subtitle> Vuetify Renderers </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="(example, index) in examples"
          :key="example.title"
          link
        >
          <v-list-item-content @click="selectExample(index)">
            <v-list-item-title>{{ example.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-toolbar-title>JSON Forms</v-toolbar-title>

      <v-spacer expand></v-spacer>

      <v-select
        dense
        v-model="validationMode"
        :items="validationModes"
      ></v-select>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="demo" v-if="example != null">
        <v-tabs v-model="activeTab">
          <v-tab :key="0">Demo</v-tab>
          <v-spacer expand />
          <v-tab :key="1">Schema</v-tab>
          <v-tab :key="2">UI Schema</v-tab>
          <v-tab :key="3">Data</v-tab>

          <v-tab-item :key="0">
            <json-forms
              v-if="selectedExample.value >= 0"
              :data="data"
              :schema="example.schema"
              :uischema="example.uischema"
              :renderers="renderers"
              :cells="cells"
              :config="config"
              :validationMode="validationMode"
              :ajv="handleDefaultsAjv"
              :readonly="readonly"
              @change="onChange"
            />
          </v-tab-item>
          <v-tab-item :key="1">
            <v-card>
              <v-card-title>Schema</v-card-title>
              <v-divider class="mx-4"></v-divider>
              <div>
                <pre>{{ JSON.stringify(example.schema, null, 2) }}</pre>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2">
            <v-card>
              <v-card-title>UI Schema</v-card-title>
              <v-divider class="mx-4"></v-divider>
              <div>
                <pre>{{ JSON.stringify(example.uischema, null, 2) }}</pre>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="3">
            <v-card>
              <v-card-title>Data</v-card-title>
              <v-divider class="mx-4"></v-divider>
              <div>
                <pre>{{ JSON.stringify(data, null, 2) }}</pre>
              </div>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "../../config/vue";
import { UISchemaElement, JsonSchema } from "@jsonforms/core";
import { ErrorObject } from "ajv";
import { JsonForms, JsonFormsChangeEvent } from "../../config/jsonforms";
import {
  createAjv,
  vuetifyRenderers,
  mergeStyles,
  defaultStyles,
} from "../../src";
import "../../vuetify.css";
import ajvErrorsPlugin from "ajv-errors";

import { examples } from "./examples";

const ajv = createAjv({ useDefaults: true });
ajvErrorsPlugin(ajv);

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: "my-control" },
});

const renderers = Object.freeze(vuetifyRenderers);

export default defineComponent({
  name: "app",
  components: {
    JsonForms,
  },
  data() {
    const selectedExample = ref(-1);
    const data = ref({});
    const errors = ref([] as ErrorObject[]);

    return {
      readonly: false,
      validationMode: "ValidateAndShow",
      validationModes: ["ValidateAndShow", "ValidateAndHide", "NoValidation"],
      activeTab: 0,
      renderers: renderers,
      cells: renderers,
      handleDefaultsAjv: ajv,
      config: {
        hideRequiredAsterisk: false,
      },
      selectedExample,
      data,
      errors,
      examples,
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.data = event.data;
      if (event.errors) {
        this.errors.value = event.errors;
      }
    },
    selectExample(index: number) {
      this.selectedExample.value = index;
      const e = this.example;
      if (e) {
        this.data = JSON.parse(e.data);
      }
    },
  },
  computed: {
    example(): {
      schema: JsonSchema;
      uischema: UISchemaElement;
      data: any;
    } | null {
      const e = this.examples[this.selectedExample.value];
      if (e) {
        return {
          schema: e.input.schema,
          uischema: e.input.uischema,
          data: e.input.data,
        };
      }

      return null;
    },
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
});
</script>

<style scoped>
.form {
  max-width: 500px;
  flex: 1;
}
.container {
  display: flex;
}
.data {
  flex: 1;
}

.demo {
  max-width: 900px;
}
</style>
