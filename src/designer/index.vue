<script setup lang="ts">
import {
  ArrowDown as ElIconArrowDown,
  ArrowDownBold as ElIconArrowDownBold,
  ArrowUpBold as ElIconArrowUpBold,
  Delete as ElIconDelete,
  Setting as ElIconGear,
} from '@element-plus/icons-vue'

import Apercu from './apercu.vue'

import type { BaseField } from '../types'
import type { ElForm } from 'element-plus'

defineOptions({
  name: 'EdfDesigner',
})

const props = withDefaults(defineProps<{
  showButtons?: boolean | 'hover'
}>(), {
  showButtons: true,
})

const fields = defineModel({
  type: Array as () => BaseField[],
  default: () => ref([] as BaseField[]),
})

const appendingField = ref<BaseField & { idx: number, hasDefault?: boolean, newOption?: string }>()
const appendingFormRules = {
  name: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
  label: [{ required: true, message: '标签名不能为空', trigger: 'blur' }],
  options: [
    {
      validator: (rule: any, value: string[]) => {
        if (appendingField.value?.type === 'radio' || appendingField.value?.type === 'checkbox') {
          if (!value || value.length === 0) {
            return new Error('选项不能为空')
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

const allFieldTypes = [
  { value: 'input', label: '输入框' },
  { value: 'textarea', label: '多行输入框' },
  { value: 'radio', label: '单选框' },
  { value: 'checkbox', label: '多选框' },
  { value: 'switch', label: '开关' },
  { value: 'img', label: '图片上传' },
  { value: 'speech', label: '语音上传' },
  { value: 'video', label: '视频上传' },
] as const
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
                :color="idx === 0 ? 'lightgray' : 'gray'"
                title="上移"
                @click="idx > 0 && fields.splice(idx - 1, 0, fields.splice(idx, 1)[0])"
              >
                <el-icon-arrow-up-bold />
              </el-icon>
              <el-icon
                :color="idx === fields.length - 1 ? 'lightgray' : 'gray'"
                title="下移"
                @click="idx < fields.length - 1 && fields.splice(idx + 1, 0, fields.splice(idx, 1)[0])"
              >
                <el-icon-arrow-down-bold />
              </el-icon>
              <el-icon
                color="gray"
                title="设置"
                @click="appendingField = { ...field, idx, hasDefault: field.default_value !== undefined }"
              >
                <el-icon-gear />
              </el-icon>
              <el-icon color="red" title="删除" @click="fields.splice(idx, 1)"><el-icon-delete /></el-icon>
            </span>
          </el-form-item>
        </template>
      </el-form>

      <el-popover
        :visible="typeof appendingField?.idx === 'number'"
        :virtual-ref="apercuRefs?.[appendingField?.idx!]"
        title="字段设置"
        placement="bottom"
        width="500"
      >
        <div class="my-4 gap-4 min-h-30">
          <template v-if="typeof appendingField?.idx === 'number'">
            <el-form ref="appendingFormRef" :label-width="appendingField ? 'auto' : 100" :rules="appendingFormRules" :model="appendingField">
              <el-form-item prop="label" label="标签名" required>
                <el-input v-model="appendingField.label" placeholder="标签名" />
              </el-form-item>
              <template v-if="appendingField.type === 'input' || appendingField.type === 'textarea'">
                <el-form-item prop="placeholder" label="占位符">
                  <el-input v-model="appendingField.placeholder" placeholder="占位符" />
                </el-form-item>
              </template>
              <template v-if="appendingField.type === 'radio' || appendingField.type === 'checkbox'">
                <el-form-item prop="options" label="选项" required>
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
                  <el-input v-model="appendingField.newOption" placeholder="新选项" class="my-2">
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
                        添加
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </template>
              <el-form-item prop="default_value" label="默认值">
                <el-checkbox v-model="appendingField.hasDefault" />
                <el-input v-show="appendingField.hasDefault" v-model="appendingField.default_value" placeholder="默认值" />
              </el-form-item>
              <el-form-item prop="is_require" label="必填">
                <el-checkbox v-model="appendingField.is_require" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveAppending">保存</el-button>
                <el-button @click="appendingField = undefined">取消</el-button>
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
                options: type === 'radio' || type === 'checkbox' ? ['选项1', '选项2'] : undefined,
              })
            }"
          >
            {{ label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <el-button>添加字段<el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon></el-button>
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
