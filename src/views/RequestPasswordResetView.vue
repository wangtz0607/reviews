<template>
  <h1 class="my-4">Reset Password</h1>
  <v-text-field v-model="email" class="my-2" hide-details label="Email" variant="underlined"/>
  <CaptchaInput ref="captchaInput" @input="newCaptchaText => captchaText = newCaptchaText"/>
  <v-btn block @click="requestPasswordReset().then(ok => ok || $refs.captchaInput.reloadCaptcha())" :disabled="[email, captchaText].includes('') || $store.getters.loading" class="my-2" color="primary" variant="flat">Continue</v-btn>
  <v-btn @click="$root.logInDialog = true" class="my-2" color="primary" variant="text">Log In</v-btn>
  <router-link to="/register" custom v-slot="{ navigate }">
    <v-btn @click="logInDialog = false; navigate()" color="primary" variant="text">Sign Up</v-btn>
  </router-link>
  <router-link to="/resend-email" custom v-slot="{ navigate }">
    <v-btn @click="logInDialog = false; navigate()" color="primary" variant="text">Resend Verification Email</v-btn>
  </router-link>
</template>

<script>
import axios from 'axios';
import CaptchaInput from '@/components/CaptchaInput.vue';

export default {
  name: 'RequestPasswordResetView',
  components: { CaptchaInput },
  data() {
    return {
      email: '',
      captchaText: ''
    };
  },
  methods: {
    async requestPasswordReset() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/request_password_reset`, {
          email: this.email,
          captchaText: this.captchaText
        });
        this.$root.showSuccess(`Password reset link has been sent to ${this.email}`);
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
