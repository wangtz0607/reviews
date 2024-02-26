<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <router-link :to="`/users/${review.user?.id}`" custom v-slot="{ href, navigate }">
        <a :href="href">
          <v-avatar @click="navigate" :image="gravatarImage"/>
        </a>
      </router-link>
      <div class="ml-4">
        <p><router-link :to="`/users/${review.user?.id}`" style="color: inherit"><strong>{{ review.user?.name ?? review.user?.username ?? '?' }}</strong></router-link> ▸ <router-link :to="`/classes/${review.class.id}`" style="color: inherit"><strong>{{ review.class.course.name }} ({{ review.class.instructors.map(instructor => instructor.name).join(', ') }})</strong></router-link></p>
        <p style="font-size: 14px; opacity: 0.6">{{ new Date(review.time).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) }}</p>
      </div>
    </div>
    <div class="d-flex align-center my-4">
      <v-chip prepend-icon="mdi-calendar-month" size="small">{{ review.semester }} {{ review.year }}</v-chip>
      <v-rating :model-value="review.rating / 2" class="ml-2" color="orange" density="compact" half-increments readonly/>
      <span class="font-weight-bold ml-2">{{ review.rating }}</span>
    </div>
    <p v-for="paragraph in review.review.split('\n')" :key="paragraph" class="my-4">{{ paragraph }}</p>
    <div class="mt-4">
      <v-btn @click="$emit('vote-up-button-click')" :disabled="$store.getters.loading" color="primary" :variant="review.myVote === 'U' ? 'flat' : 'tonal'">▲ {{ review.upvotes }}</v-btn>
      <v-btn @click="$emit('vote-down-button-click')" :disabled="$store.getters.loading" class="ml-2" color="primary" :variant="review.myVote === 'D' ? 'flat' : 'tonal'">▼ {{ review.downvotes }}</v-btn>
      <v-btn @click="$emit('comments-button-click')" class="ml-2" prepend-icon="mdi-comment" variant="text">{{ review.numComments }}</v-btn>
      <v-btn v-if="review.user !== null && $store.state.user !== null && review.user.id === $store.state.user.id" @click="$emit('delete-button-click')" :disabled="$store.getters.loading" class="ml-2" color="red" prepend-icon="mdi-delete" variant="text">Delete</v-btn>
    </div>
  </div>
  <v-divider/>
</template>

<script>
export default {
  name: 'ReviewItem',
  props: ['review'],
  emits: ['vote-up-button-click', 'vote-down-button-click', 'comments-button-click', 'delete-button-click'],
  computed: {
    gravatarImage() {
      return `${process.env.VUE_APP_GRAVATAR}/avatar/${this.review.user?.gravatarHash ?? '00000000000000000000000000000000'}?d=mp`;
    }
  }
};
</script>
