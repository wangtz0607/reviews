<template>
  <router-link :to="`/classes/${cls.id}`" custom v-slot="{ href, navigate }">
    <a :href="href">
      <v-card @click="navigate" class="my-2 pa-2">
        <h3>{{ cls.course.name }} ({{ cls.instructors.map(instructor => instructor.name).join(', ') }})</h3>
        <div class="d-flex align-center mt-1">
          <v-rating :model-value="(cls.rating ?? 0) / 2" :color="cls.rating === null ? 'black' : 'orange'" density="compact" half-increments readonly/>
          <span class="font-weight-bold ml-2">{{ cls.rating?.toFixed(1) ?? 'N/A' }}</span>
          <span style="font-size: 14px">
            <span class="ml-2">({{ cls.numEffectiveReviews }} {{ cls.numEffectiveReviews === 1 ? 'effective review' : 'effective reviews' }})</span>
            <span class="ml-2">{{ cls.numReviews }} {{ cls.numReviews === 1 ? 'review' : 'reviews' }}</span>
          </span>
          <v-badge v-if="cls.myReview !== null" color="primary" :content="`has my review (rating: ${cls.myReview.rating})`" inline/>
        </div>
      </v-card>
    </a>
  </router-link>
</template>

<script>
export default {
  name: 'ClassItem',
  props: ['cls']
};
</script>
