<template>
  <template v-if="cls !== null">
    <h1 class="my-4">{{ cls.course.name }} ({{ cls.instructors.map(instructor => instructor.name).join(', ') }})</h1>
    <h2>Write Review</h2>
    <h3 class="my-2">Semester</h3>
    <v-row class="ma-0">
      <v-col class="pa-0">
        <v-text-field v-model.number="year" hide-details variant="underlined"/>
      </v-col>
      <v-col class="pa-0 ml-2">
        <v-select :items="['Spring', 'Fall']" v-model="semester" hide-details variant="underlined"/>
      </v-col>
    </v-row>
    <h3 class="my-2">Review</h3>
    <v-textarea v-model="review" auto-grow class="my-2" hide-details rows="10" variant="underlined"/>
    <h3 class="my-2 text-center">Give your rating</h3>
    <div class="my-2 text-center">
      <v-btn-toggle v-model="rating">
        <v-btn v-for="n in 11" :key="n" color="primary">{{ n - 1 }}</v-btn>
      </v-btn-toggle>
    </div>
    <v-checkbox label="Anonymous" v-model="anonymous"/>
    <v-btn @click="previewDialog = true" block color="primary" variant="flat">Preview</v-btn>
  </template>
  <v-dialog v-model="previewDialog" width="800">
    <v-card elevation="0">
      <v-card-text>
        <div class="d-flex align-center">
          <v-chip prepend-icon="mdi-calendar-month" size="small">{{ semester }} {{ year }}</v-chip>
          <v-rating :model-value="(rating ?? 0) / 2" class="ml-2" color="orange" density="compact" half-increments readonly/>
          <span class="font-weight-bold ml-2">{{ rating ?? 'N/A' }}</span>
        </div>
        <p v-for="paragraph in review.split('\n')" :key="paragraph" class="my-4">{{ paragraph }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="previewDialog = false" color="primary" variant="text">Continue Editing</v-btn>
        <v-btn @click="postReview" :disabled="year === '' || semester === null || review === '' || rating === undefined || $store.getters.loading" color="primary" variant="text">Publish</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'WriteReviewView',
  data() {
    return {
      cls: null,
      year: new Date().getFullYear(),
      semester: 'Spring',
      review: '',
      rating: undefined,
      anonymous: false,
      previewDialog: false
    };
  },
  computed: {
    className() {
      return `${this.cls.course.name} (${this.cls.instructors.map(instructor => instructor.name).join(', ')})`;
    }
  },
  methods: {
    async loadClass() {
      this.$store.commit('startLoading');
      try {
        this.cls = (await axios.get(`${process.env.VUE_APP_BACKEND}/classes/${this.$route.params.classId}`)).data;
        document.title = `Write Review · ${this.className} · Classes`;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async postReview() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/classes/${this.cls.id}/reviews`, {
          year: this.year,
          semester: this.semester,
          rating: this.rating,
          review: this.review,
          anonymous: this.anonymous
        });
        this.$router.push(`/classes/${this.cls.id}`);
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
    await this.loadClass();
  }
};
</script>
