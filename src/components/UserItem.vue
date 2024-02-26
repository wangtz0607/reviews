<template>
  <router-link :to="`/users/${user.id}`" custom v-slot="{ href, navigate }">
    <a :href="href">
      <v-card @click="navigate" class="my-2 px-4 py-2">
        <div class="d-flex align-center">
          <v-avatar :image="gravatarImage"/>
          <div class="ml-4">
            <p><strong>{{ user.name ?? user.username }}</strong> ({{ user.username }})</p>
            <p style="font-size: 14px; opacity: 0.6">
              <span>{{ user.numReviews }} {{ user.numReviews === 1 ? 'review' : 'reviews' }}</span>
              <span class="ml-2">{{ user.numEffectiveReviews }} {{ user.numEffectiveReviews === 1 ? 'effective review' : 'effective reviews' }}</span>
            </p>
          </div>
        </div>
      </v-card>
    </a>
  </router-link>
</template>

<script>
export default {
  name: 'UserItem',
  props: ['user'],
  computed: {
    gravatarImage() {
      return `${process.env.VUE_APP_GRAVATAR}/avatar/${this.user.gravatarHash}?d=mp`;
    }
  }
};
</script>
