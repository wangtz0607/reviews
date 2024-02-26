<template>
  <template v-if="cls !== null">
    <div class="my-4">
      <h1 class="mb-2">{{ className }}</h1>
      <div>
        <router-link :to="`/courses/${cls.course.id}`" custom v-slot="{ href, navigate }">
          <a :href="href">
            <v-chip @click="navigate" class="my-2 mr-2" color="primary" link prepend-icon="mdi-book-open-page-variant">{{ cls.course.name }}</v-chip>
          </a>
        </router-link>
        <router-link v-for="instructor in cls.instructors" :key="instructor.id" :to="`/staffs/${instructor.id}`" custom v-slot="{ href, navigate }">
          <a :href="href">
            <v-chip @click="navigate" class="my-2 mr-2" color="primary" link prepend-icon="mdi-account">{{ instructor.name }}</v-chip>
          </a>
        </router-link>
      </div>
      <div class="d-flex align-center mt-2">
        <v-rating :model-value="(cls.rating ?? 0) / 2" :color="cls.rating === null ? 'black' : 'orange'" density="compact" half-increments readonly/>
        <span class="font-weight-bold ml-2">{{ cls.rating?.toFixed(1) ?? 'N/A' }}</span>
        <span class="ml-2">({{ cls.numEffectiveReviews }} {{ cls.numEffectiveReviews === 1 ? 'effective review' : 'effective reviews' }})</span>
      </div>
    </div>
    <div class="d-flex align-center my-4">
      <h2>Reviews ({{ cls.numReviews }})</h2>
      <router-link v-if="cls.myReview === null" :to="`/classes/${$route.params.classId}/write`" custom v-slot="{ navigate }">
        <v-btn @click="this.$root.ensureLoggedIn() && navigate()" class="ml-auto" color="primary" prepend-icon="mdi-pencil" variant="flat">Write Review</v-btn>
      </router-link>
      <v-btn v-else @click="$root.confirm('Delete my review?', 'Yes', 'No').then(yes => yes && deleteMyReview())" class="ml-auto" color="red" prepend-icon="mdi-delete" variant="tonal">Delete My Review</v-btn>
    </div>
    <ReviewList :endpoint="`/classes/${$route.params.classId}/reviews`" @reviews-change="loadClass" ref="reviewList"/>
  </template>
</template>

<script>
import axios from 'axios';
import ReviewList from '@/components/ReviewList';

export default {
  name: 'ClassView',
  components: { ReviewList },
  data() {
    return {
      cls: null
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
        document.title = `${this.className} · Classes`;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async deleteMyReview() {
      this.$refs.reviewList.activeReview = this.cls.myReview;
      return await this.$refs.reviewList.deleteReview();
    }
  },
  async mounted() {
    await this.loadClass();
  }
};
</script>
