<template>
  <h1 class="my-4">Discover</h1>
  <TabsRow :selected="2"/>
  <SearchBox label="Name / ID" @search="newKeyword => { keyword = newKeyword; reloadSearchResults() }"/>
  <StaffItem v-for="staff in searchResults" :key="staff.id" :staff="staff"/>
  <v-btn @click="loadSearchResults" variant="text" block :disabled="noMoreSearchResults || $store.getters.loading">{{ noMoreSearchResults ? 'Nothing more' : 'Load More' }}</v-btn>
</template>

<script>
import axios from 'axios';
import TabsRow from '@/components/TabsRow';
import SearchBox from '@/components/SearchBox';
import StaffItem from '@/components/StaffItem';

export default {
  name: 'StaffsView',
  components: { TabsRow, SearchBox, StaffItem },
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
          newSearchResults = (await axios.get(`${process.env.VUE_APP_BACKEND}/staffs`, { params: { limit: 20, offset: this.searchResults.length } })).data;
        } else {
          newSearchResults = (await axios.get(`${process.env.VUE_APP_BACKEND}/staffs/search`, { params: { keyword: this.keyword, limit: 20, offset: this.searchResults.length } })).data;
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
