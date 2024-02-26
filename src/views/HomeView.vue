<template>
  <h1 class="my-4">Home</h1>
  <StatsRow class="my-8"/>
  <router-link to="/classes" custom v-slot="{ href, navigate }">
    <a :href="href">
      <v-btn @click="navigate" block class="my-4" color="primary" prepend-icon="mdi-compass" variant="flat">Discover</v-btn>
    </a>
  </router-link>
  <h2 class="my-4">Latest</h2>
  <ReviewList endpoint="/reviews"/>
</template>

<script>
import StatsRow from '@/components/StatsRow';
import ReviewList from '@/components/ReviewList';

export default {
  name: 'HomeView',
  components: { StatsRow, ReviewList }
};
</script>
