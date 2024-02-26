<template>
  <template v-if="user !== null">
    <div class="d-flex align-center my-4">
      <v-img :src="gravatarImage" style="flex: 0 0 100px"/>
      <div class="ml-8">
        <p style="font-size: 32px"><strong>{{ user.name ?? user.username }}</strong> ({{ user.username }})</p>
        <div style="opacity: 0.6">
          <p>Joined on {{ new Date(user.registrationTime).toLocaleDateString('en-US', { dateStyle: 'long' }) }}</p>
          <p>{{ user.numEffectiveReviews }} {{ user.numEffectiveReviews === 1 ? 'effective review' : 'effective reviews' }}</p>
        </div>
      </div>
    </div>
    <h2 class="my-4">Reviews ({{ user.numReviews }})</h2>
    <ReviewList :endpoint="`/users/${this.user.id}/reviews`" @reviews-change="loadUser"/>
  </template>
</template>

<script>
import axios from 'axios';
import ReviewList from '@/components/ReviewList';

export default {
  name: 'UserView',
  components: { ReviewList },
  data() {
    return {
      user: null
    };
  },
  methods: {
    async loadUser() {
      this.$store.commit('startLoading');
      try {
        this.user = (await axios.get(`${process.env.VUE_APP_BACKEND}/users/${this.$route.params.userId}`)).data;
        document.title = `${this.user.name ?? this.user.username} (${this.user.username}) · Users`;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    }
  },
  computed: {
    gravatarImage() {
      return `${process.env.VUE_APP_GRAVATAR}/avatar/${this.user.gravatarHash}?d=mp&s=200`;
    }
  },
  async mounted() {
    await this.loadUser();
  }
};
</script>
