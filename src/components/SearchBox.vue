<template>
  <v-text-field class="my-2" hide-details :label="label" variant="underlined" v-model="keyword"/>
  <v-btn @click="$emit('search', keyword)" :disabled="$store.getters.loading" class="my-2" color="primary" prepend-icon="mdi-magnify" variant="flat" block>Search</v-btn>
</template>

<script>
export default {
  name: 'SearchBox',
  props: ['label'],
  emits: ['search'],
  data() {
    return {
      keyword: ''
    };
  },
  mounted() {
    this.$emit('search', this.keyword);
  }
};
</script>
