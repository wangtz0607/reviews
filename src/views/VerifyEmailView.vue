<template>
  <h1 class="my-4">Verify Email Address</h1>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VerifyEmailView',
  methods: {
    async verifyEmail() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/verify_email`, { token: this.$route.params.token });
        this.$root.showSuccess('Successfully verified email address');
        this.$router.push('/');
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    }
  },
  async mounted() {
    await this.verifyEmail();
  }
};
</script>
