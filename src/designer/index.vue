<script setup lang="ts">
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'

import Apercu from './apercu.vue'

import type { BaseField } from '../types'
import type { ElForm } from 'element-plus'

defineOptions({
  name: 'EdfDesigner',
})

const fields = defineModel({
  type: Array as () => BaseField[],
  default: () => ref([] as BaseField[]),
})

const appendingField = ref<BaseField & { hasDefault?: boolean, newOption?: string }>()
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
async function saveAppending() {
  const nf = appendingField.value
  if (!nf) return
  if (appendingFormRef.value) {
    if (!(await appendingFormRef.value.validate().catch(() => false))) {
      return
    }
  }
  fields.value.push({
    name: nf.name,
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
    <template v-for="(field, idx) in fields" :key="field.name + field.type">
      <el-form label-width="auto">
        <el-form-item :label="field.label">
          <apercu :field="field" class="flex flex-1" />
        </el-form-item>
      </el-form>
    </template>

    <el-card v-if="appendingField" class="my-4 flex gap-4">
      <el-form ref="appendingFormRef" label-width="auto" :rules="appendingFormRules" :model="appendingField">
        <div>
          <label>预览</label>
          <el-form-item class="shadow py-2 pr-4" :label="appendingField.label || ' '" size="large">
            <apercu :field="appendingField" class="flex flex-1" />
          </el-form-item>
        </div>
        <el-form-item prop="name" label="字段名称" required>
          <el-input v-model="appendingField.name" placeholder="字段名称" size="small" />
        </el-form-item>
        <el-form-item prop="label" label="标签名" required>
          <el-input v-model="appendingField.label" placeholder="标签名" size="small" />
        </el-form-item>
        <template v-if="appendingField.type === 'input' || appendingField.type === 'textarea'">
          <el-form-item prop="placeholder" label="占位符">
            <el-input v-model="appendingField.placeholder" placeholder="占位符" size="small" />
          </el-form-item>
        </template>
        <template v-if="appendingField.type === 'radio' || appendingField.type === 'checkbox'">
          <el-form-item prop="options" label="选项" required>
            <el-tag v-for="option in appendingField.options" :key="option">{{ option }}</el-tag>
            <el-input v-model="appendingField.newOption" placeholder="新选项" size="small" class="my-2">
              <template #append>
                <el-button
                  size="small"
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
          <el-input v-show="appendingField.hasDefault" v-model="appendingField.default_value" placeholder="默认值" size="small" />
        </el-form-item>
        <el-form-item prop="is_require" label="必填">
          <el-checkbox v-model="appendingField.is_require" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveAppending">保存</el-button>
          <el-button @click="appendingField = undefined">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dropdown trigger="click" placement="bottom">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="{ value: type, label } in allFieldTypes"
            :key="type"
            @click="() => {
              appendingField = {
                name: '',
                label: '',
                type: type,
                placeholder: '',
                is_require: false,
                options: type === 'radio' || type === 'checkbox' ? [] : undefined,
              }
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

<style lang="scss" scoped></style>
