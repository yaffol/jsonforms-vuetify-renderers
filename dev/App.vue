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
      <v-toolbar-title class="primary--text">JSON Forms</v-toolbar-title>

      <v-spacer expand></v-spacer>

      <v-toolbar-items align-center>
        <v-select
          dense
          rounded
          v-model="validationMode"
          :items="validationModes"
        ></v-select>

        <v-spacer></v-spacer>

        <theme-changer />
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
                      height="500"
                      language="json"
                      v-model="monacoSchema"
                      @change="onChangeEditSchema"
                      :editorBeforeMount="schemaEditorBeforeMount"
                      :editorMounted="editorMounted"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="2">
                  <v-card>
                    <v-card-title>UI Schema</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      height="500"
                      language="json"
                      v-model="monacoUISchema"
                      @change="onChangeEditUISchema"
                      :editorBeforeMount="uiSchemaEditorBeforeMount"
                      :editorMounted="editorMounted"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="3">
                  <v-card>
                    <v-card-title>Data</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      height="500"
                      language="json"
                      v-model="monacoData"
                      @change="onChangeEditData"
                      :editorBeforeMount="dataEditorBeforeMount"
                      :editorMounted="editorMounted"
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
import "../vuetify.css";
import ajvErrorsPlugin from "ajv-errors";

import { examples } from "./components/examples";
import MonacoEditor from "monaco-editor-vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { Uri } from "monaco-editor/esm/vs/editor/editor.api";
import {
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  configureDataValidation,
  EditorApi,
} from "./core/jsonSchemaValidation";

import ThemeChanger from "./components/ThemeChanger";

const ajv = createAjv({ useDefaults: true });
ajvErrorsPlugin(ajv);

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: "my-control" },
});

const renderers = Object.freeze(extendedVuetifyRenderers);

type JsonInput = {
  title: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
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
    schemaEditorBeforeMount(editor: EditorApi) {
      if (true) return;
      const modelUri = Uri.parse("json://core/specification/schema.json");
      console.log("register schema for JSON Schema");
      configureJsonSchemaValidation(editor, modelUri);
    },
    uiSchemaEditorBeforeMount(editor: EditorApi) {
      if (true) return;
      const modelUri = Uri.parse("json://core/specification/uischema.json");
      console.log("register schema for JSON UI Schema");
      configureUISchemaValidation(editor, modelUri);
    },
    dataEditorBeforeMount(editor: EditorApi) {
      if (true) return;
      const example = this.example;
      let modelUri: string = "";

      if (example && example.data && example.data.hasOwnProperty("$schema")) {
        modelUri = example.data.data.$schema;
      }
      console.log("modelUri=" + modelUri);

      if (example) {
        console.log("register schema for JSON data");
        configureDataValidation(editor, {
          uri: modelUri,
          schema: example.schema,
        });
      }
    },
    editorMounted(editor: monaco.editor.IStandaloneCodeEditor, _: EditorApi) {
      console.log("editor mounted");
      console.log(editor);
    },
  },
  computed: {
    example(): JsonInput {
      const e = this.examples[this.selectedExample.value];
      if (e) {
        return {
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
        return comp.example ? JSON.stringify(comp.example.schema, null, 2) : "";
      },

      set(_: string) {
        console.log("on change schema");
      },
    },
    monacoUISchema: {
      get(comp) {
        return comp.example
          ? JSON.stringify(comp.example.uischema, null, 2)
          : "";
      },

      set(_: string) {
        console.log("on change ui schema");
      },
    },
    monacoData: {
      get(comp) {
        return comp.example ? JSON.stringify(comp.data, null, 2) : "";
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
