<template>
    <div class="flex flex-col gap-1">
      <InputText :name="name" :type="type" :placeholder="placeholder" fluid />
      <Message v-if="$form[name]?.invalid" severity="error" size="small" variant="simple">{{
        $form[name]?.error?.message
      }}</Message>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import InputText from 'primevue/inputtext';
  import Message from 'primevue/message';

  interface Props {
    name: string;
    type?: text;
    placeholder?: string
  }
  
  const { name, type = 'text', placeholder } = defineProps<Props>();

  </script>
  