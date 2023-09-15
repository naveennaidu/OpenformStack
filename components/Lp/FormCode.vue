<template>
  <pre v-html="highlightedCode"></pre>
</template>

<script setup lang="ts">
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-dark.css";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: "html",
  },
});

const highlightedCode = computed(() => {
  return hljs.highlight(props.code, { language: props.lang }).value;
});
</script>

<style scoped></style>
