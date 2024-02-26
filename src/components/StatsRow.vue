<template>
  <template v-if="stats !== null">
    <v-row class="justify-center text-center mx-0 my-0">
      <v-col class="pa-0" cols="2">
        <p class="count">{{ stats.numClasses }}</p>
        <p class="name">{{ stats.numClasses === 1 ? 'Class' : 'Classes' }}</p>
      </v-col>
      <v-col class="pa-0 divider" cols="2">
        <p class="count">{{ stats.numCourses }}</p>
        <p class="name">{{ stats.numCourses === 1 ? 'Course' : 'Courses' }}</p>
      </v-col>
      <v-col class="pa-0 divider" cols="2">
        <p class="count">{{ stats.numStaffs }}</p>
        <p class="name">{{ stats.numStaffs === 1 ? 'Instructor' : 'Instructors' }}</p>
      </v-col>
      <v-col class="pa-0 divider" cols="2">
        <p class="count">{{ stats.numDepartments }}</p>
        <p class="name">{{ stats.numDepartments === 1 ? 'Department' : 'Departments' }}</p>
      </v-col>
      <v-col class="pa-0 divider" cols="2">
        <p class="count">{{ stats.numReviews }}</p>
        <p class="name">{{ stats.numReviews === 1 ? 'Review' : 'Reviews' }}</p>
      </v-col>
      <v-col class="pa-0 divider" cols="2">
        <p class="count">{{ stats.numUsers }}</p>
        <p class="name">{{ stats.numUsers === 1 ? 'User' : 'Users' }}</p>
      </v-col>
    </v-row>
  </template>
</template>

<style scoped>
.divider {
  border-left: 2px solid #eee;
}
.count {
  font-size: 20px;
  font-weight: bold;
}
.name {
  font-size: 14px;
  opacity: 0.8;
}
</style>

<script>
import axios from 'axios';

export default {
  name: 'StatsRow',
  data() {
    return {
      stats: null
    };
  },
  methods: {
    async loadStats() {
      this.$store.commit('startLoading');
      try {
        this.stats = (await axios.get(`${process.env.VUE_APP_BACKEND}/stats`)).data;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    }
  },
  async mounted() {
    await this.loadStats();
  }
};
</script>
