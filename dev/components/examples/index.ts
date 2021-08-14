import { input as allOf } from './allOf';
import { input as anyOf } from './anyOf';
import { input as array } from './array';
import { input as basic } from './basic';
import { input as categorization } from './categorization';
import { input as categorizationStepper } from './categorization-stepper';
import { input as categorizationStepperNav } from './categorization-stepper-nav';
import { input as control } from './control';
import { input as controlOptions } from './control-options';
import { input as groupLayout } from './group-layout';
import { input as horizontalLayout } from './horizontal-layout';
import { input as listWithDetails } from './list-with-details';
import { input as login } from './login';
import { input as main } from './main';
import { input as nestedLayout } from './nested-layout';
import { input as noSchemas } from './no-schemas';
import { input as noUISchema } from './no-ui-schema';
import { input as oneOf } from './oneOf';
import { input as radio } from './radio';
import { input as rule } from './rule';
import { input as verticalLayout } from './vertical-layout';

export const examples = [
    {
        title: "Main",
        input: main
    },
    {
        title: "Basic",
        input: basic
    },
    {
        title: "Control",
        input: control
    },
    {
        title: "Control Options",
        input: controlOptions
    },
    {
        title: "Categorization",
        input: categorization
    },
    {
        title: "Categorization Stepper",
        input: categorizationStepper
    },
    {
        title: "Categorization Stepper With Navigation",
        input: categorizationStepperNav
    },
    {
        title: "Horizontal Layout",
        input: horizontalLayout
    },
    {
        title: "Vertical Layout",
        input: verticalLayout
    },
    {
        title: "Group Layout",
        input: groupLayout
    },
    {
        title: "Nested Layout",
        input: nestedLayout
    },
    {
        title: "Array",
        input: array
    },
    {
        title: "Rule",
        input: rule
    },
    {
        title: "Login",
        input: login
    },
    {
        title: "Radio",
        input: radio
    },
    {
        title: "Generate UI Schema",
        input: noUISchema
    },
    {
        title: "Generate Both Schemas",
        input: noSchemas
    },
    {
        title: "Combinators oneOf",
        input: oneOf
    },
    {
        title: "Combinators anyOf",
        input: anyOf
    },
    {
        title: "Combinators allOf",
        input: allOf
    },
    {
        title: "List With Details",
        input: listWithDetails
    },
]