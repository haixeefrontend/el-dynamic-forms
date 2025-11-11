<script setup lang="ts">
import { Plus as ElIconPlus } from '@element-plus/icons-vue'

import { BaseField } from '../types'

defineOptions({
  name: 'Apercu',
})

const props = defineProps<{
  field: BaseField & { hasDefault?: boolean }
}>()
</script>

<template>
  <div>
    <el-input v-if="field.type === 'input'" :placeholder="field.placeholder" :model-value="field.hasDefault ? field.default_value : ''" disabled />
    <el-input v-else-if="field.type === 'textarea'" type="textarea" :placeholder="field.placeholder" :model-value="field.hasDefault ? field.default_value : ''" disabled />
    <el-radio-group v-else-if="field.type === 'radio'" disabled>
      <el-radio v-for="option in field.options" :value="option" :key="option">{{ option }}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-else-if="field.type === 'checkbox'" disabled>
      <el-checkbox v-for="option in field.options" :value="option" :key="option">{{ option }}</el-checkbox>
    </el-checkbox-group>
    <el-switch v-else-if="field.type === 'switch'" disabled />
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
