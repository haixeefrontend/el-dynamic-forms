<script setup lang="ts">
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
      <el-radio v-for="option in field.options" :label="option" :key="option">{{ option }}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-else-if="field.type === 'checkbox'" disabled>
      <el-checkbox v-for="option in field.options" :label="option" :key="option">{{ option }}</el-checkbox>
    </el-checkbox-group>
    <el-switch v-else-if="field.type === 'switch'" disabled />
    <div v-else-if="field.type === 'img'">[图片上传]</div>
    <div v-else-if="field.type === 'speech'">[语音上传]</div>
    <div v-else-if="field.type === 'video'">[视频上传]</div>
  </div>
</template>

<style lang="scss" scoped></style>
