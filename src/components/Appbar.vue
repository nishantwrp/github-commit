<template>
  <div>
    <v-app-bar
      color="deep-purple accent-4"
      dense
      dark
    >
      <v-icon>mdi-github</v-icon>

      <v-toolbar-title style="padding-left:2px;">Github Commits Info</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'Appbar'
})
</script>