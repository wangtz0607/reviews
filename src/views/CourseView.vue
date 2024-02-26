<template>
  <template v-if="course !== null">
    <div class="my-4">
      <div class="d-flex align-center mb-2">
        <h1>{{ course.name }}</h1>
        <v-badge color="primary" :content="course.audience" inline/>
        <v-badge color="primary" :content="course.type" inline/>
      </div>
      <div>
        <v-chip class="mt-2 mr-2" prepend-icon="mdi-pound">{{ course.officialId }}</v-chip>
        <router-link :to="`/departments/${course.department.id}`" custom v-slot="{ href, navigate }">
          <a :href="href">
            <v-chip @click="navigate" class="mt-2 mr-2" color="primary" link prepend-icon="mdi-school">{{ course.department.name }}</v-chip>
          </a>
        </router-link>
        <v-chip class="mt-2 mr-2" prepend-icon="mdi-calendar-expand-horizontal">{{ course.periods }} {{ course.periods === 1 ? 'period' : 'periods' }}</v-chip>
        <v-chip class="mt-2 mr-2" prepend-icon="mdi-star-circle">{{ course.credits }} {{ course.credits === 1 ? 'credit' : 'credits' }}</v-chip>
      </div>
    </div>
    <h2 class="my-4">Classes ({{ course.numClasses }})</h2>
    <ClassItem v-for="cls in classes" :key="cls.id" :cls="cls"/>
    <v-btn @click="loadClasses" variant="text" block :disabled="noMoreClasses || $store.getters.loading">{{ noMoreClasses ? 'Nothing more' : 'Load More' }}</v-btn>
  </template>
</template>

<script>
import axios from 'axios';
import ClassItem from '@/components/ClassItem';

export default {
  name: 'CourseView',
  components: {ClassItem},
  data() {
    return {
      course: null,
      classes: [],
      noMoreClasses: false
    };
  },
  methods: {
    async loadCourse() {
      this.$store.commit('startLoading');
      try {
        this.course = (await axios.get(`${process.env.VUE_APP_BACKEND}/courses/${this.$route.params.courseId}`)).data;
        document.title = `${this.course.name} · Courses`;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async loadClasses() {
      this.$store.commit('startLoading');
      try {
        let newClasses = (await axios.get(`${process.env.VUE_APP_BACKEND}/courses/${this.$route.params.courseId}/classes`, { params: { limit: 20, offset: this.classes.length } })).data;
        this.classes.push(...newClasses);
        if (newClasses.length < 20) {
          this.noMoreClasses = true;
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
    (await this.loadCourse()) && (await this.loadClasses());
  }
};
</script>
