<template>
  <h1 class="my-4">Discover</h1>
  <TabsRow :selected="1"/>
  <SearchBox label="Name / ID" @search="newKeyword => { keyword = newKeyword; reloadSearchResults() }"/>
  <CourseItem v-for="course in searchResults" :key="course.id" :course="course"/>
  <v-btn @click="loadSearchResults" variant="text" block :disabled="noMoreSearchResults || $store.getters.loading">{{ noMoreSearchResults ? 'Nothing more' : 'Load More' }}</v-btn>
</template>

<script>
import axios from 'axios';
import TabsRow from '@/components/TabsRow';
import SearchBox from '@/components/SearchBox';
import CourseItem from '@/components/CourseItem';

export default {
  name: 'CoursesView',
  components: { TabsRow, SearchBox, CourseItem },
  data() {
    return {
      keyword: '',
      searchResults: [],
      noMoreSearchResults: false
    };
  },
  methods: {
    async loadSearchResults() {
      this.$store.commit('startLoading');
      try {
        let newSearchResults;
        if (!this.keyword) {
          newSearchResults = (await axios.get(`${process.env.VUE_APP_BACKEND}/courses`, { params: { limit: 20, offset: this.searchResults.length } })).data;
        } else {
          newSearchResults = (await axios.get(`${process.env.VUE_APP_BACKEND}/courses/search`, { params: { keyword: this.keyword, limit: 20, offset: this.searchResults.length } })).data;
        }
        this.searchResults.push(...newSearchResults);
        if (newSearchResults.length < 20) {
          this.noMoreSearchResults = true;
        }
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async reloadSearchResults() {
      this.searchResults = [];
      this.noMoreSearchResults = false;
      return await this.loadSearchResults();
    }
  }
};
</script>
