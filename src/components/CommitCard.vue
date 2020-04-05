<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Commit Properties</th>
          <th class="text-left">Commit Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in details" :key="item.name">
          <td><b>{{ item.property }}</b></td>
          <td v-if="item.property === 'Commit Link'" ><a :href="item.value" target="_blank">{{ item.value }}</a></td>
          <td v-else >{{ item.value }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CommitCard",
  props: {
    details: Array
  }
});
</script>