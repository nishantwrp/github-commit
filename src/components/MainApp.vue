<template>
  <v-container>
    <Repository v-if="!shouldShowDetails" />
    <v-container v-else>
      <ProjectCard />
      <v-container>
        <v-row>
          <v-select v-model="selectedMethod" :items="items" label="Search Commit By" outlined></v-select>
        </v-row>
        <v-row v-if="selectedMethod">
          <v-text-field v-model="query" :label="selectedMethod" outlined></v-text-field>
        </v-row>
        <v-row v-if="selectedMethod">
          <v-btn v-on:click="search()" block color="blue" dark>Search</v-btn>
        </v-row>
      </v-container>
      <CommitCard v-if="commitDetails" :details="commitDetails"/>
    </v-container>
    <v-snackbar v-model="snackbar">
      {{ text }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Repository from "./Repository.vue";
import ProjectCard from "./ProjectCard.vue";
import CommitCard from "./CommitCard.vue";
import { searchByCommitHash, searchByCommitNumber, findCommitNumber } from "../utils/api";

export default Vue.extend({
  name: "MainApp",

  components: {
    Repository,
    ProjectCard,
    CommitCard
  },

  data() {
    return {
      items: ["Commit Number", "Commit Hash"],
      selectedMethod: "",
      query: "",
      snackbar: false,
      text: "No Search Results Found",
      commitDetails: null
    };
  },

  computed: {
    shouldShowDetails(): boolean {
      return this.$store.getters.isProjectSaved;
    }
  },

  methods: {
    search() {
      if (this.selectedMethod === 'Commit Hash') {
        searchByCommitHash(this.$store.getters.currentProject, this.query).then(
          ({data}) => {
            const commitDetails = [];
            commitDetails.push({
              property: 'Commit Hash',
              value: data.sha
            });
            commitDetails.push({
              property: 'Commit Message',
              value: data.message
            });
            commitDetails.push({
              property: 'Commit Link',
              value: data.html_url
            });
            commitDetails.push({
              property: 'Author',
              value: data.author.name
            });
            // @ts-ignore
            this.commitDetails = commitDetails;
            findCommitNumber(this.$store.getters.currentProject, data.sha, data.author.date).then(
              (data) => {
                // @ts-ignore
                this.commitDetails.push(
                  {
                    property: 'Commit Number',
                    value: data
                  }
                )
              }
            );
          },
          () => {
            this.snackbar = true;
          }
        );
      } else {
        const q = searchByCommitNumber(this.$store.getters.currentProject, this.query);
        q.promise.then(
          ({data}) => {
            const commit = data[q.commitNumber];
            const commitDetails = [];
            commitDetails.push({
              property: 'Commit Hash',
              value: commit.sha
            });
            commitDetails.push({
              property: 'Commit Number',
              value: this.query
            })
            commitDetails.push({
              property: 'Commit Message',
              value: commit.commit.message
            });
            commitDetails.push({
              property: 'Commit Link',
              value: commit.html_url
            });
            commitDetails.push({
              property: 'Author',
              value: commit.commit.author.name
            });
            // @ts-ignore
            this.commitDetails = commitDetails;
          },
          () => {
            this.snackbar = true;
          }
        )
      }
    }
  }
});
</script>
