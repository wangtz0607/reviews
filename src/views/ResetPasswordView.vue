<template>
  <h1 class="my-4">Reset Password</h1>
  <v-text-field v-model="password" class="my-2" hide-details label="New Password" type="password" variant="underlined"/>
  <v-text-field v-model="confirmPassword" class="my-2" hide-details label="Confirm New Password" type="password" variant="underlined"/>
  <v-btn block @click="resetPassword" :disabled="password === '' || password !== confirmPassword || $store.getters.loading" class="my-2" color="primary" variant="flat">Reset Password</v-btn>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ResetPasswordRoute',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async resetPassword() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/reset_password`, {
          token: this.$route.params.token,
          password: this.password
        });
        this.$root.showSuccess('Successfully reset password');
        this.$router.push('/');
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    }
  }
};
</script>
