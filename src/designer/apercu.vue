<script setup lang="ts">
import { Plus as ElIconPlus } from '@element-plus/icons-vue'

import { BaseField } from '../types'

defineOptions({
  name: 'Apercu',
})

const props = defineProps<{
  field: BaseField & { hasDefault?: boolean }
}>()

function defaults(otherwise: any, transformer: (v: any) => any = (v) => v) {
  if (props.field.hasDefault !== false) {
    return transformer(props.field.default_value)
  }
  return otherwise
}
</script>

<template>
  <div>
    <el-input v-if="field.type === 'input'" :placeholder="field.placeholder" :model-value="defaults('')" />
    <el-input v-else-if="field.type === 'textarea'" type="textarea" :placeholder="field.placeholder" :model-value="defaults('')" />
    <el-select v-else-if="field.type === 'select'" :placeholder="field.placeholder" :model-value="defaults('')">
      <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
    </el-select>
    <el-radio-group v-else-if="field.type === 'radio'" :model-value="defaults(null)">
      <el-radio v-for="option in field.options" :value="option" :key="option">{{ option }}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-else-if="field.type === 'checkbox'" :model-value="defaults([], (v) => (v ? v.split(',') : []))">
      <el-checkbox v-for="option in field.options" :value="option" :key="option">{{ option }}</el-checkbox>
    </el-checkbox-group>
    <el-switch v-else-if="field.type === 'switch'" :model-value="defaults(false)" />
    <template v-else-if="field.type === 'img' || field.type === 'speech' || field.type === 'video'">
      <div class="flex-center flex-col size-20 gap-1 b-1 b-dashed b-#ccc br-2 text-#999 cursor-pointer">
        <el-icon><el-icon-plus /></el-icon>
        <span class="text-sm">
          上传{{ field.type === 'img' ? '图片' : field.type === 'speech' ? '语音' : '视频' }}
        </span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
