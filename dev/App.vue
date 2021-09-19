<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-list-item>
        <v-list-item-icon>
          <v-img src="./assets/vuetify.svg" max-height="64" max-width="64" />
        </v-list-item-icon>
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
      <v-toolbar-title>
        <v-container fill-height fluid
          ><v-row align="center" justify="center">
            <v-col>
              <v-img
                src="./assets/jsonforms.svg"
                max-height="64"
                max-width="64"
              />
            </v-col>
            <v-col>JSON Forms </v-col>
          </v-row></v-container
        ></v-toolbar-title
      >

      <v-spacer expand></v-spacer>

      <v-toolbar-items>
        <v-container fill-height fluid
          ><v-row>
            <v-col style="max-width: 300px">
              <v-select
                dense
                rounded
                outlined
                v-model="validationMode"
                :items="validationModes"
              ></v-select>
            </v-col>
            <v-col cols="1"><theme-changer /> </v-col>
          </v-row>
        </v-container>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="demo" v-if="example != null">
        <v-flex>
          <v-card>
            <v-card-title>{{ example.title }}</v-card-title>
            <v-card-text>
              <v-tabs v-model="activeTab">
                <v-tab :key="0">Demo</v-tab>
                <v-spacer expand />
                <v-tab :key="1">Schema</v-tab>
                <v-tab :key="2">UI Schema</v-tab>
                <v-tab :key="3">Data</v-tab>

                <v-tab-item :key="0">
                  <json-forms
                    :data="example.data"
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
                    <monaco-editor
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      :language="`json`"
                      v-model="monacoSchema"
                      @change="onChangeEditSchema"
                      :editorBeforeMount="registerJsonSchemaValidation"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="2">
                  <v-card>
                    <v-card-title>UI Schema</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      language="json"
                      v-model="monacoUISchema"
                      @change="onChangeEditUISchema"
                      :editorBeforeMount="registerUISchemaValidation"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="3">
                  <v-card>
                    <v-card-title>Data</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      language="json"
                      v-model="monacoData"
                      @change="onChangeEditData"
                      :editorBeforeMount="registerDataValidaton"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "../config/vue";
import { UISchemaElement, JsonSchema } from "@jsonforms/core";
import { ErrorObject } from "ajv";
import { JsonForms, JsonFormsChangeEvent } from "../config/jsonforms";
import {
  createAjv,
  extendedVuetifyRenderers,
  mergeStyles,
  defaultStyles,
} from "../src";
import ajvErrorsPlugin from "ajv-errors";

import { examples } from "./components/examples";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { Uri } from "monaco-editor/esm/vs/editor/editor.api";
import {
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  configureDataValidation,
  EditorApi,
} from "./core/jsonSchemaValidation";

import ThemeChanger from "./components/ThemeChanger.vue";
import MonacoEditor from "./components/MonacoEditor.vue";
import { jsonSchemaDraft7, uiSchema } from "./core/jsonschema";

const ajv = createAjv({ useDefaults: true });
ajvErrorsPlugin(ajv);

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: "my-control" },
});

const renderers = Object.freeze(extendedVuetifyRenderers);

type JsonInput = {
  schemaId: string;
  title: string;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  data: any;
} | null;

export default defineComponent({
  name: "app",
  components: {
    JsonForms,
    MonacoEditor,
    ThemeChanger,
  },
  data() {
    const selectedExample = ref(-1);
    const data = ref({});
    const errors: Ref<ErrorObject[] | undefined> = ref(undefined);

    return {
      readonly: false,
      validationMode: "ValidateAndShow",
      validationModes: [
        { text: "Validate And Show", value: "ValidateAndShow" },
        { text: "Validate And Hide", value: "ValidateAndHide" },
        { text: "No Validation", value: "NoValidation" },
      ],
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
      monacoOptions: {
        ...monaco.languages.json.jsonDefaults,
      },
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.data.value = event.data;
      this.errors.value = event.errors;

      console.log("JsonForm data change: " + JSON.stringify(this.data.value));
    },
    selectExample(index: number) {
      this.selectedExample.value = index;
    },
    onChangeEditSchema() {
      console.log("on change schema");
    },
    onChangeEditUISchema() {
      console.log("on change ui schema");
    },
    onChangeEditData() {
      console.log("on change data");
    },
    registerJsonSchemaValidation(editor: EditorApi) {
      const modelUri = Uri.parse("json://core/specification/schema.json");
      configureJsonSchemaValidation(editor, modelUri);
    },
    registerUISchemaValidation(editor: EditorApi) {
      const modelUri = Uri.parse("json://core/specification/uischema.json");
      configureUISchemaValidation(editor, modelUri);
    },
    registerDataValidaton(editor: EditorApi) {
      const example = this.example;
      if (example && example.schema) {
        if (!example.schema.hasOwnProperty("$schema")) {
          example.schema["$schema"] = jsonSchemaDraft7.uri;
        }
        if (!example.schema.hasOwnProperty("$id")) {
          (example.schema as any)["$id"] = example.schemaId;
        }

        configureDataValidation(editor, {
          uri: (example.schema as any)["$id"],
          schema: example.schema,
        });
      }
    },
  },
  computed: {
    example(): JsonInput {
      const e = this.examples[this.selectedExample.value];
      if (e) {
        return {
          schemaId: "example-" + this.selectedExample.value + "-schema.json",
          title: e.title,
          schema: e.input.schema,
          uischema: e.input.uischema,
          data: e.input.data,
        };
      }

      return null;
    },
    monacoSchema: {
      get(comp) {
        let schema = undefined;
        if (comp.example && comp.example.schema) {
          schema = comp.example.schema;
        }
        if (schema && !schema.hasOwnProperty("$schema")) {
          schema["$schema"] = jsonSchemaDraft7.uri;
        }
        if (schema && !schema.hasOwnProperty("$id")) {
          schema["$id"] = comp.example.schemaId;
        }

        return schema ? JSON.stringify(schema, null, 2) : "";
      },

      set(_: string) {
        console.log("on change schema");
      },
    },
    monacoUISchema: {
      get(comp) {
        let uischema = undefined;
        if (comp.example && comp.example.uischema) {
          uischema = comp.example.uischema;
        }
        if (uischema && !uischema.hasOwnProperty("$schema")) {
          uischema["$schema"] = uiSchema.uri;
        }
        return uischema ? JSON.stringify(uischema, null, 2) : "";
      },

      set(_: string) {
        console.log("on change ui schema");
      },
    },
    monacoData: {
      cache: false,
      get(comp) {
        let data = undefined;
        if (comp.data.value) {
          data = comp.data.value;
        }
        if (data && !data.hasOwnProperty("$schema")) {
          if (
            comp.example.schema &&
            comp.example.schema.hasOwnProperty("$id")
          ) {
            data["$schema"] = comp.example.schema.$id;
          }
        }

        return data ? JSON.stringify(data, null, 2) : "";
      },

      set(_: string) {
        console.log("on change data");
      },
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

<style>
/* required class */
.code-editor {
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

.vue-code-hightlight pre {
  background-color: transparent !important;
}

.vue-code-hightlight pre code {
  background-color: transparent !important;
}
</style>
