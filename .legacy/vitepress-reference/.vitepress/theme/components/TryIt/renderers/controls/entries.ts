import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  isNumberControl,
  isIntegerControl,
  isEnumControl,
  isOneOfEnumControl,
  isDateControl,
  isDateTimeControl,
  isTimeControl,
  isBooleanControl,
  and,
  isMultiLineControl,
} from '@jsonforms/core'
import StringControlRenderer from './StringControlRenderer.vue'
import MultiStringControlRenderer from './MultiStringControlRenderer.vue'
import NumberControlRenderer from './NumberControlRenderer.vue'
import IntegerControlRenderer from './IntegerControlRenderer.vue'
import EnumControlRenderer from './EnumControlRenderer.vue'
import oneOfEnumControlRenderer from './EnumOneOfControlRenderer.vue'
import DateControlRenderer from './DateControlRenderer.vue'
import DateTimeControlRenderer from './DateTimeControlRenderer.vue'
import TimeControlRenderer from './TimeControlRenderer.vue'
import BooleanControlRenderer from './BooleanControlRenderer.vue'

export const stringControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: StringControlRenderer,
  tester: rankWith(1, isStringControl),
}

export const multiStringControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: MultiStringControlRenderer,
  tester: rankWith(2, and(isStringControl, isMultiLineControl)),
}

export const numberControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: NumberControlRenderer,
  tester: rankWith(1, isNumberControl),
}

export const integerControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: IntegerControlRenderer,
  tester: rankWith(1, isIntegerControl),
}

export const enumControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: EnumControlRenderer,
  tester: rankWith(2, isEnumControl),
}

export const oneOfEnumControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: oneOfEnumControlRenderer,
  tester: rankWith(5, isOneOfEnumControl),
}

export const dateControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: DateControlRenderer,
  tester: rankWith(2, isDateControl),
}

export const dateTimeControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: DateTimeControlRenderer,
  tester: rankWith(2, isDateTimeControl),
}

export const timeControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: TimeControlRenderer,
  tester: rankWith(2, isTimeControl),
}

export const booleanControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: BooleanControlRenderer,
  tester: rankWith(1, isBooleanControl),
}
