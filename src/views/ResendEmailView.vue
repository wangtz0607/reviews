<template>
  <h1 class="my-4">Resend Verification Email</h1>
  <v-text-field v-model="username" class="my-2" hide-details label="Username" variant="underlined"/>
  <v-text-field v-model="email" class="my-2" hide-details label="Email" variant="underlined"/>
  <CaptchaInput ref="captchaInput" @input="newCaptchaText => captchaText = newCaptchaText"/>
  <v-btn block @click="resendEmail().then(ok => ok || $refs.captchaInput.reloadCaptcha())" :disabled="[username, email, captchaText].includes('') || $store.getters.loading" class="my-2" color="primary" variant="flat">Resend Verification Email</v-btn>
  <v-btn @click="$root.logInDialog = true" class="my-2" color="primary" variant="text">Log In</v-btn>
  <router-link to="/register" custom v-slot="{ navigate }">
    <v-btn @click="logInDialog = false; navigate()" color="primary" variant="text">Sign Up</v-btn>
  </router-link>
  <router-link to="/reset-password" custom v-slot="{ navigate }">
    <v-btn @click="navigate" class="my-2" color="primary" variant="text">Reset Password</v-btn>
  </router-link>
</template>

<script>
import axios from 'axios';
import CaptchaInput from '@/components/CaptchaInput.vue';

export default {
  name: 'ResendEmailView',
  components: { CaptchaInput },
  data() {
    return {
      username: '',
      email: '',
      captchaText: ''
    };
  },
  methods: {
    async resendEmail() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/resend_email`, {
          username: this.username,
          email: this.email,
          captchaText: this.captchaText
        });
        this.$root.showSuccess(`Verification link has been sent to ${this.email}`);
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
