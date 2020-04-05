<template>
  <v-app>
    <Appbar/>
    <v-content>
      <MainApp/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import MainApp from './components/MainApp.vue';
import Appbar from './components/Appbar.vue';

export default Vue.extend({
  name: 'App',

  components: {
    MainApp,
    Appbar
  },

  data: () => ({
    //
  }),
});
</script>
