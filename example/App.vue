<script setup lang="ts">
defineOptions({
  name: 'App',
})

const fields = ref([])
</script>

<template>
  <div>
    <hr class="my-8" />
    <div class="mb-4">designer test</div>
    <div>
      <edf-designer v-model="fields" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
