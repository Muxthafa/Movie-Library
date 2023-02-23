<template>
    <div class="app">
        <slot />
    </div>
</template>

<script setup>
  definePageMeta({
    keepalive: true
  })
</script>
