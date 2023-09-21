<template>
  <div class="font-sans overflow-y-auto overflow-x-hidden max-h-[60vh]">
    <table class="w-full">
      <tbody>
        <tr
          v-for="(item, index) in list"
          :key="index"
          class="h-16"
          :class="index % 2 ? 'bg-[#FEEFE1]' : 'bg-[#F9DCC2]'"
        >
          <td class="w-40">{{ index + 1 }}</td>
          <td class="flex-grow">
            {{ item.account }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({ list: Array });
</script>
