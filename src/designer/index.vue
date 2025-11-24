<script setup lang="ts">
import {
  ArrowDown as ElIconArrowDown,
  ArrowDownBold as ElIconArrowDownBold,
  ArrowUpBold as ElIconArrowUpBold,
  Delete as ElIconDelete,
  Setting as ElIconGear,
} from '@element-plus/icons-vue'

import { useLocale } from '../locales'

import Apercu from './apercu.vue'

import type { BaseField, FormItemType } from '../types'
import type { ElForm } from 'element-plus'

defineOptions({
  name: 'EdfDesigner',
})

const props = withDefaults(defineProps<{
  showButtons?: boolean | 'hover'
}>(), {
  showButtons: true,
})

const { t } = useLocale()

const fields = defineModel({
  type: Array as () => BaseField[],
  default: () => ref([] as BaseField[]),
})

const appendingField = ref<BaseField & { idx: number, hasDefault?: boolean, newOption?: string }>()
const appendingFormRules = {
  label: [{ required: true, message: t('edf.designer.formRules.nameCannotBe'), trigger: 'blur' }],
  options: [
    {
      validator: (rule: any, value: string[]) => {
        if (appendingField.value?.type === 'radio' || appendingField.value?.type === 'checkbox') {
          if (!value || value.length === 0) {
            return new Error(t('edf.designer.formRules.optionsCannotBeEmpty'))
          }
        }
        return true
      },
      trigger: 'blur',
    },
  ],
}
const appendingFormRef = ref<InstanceType<typeof ElForm> | null>(null)
const apercuRefs = useTemplateRef<InstanceType<typeof Apercu>[]>('apercu')
async function saveAppending() {
  const nf = appendingField.value
  if (!nf) return
  if (appendingFormRef.value) {
    if (!(await appendingFormRef.value.validate().catch(() => false))) {
      return
    }
  }
  fields.value.splice(nf.idx, 1, {
    label: nf.label,
    type: nf.type,
    placeholder: nf.placeholder,
    default_value: nf.hasDefault ? nf.default_value : undefined,
    is_require: nf.is_require,
    options: nf.options,
  })
  appendingField.value = undefined
}

const allFieldTypes: { value: FormItemType, label: string }[] = ([
  'input',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'switch',
  'img',
  'speech',
  'video',
] as const).map((type) => ({ value: type, label: t(`edf.designer.items.${type}`) }))
</script>

<template>
  <div>
    <div class="flex flex-col">
      <el-form label-width="auto">
        <template v-for="(field, idx) in fields" :key="field.label + field.type">
          <el-form-item
            class="apercu-line"
            :label="appendingField?.idx === idx ? appendingField.label : field.label"
            :required="appendingField?.idx === idx ? appendingField.is_require : field.is_require"
            :style="{ order: idx }"
            @dblclick="appendingField = { ...field, idx, hasDefault: field.default_value !== undefined }"
          >
            <apercu ref="apercu" :field="appendingField?.idx === idx ? appendingField : field" class="flex flex-1 select-none" />
            <span :class="['ml-2 flex gap-4', showButtons === 'hover' ? 'operation-btns-hover' : !showButtons ? 'hidden' : '']">
              <el-icon
                class="cursor-pointer"
                :color="idx === 0 ? 'lightgray' : 'gray'"
                :title="t('edf.designer.ui.moveUp')"
                @click="idx > 0 && fields.splice(idx - 1, 0, fields.splice(idx, 1)[0])"
              >
                <el-icon-arrow-up-bold />
              </el-icon>
              <el-icon
                class="cursor-pointer"
                :color="idx === fields.length - 1 ? 'lightgray' : 'gray'"
                :title="t('edf.designer.ui.moveDown')"
                @click="idx < fields.length - 1 && fields.splice(idx + 1, 0, fields.splice(idx, 1)[0])"
              >
                <el-icon-arrow-down-bold />
              </el-icon>
              <el-icon
                class="cursor-pointer"
                color="gray"
                :title="t('edf.designer.ui.settings')"
                @click="appendingField = { ...field, idx, hasDefault: field.default_value !== undefined }"
              >
                <el-icon-gear />
              </el-icon>
              <el-icon
                color="red"
                :title="t('edf.designer.ui.delete')" class="cursor-pointer"
                @click="fields.splice(idx, 1)"
              >
                <el-icon-delete />
              </el-icon>
            </span>
          </el-form-item>
        </template>
      </el-form>

      <el-popover
        :visible="typeof appendingField?.idx === 'number'"
        :virtual-ref="apercuRefs?.[appendingField?.idx!]"
        virtual-triggering
        :title="t('edf.designer.ui.fieldSettings')"
        placement="bottom"
        width="500"
      >
        <div class="my-4 gap-4 min-h-30">
          <template v-if="typeof appendingField?.idx === 'number'">
            <el-form ref="appendingFormRef" label-width="auto" :rules="appendingFormRules" :model="appendingField">
              <el-form-item prop="label" :label="t('edf.designer.ui.labelName')" required>
                <el-input v-model="appendingField.label" :placeholder="t('edf.designer.ui.labelName')" />
              </el-form-item>
              <template v-if="appendingField.type === 'input' || appendingField.type === 'textarea'">
                <el-form-item prop="placeholder" :label="t('edf.designer.ui.placeholder')">
                  <el-input v-model="appendingField.placeholder" :placeholder="t('edf.designer.ui.placeholder')" />
                </el-form-item>
              </template>
              <template v-if="appendingField.type === 'radio' || appendingField.type === 'checkbox' || appendingField.type === 'select'">
                <el-form-item prop="options" :label="t('edf.designer.ui.options')" required>
                  <el-tag
                    v-for="option in appendingField.options"
                    :key="option"
                    class="mr-1 mb-1"
                    closable
                    @close="() => {
                      if (!appendingField?.options) return
                      appendingField.options = appendingField.options?.filter((opt) => opt !== option)
                    }"
                  >
                    {{ option }}
                  </el-tag>
                  <el-input v-model="appendingField.newOption" :placeholder="t('edf.designer.ui.newOption')" class="my-2">
                    <template #append>
                      <el-button
                        @click="
                          () => {
                            if (!appendingField?.newOption) return
                            if (appendingField.newOption.trim() !== '') {
                              appendingField.options ??= []
                              appendingField.options.push(appendingField.newOption.trim())
                              appendingField.newOption = ''
                            }
                          }
                        "
                      >
                        {{ t('edf.designer.ui.add') }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </template>
              <el-form-item prop="default_value" :label="t('edf.designer.ui.defaultValue')">
                <el-checkbox v-model="appendingField.hasDefault" />
                <template v-if="appendingField.type === 'input' || appendingField.type === 'textarea'">
                  <el-input v-show="appendingField.hasDefault" v-model="appendingField.default_value" :placeholder="t('edf.designer.ui.defaultValue')" />
                </template>
                <template v-else-if="appendingField.type === 'select' || appendingField.type === 'radio' || appendingField.type === 'checkbox'">
                  <el-select
                    v-show="appendingField.hasDefault"
                    :model-value="appendingField.default_value"
                    @update:model-value="(val) => {
                      if (!appendingField) return
                      appendingField.default_value = val
                    }"
                    :placeholder="t('edf.designer.ui.defaultValue')"
                    :multiple="appendingField.type === 'checkbox'"
                  >
                    <el-option v-for="option in appendingField.options" :key="option" :label="option" :value="option" />
                  </el-select>
                </template>
                <template v-else-if="appendingField.type === 'switch'">
                  <el-select v-show="appendingField.hasDefault" v-model="appendingField.default_value" :placeholder="t('edf.designer.ui.defaultValue')">
                    <el-option :label="t('edf.designer.ui.open')" :value="true" />
                    <el-option :label="t('edf.designer.ui.close')" :value="false" />
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item prop="is_require" :label="t('edf.designer.ui.required')">
                <el-checkbox v-model="appendingField.is_require" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveAppending">{{ t('edf.designer.ui.save') }}</el-button>
                <el-button @click="appendingField = undefined">{{ t('edf.designer.ui.cancel') }}</el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </el-popover>
    </div>

    <el-dropdown trigger="click" placement="bottom">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="{ value: type, label } in allFieldTypes"
            :key="type"
            @click="() => {
              fields.push({
                label: label,
                type: type,
                placeholder: '',
                is_require: false,
                options: type === 'radio' || type === 'checkbox' ? [t('edf.designer.ui.option1'), t('edf.designer.ui.option2')] : undefined,
              })
            }"
          >
            {{ label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <el-button>
        {{ t('edf.designer.ui.appendField') }}
        <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
      </el-button>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.apercu-line {
  .operation-btns-hover {
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover .operation-btns-hover {
    opacity: 1;
  }
}
</style>
