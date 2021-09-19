<template>
  <v-card v-if="control.visible" :class="styles.arrayList.root" elevation="0">
    <v-card-title>
      <v-toolbar flat :class="styles.arrayList.toolbar">
        <v-toolbar-title :class="styles.arrayList.label">{{
          control.label
        }}</v-toolbar-title>
        <validation-icon
          v-if="control.childErrors.length > 0"
          :errors="control.childErrors"
        />
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn
              fab
              text
              elevation="0"
              small
              :aria-label="`Add to ${control.label}`"
              v-on="onTooltip"
              :class="styles.arrayList.addButton"
              @click="addButtonClick"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          {{ `Add to ${control.label}` }}
        </v-tooltip>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-container justify-space-around align-content-center>
        <v-row justify="center">
          <v-expansion-panels accordion>
            <v-expansion-panel
              v-for="(element, index) in control.data"
              :key="`${control.path}-${index}`"
              :class="styles.arrayList.item"
            >
              <v-expansion-panel-header :class="styles.arrayList.itemHeader">
                <v-container grid-list-xl flex style="padding: 0px">
                  <v-layout row>
                    <v-flex align-self-center shrink>
                      <validation-badge
                        overlap
                        bordered
                        :errors="childErrors(index)"
                      >
                        <v-avatar size="40" aria-label="Index" color="info"
                          ><span class="info--text text--lighten-5">{{
                            index + 1
                          }}</span></v-avatar
                        >
                      </validation-badge>
                    </v-flex>

                    <v-flex
                      align-self-center
                      grow
                      :class="styles.arrayList.itemLabel"
                      >{{ childLabelForIndex(index) }}</v-flex
                    >
                    <v-flex align-self-center shrink>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            v-on="onTooltip"
                            v-if="appliedOptions.showSortButtons"
                            fab
                            text
                            elevation="0"
                            small
                            class="v-expansion-panel-header__icon"
                            aria-label="Move up"
                            :disabled="index <= 0"
                            :class="styles.arrayList.itemMoveUp"
                            @click.native="moveUpClick($event, index)"
                          >
                            <v-icon class="notranslate">mdi-arrow-up</v-icon>
                          </v-btn>
                        </template>
                        Move Up
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            v-on="onTooltip"
                            v-if="appliedOptions.showSortButtons"
                            fab
                            text
                            elevation="0"
                            small
                            class="v-expansion-panel-header__icon"
                            aria-label="Move down"
                            :disabled="index >= control.data.length - 1"
                            :class="styles.arrayList.itemMoveDown"
                            @click.native="moveDownClick($event, index)"
                          >
                            <v-icon class="notranslate">mdi-arrow-down</v-icon>
                          </v-btn>
                        </template>
                        Move Down
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            v-on="onTooltip"
                            fab
                            text
                            elevation="0"
                            small
                            class="v-expansion-panel-header__icon"
                            aria-label="Delete"
                            :class="styles.arrayList.itemDelete"
                            @click.native="removeItemsClick($event, [index])"
                          >
                            <v-icon class="notranslate">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        Delete
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-header>
              <v-expansion-panel-content :class="styles.arrayList.itemContent">
                <dispatch-renderer
                  :schema="control.schema"
                  :uischema="childUiSchema"
                  :path="composePaths(control.path, `${index}`)"
                  :enabled="control.enabled"
                  :renderers="control.renderers"
                  :cells="control.cells"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-container>
      <v-container v-if="noData" :class="styles.arrayList.noData">
        No data
      </v-container></v-card-text
    >
  </v-card>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  ControlElement,
  rankWith,
  isObjectArrayWithNesting,
  composePaths,
  createDefaultValue,
} from "@jsonforms/core";
import { defineComponent } from "../../config/vue";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  RendererProps,
} from "../../config/jsonforms";
import { useVuetifyArrayControl } from "../util";
import {
  VCard,
  VCardTitle,
  VCardText,
  VRow,
  VCol,
  VContainer,
  VToolbar,
  VToolbarTitle,
  VTooltip,
  VBtn,
  VAvatar,
  VSpacer,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelHeader,
  VExpansionPanelContent,
} from "vuetify/lib";
import { ValidationIcon, ValidationBadge } from "../controls/components/index";
import { ErrorObject } from "ajv";

const controlRenderer = defineComponent({
  name: "array-layout-renderer",
  components: {
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,

    VAvatar,
    VRow,
    VCol,
    VToolbar,
    VToolbarTitle,
    VTooltip,
    VBtn,
    VSpacer,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelHeader,
    VExpansionPanelContent,
    VContainer,
    ValidationIcon,
    ValidationBadge,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyArrayControl(useJsonFormsArrayControl(props));
  },
  computed: {
    noData(): boolean {
      return !this.control.data || this.control.data.length === 0;
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema)
      )();
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    removeItemsClick(event: Event, toDelete: number[]): void {
      event.stopPropagation();
      this.removeItems?.(this.control.path, toDelete)();
    },
    childErrors(index: number): ErrorObject[] {
      return this.control.childErrors.filter((e) =>
        e.dataPath.startsWith(this.composePaths(this.control.path, `${index}`))
      );
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, isObjectArrayWithNesting),
};
</script>

<style scoped>
.notranslate {
  transform: none !important;
}
</style>