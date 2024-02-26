<template>
  <h1 class="my-4">Sign Up</h1>
  <v-text-field v-model="username" class="my-2" hide-details label="Username" variant="underlined"/>
  <v-text-field v-model="email" class="my-2" hide-details label="Email" variant="underlined"/>
  <v-text-field v-model="password" class="my-2" hide-details label="Password" type="password" variant="underlined"/>
  <v-text-field v-model="confirmPassword" class="my-2" hide-details label="Confirm Password" type="password" variant="underlined"/>
  <CaptchaInput ref="captchaInput" @input="newCaptchaText => captchaText = newCaptchaText"/>
  <v-btn block @click="register().then(ok => ok || $refs.captchaInput.reloadCaptcha())" :disabled="[username, email, password, captchaText].includes('') || password !== confirmPassword || $store.getters.loading" class="my-2" color="primary" variant="flat">Sign Up</v-btn>
  <v-btn @click="$root.logInDialog = true" class="my-2" color="primary" variant="text">Log In</v-btn>
  <router-link to="/reset-password" custom v-slot="{ navigate }">
    <v-btn @click="navigate" class="my-2" color="primary" variant="text">Reset Password</v-btn>
  </router-link>
  <router-link to="/resend-email" custom v-slot="{ navigate }">
    <v-btn @click="navigate" color="primary" variant="text">Resend Verification Email</v-btn>
  </router-link>
</template>

<script>
import axios from 'axios';
import CaptchaInput from '@/components/CaptchaInput.vue';

export default {
  name: 'RegisterView',
  components: { CaptchaInput },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      captchaText: ''
    };
  },
  methods: {
    async register() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/users`, {
          username: this.username,
          email: this.email,
          password: this.password,
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
