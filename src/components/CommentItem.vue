<template>
  <div class="d-flex align-start">
    <router-link :to="`/users/${this.comment.user.id}`" custom v-slot="{ href, navigate }">
      <a :href="href">
        <v-avatar @click="navigate" :image="gravatarImage"/>
      </a>
    </router-link>
    <div class="ml-4">
      <p>
        <router-link :to="`/users/${this.comment.user.id}`" custom v-slot="{ href, navigate }">
          <a :href="href">
            <strong @click="navigate">{{ comment.user.name ?? comment.user.username }}</strong>
          </a>
        </router-link>
      </p>
      <p v-for="paragraph in comment.comment.split('\n')" :key="paragraph" class="my-2">{{ paragraph }}</p>
      <div class="my-2">
        <span style="font-size: 14px; opacity: 0.6">{{ new Date(comment.time).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) }}</span>
        <v-btn @click="$emit('vote-up-button-click')" :disabled="$store.getters.loading" :color="comment.myVote === 'U' ? 'primary' : null" density="comfortable" :variant="comment.myVote === 'U' ? 'flat' : 'text'">▲ {{ comment.upvotes }}</v-btn>
        <v-btn @click="$emit('vote-down-button-click')" :disabled="$store.getters.loading" :color="comment.myVote === 'D' ? 'primary' : null" density="comfortable" :variant="comment.myVote === 'D' ? 'flat' : 'text'">▼ {{ comment.downvotes }}</v-btn>
        <v-btn v-if="$store.state.user !== null && comment.user.id === $store.state.user.id" @click="$emit('delete-button-click')" :disabled="$store.getters.loading" color="red" density="comfortable" prepend-icon="mdi-delete" variant="text">Delete</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['comment'],
  emits: ['vote-up-button-click', 'vote-down-button-click', 'delete-button-click'],
  computed: {
    gravatarImage() {
      return `${process.env.VUE_APP_GRAVATAR}/avatar/${this.comment.user.gravatarHash}?d=mp`;
    }
  }
};
</script>
