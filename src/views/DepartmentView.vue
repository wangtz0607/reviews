<template>
  <template v-if="department !== null">
    <div class="d-flex align-center my-4 mb-2">
      <h1>{{ department.name }}</h1>
    </div>
    <h2 class="my-4">Courses ({{ department.numCourses }})</h2>
    <CourseItem v-for="course in courses" :key="course.id" :course="course"/>
    <v-btn @click="loadCourses" variant="text" block :disabled="noMoreCourses || $store.getters.loading">{{ noMoreCourses ? 'Nothing more' : 'Load More' }}</v-btn>
  </template>
</template>

<script>
import axios from 'axios';
import CourseItem from '@/components/CourseItem';

export default {
  name: 'DepartmentView',
  components: { CourseItem },
  data() {
    return {
      department: null,
      courses: [],
      noMoreCourses: false
    };
  },
  methods: {
    async loadDepartment() {
      this.$store.commit('startLoading');
      try {
        this.department = (await axios.get(`${process.env.VUE_APP_BACKEND}/departments/${this.$route.params.departmentId}`)).data;
        document.title = `${this.department.name} · Departments`;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async loadCourses() {
      this.$store.commit('startLoading');
      try {
        let newCourses = (await axios.get(`${process.env.VUE_APP_BACKEND}/departments/${this.$route.params.departmentId}/courses`, { params: { limit: 20, offset: this.courses.length } })).data;
        this.courses.push(...newCourses);
        if (newCourses.length < 20) {
          this.noMoreCourses = true;
        }
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
    (await this.loadDepartment()) && (await this.loadCourses());
  }
};
</script>
