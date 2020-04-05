<template>
  <v-container>
    <v-card class="mx-auto" max-width="400">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">Setup a repository</v-list-item-title>
          <v-list-item-subtitle>Please enter the following details</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <v-row>
          <v-text-field v-model="project.username" label="User/Organization">
            <v-icon slot="prepend">mdi-account</v-icon>
          </v-text-field>
        </v-row>
        <v-row>
          <v-text-field v-model="project.repo" label="Repository">
            <v-icon slot="prepend">mdi-source-repository</v-icon>
          </v-text-field>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-on:click="addProject()" text>Add this project</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar">
      {{ text }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { checkIfRepositoryExists } from "../utils/api";
export default Vue.extend({
  name: "Repository",
  data() {
    return {
      project: {
        username: "",
        repo: "",
        ownerAvatar: "",
        description: ""
      },
      snackbar: false,
      text: "Invalid Project Details"
    };
  },
  methods: {
    addProject() {
      checkIfRepositoryExists(this.project).then(
        ({data}) => {
          this.project.ownerAvatar = data.owner.avatar_url;
          this.project.description = data.description;
          this.$store.dispatch("setupProject", this.project);
        },
        () => {
          this.snackbar = true;
        }
      );
    }
  }
});
</script>