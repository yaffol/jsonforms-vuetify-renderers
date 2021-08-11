<script lang="ts">
import { defineComponent } from '../../config/vue';
import { JsonForms, JsonFormsChangeEvent } from '../../config/jsonforms';
import { createAjv, vuetifyRenderers, mergeStyles, defaultStyles } from '../../src';
import '../../vuetify.css';
import ajvErrorsPlugin from "ajv-errors"

import schema from '../../assets/example.schema.json'
import uischema from '../../assets/example.uischema.json'
import data from '../../assets/example.data.json'

const ajv = createAjv({useDefaults: true});
ajvErrorsPlugin(ajv);

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' }
});

const renderers = Object.freeze(vuetifyRenderers);

export default defineComponent({
  name: 'app',
  components: {
    JsonForms
  },
  data: function() {
    return {
      renderers: renderers,
      cells: renderers,
      handleDefaultsAjv: ajv,
      data,
      schema,
      uischema,
      config: {
        hideRequiredAsterisk: false
      }
    };
  },
  methods: {
    setSchema() {
      this.schema = {
        properties: {
          name: {
            type: 'string',
            title: 'NAME',
            description: 'The name'
          }
        }
      };
    },
    onChange(event: JsonFormsChangeEvent) {
      console.log(event);
      this.data = event.data;
    },
    switchAsterisk() {
      this.config.hideRequiredAsterisk = !this.config.hideRequiredAsterisk;
    },
    adaptData() {
      this.data.number = 10;
    },
    adaptUiSchema() {
      this.uischema = {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/string',
                    options: {
                      placeholder: 'this is a placeholder'
                    }
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/multiString'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/boolean',
                    options: {
                      placeholder: 'boolean placeholder'
                    }
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/boolean2'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/number',
                    rule: {
                      effect: 'DISABLE',
                      condition: {
                        scope: '#/properties/boolean',
                        schema: {
                          const: true
                        }
                      }
                    }
                  }
                ]
              },
              {
                type: 'Group',
                label: 'My group',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/integer',
                    rule: {
                      effect: 'HIDE',
                      condition: {
                        scope: '#/properties/boolean2',
                        schema: {
                          const: true
                        }
                      }
                    }
                  },
                  {
                    type: 'HorizontalLayout',
                    elements: [
                      {
                        type: 'Control',
                        scope: '#/properties/enum'
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/oneOfEnum'
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/date',
                        options: {
                          placeholder: 'date placeholder'
                        }
                      }
                    ]
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/dateTime',
                    options: {
                      placeholder: 'date-time placeholder'
                    }
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/time',
                    options: {
                      placeholder: 'time placeholder',
                      styles: {
                        control: {
                          root: 'control my-time'
                        }
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            type: 'Label',
            text: 'This is my label'
          },
          {
            type: 'Control',
            scope: '#/properties/array',
            options: {
              childLabelProp: 'age'
            }
          }
        ]
      };
    }
  },
  provide() {
    return {
      styles: myStyles
    };
  }
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
</style>

<template>
  <v-app>
    <div class="container">
      <div class="form">
        <json-forms
          :data="data"
          :schema="schema"
          :uischema="uischema"
          :renderers="renderers"
          :cells="cells"
          :config="config"
          :ajv="handleDefaultsAjv"
          @change="onChange"
        />
        <button @click="setSchema">Set Schema</button>
        <button @click="switchAsterisk">Switch Asterisk</button>
        <button @click="adaptData">Adapt data</button>
        <button @click="adaptUiSchema">Adapt uischema</button>
      </div>
      <div class="data">
        <pre
          >{{ JSON.stringify(data, null, 2) }}
      </pre
        >
        <pre
          >{{ JSON.stringify(config, null, 2) }}
      </pre
        >
      </div>
    </div>
  </v-app>
</template>
