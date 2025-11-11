<script setup lang="ts">
defineOptions({
  name: 'App',
})

const fields = ref([])
</script>

<template>
  <div>
    <div>designer test</div>
    <div>
      <edf-designer v-model="fields" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
