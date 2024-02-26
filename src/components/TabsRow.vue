<template>
  <v-tabs v-if="stats !== null" :model-value="selected" class="my-2" fixed-tabs>
    <router-link to="/classes" custom v-slot="{ navigate }">
      <v-tab @click="navigate">Classes ({{ stats.numClasses }})</v-tab>
    </router-link>
    <router-link to="/courses" custom v-slot="{ navigate }">
      <v-tab @click="navigate">Courses ({{ stats.numCourses }})</v-tab>
    </router-link>
    <router-link to="/staffs" custom v-slot="{ navigate }">
      <v-tab @click="navigate">Instructors ({{ stats.numStaffs }})</v-tab>
    </router-link>
    <router-link to="/departments" custom v-slot="{ navigate }">
      <v-tab @click="navigate">Departments ({{ stats.numDepartments }})</v-tab>
    </router-link>
    <router-link to="/users" custom v-slot="{ navigate }">
      <v-tab @click="navigate">Users ({{ stats.numUsers }})</v-tab>
    </router-link>
  </v-tabs>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TabsRow',
  props: ['selected'],
  data() {
    return {
      stats: null
    };
  },
  methods: {
    async loadStats() {
      try {
        this.stats = (await axios.get(`${process.env.VUE_APP_BACKEND}/stats`)).data;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      }
      return true;
    }
  },
  async mounted() {
    await this.loadStats();
  }
};
</script>
