<template>
  <v-card class="mx-auto" max-width="250">
    <v-img :src="project.ownerAvatar"></v-img>

    <v-card-title>{{ project.repo }}</v-card-title>

    <v-card-subtitle>{{ project.description }}</v-card-subtitle>

    <v-card-actions>
      <v-btn v-on:click="changeProject()" color="red" text>Change Project</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ProjectCard",

  data() {
    return {
      project: this.$store.getters.currentProject
    };
  },

  methods: {
      changeProject() {
        this.$store.dispatch("removeProject");
      }
  }
});
</script>