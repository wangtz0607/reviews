<template>
  <template v-if="staff !== null">
    <div class="my-4">
      <h1 class="mb-2">{{ staff.name }}</h1>
      <div>
        <v-chip class="mt-2 mr-2" prepend-icon="mdi-pound">{{ staff.officialId }}</v-chip>
      </div>
    </div>
    <h2 class="my-4">Classes ({{ staff.numClasses }})</h2>
    <ClassItem v-for="cls in classes" :key="cls.id" :cls="cls"/>
    <v-btn @click="loadClasses" variant="text" block :disabled="noMoreClasses || $store.getters.loading">{{ noMoreClasses ? 'Nothing more' : 'Load More' }}</v-btn>
  </template>
</template>

<script>
import axios from 'axios';
import ClassItem from '@/components/ClassItem';

export default {
  name: 'StaffView',
  components: {ClassItem},
  data() {
    return {
      staff: null,
      classes: [],
      noMoreClasses: false
    };
  },
  methods: {
    async loadStaff() {
      this.$store.commit('startLoading');
      try {
        this.staff = (await axios.get(`${process.env.VUE_APP_BACKEND}/staffs/${this.$route.params.staffId}`)).data;
        document.title = `${this.staff.name} · Instructors`;
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
        let newClasses = (await axios.get(`${process.env.VUE_APP_BACKEND}/staffs/${this.$route.params.staffId}/classes`, { params: { limit: 20, offset: this.classes.length } })).data;
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
    (await this.loadStaff()) && (await this.loadClasses());
  }
};
</script>
