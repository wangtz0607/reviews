<template>
  <template v-if="user !== null">
    <h1 class="my-4">Settings</h1>
    <h2 class="my-4">Public Profile</h2>
    <v-text-field v-model="user.name" class="my-2" hide-details label="Name (optional)" variant="underlined"/>
    <v-text-field v-model="user.gravatarEmail" class="my-2" hide-details label="Gravatar Email (optional)" variant="underlined"/>
    <p class="my-2">
      <small>
        <a href="https://en.gravatar.com" target="_blank">Go to Gravatar<v-icon icon="mdi-open-in-new" size="x-small"/></a>
        <a class="ml-4" href="https://en.gravatar.com/support/what-is-gravatar/" target="_blank">What is Gravatar?<v-icon icon="mdi-open-in-new" size="x-small"/></a>
      </small>
    </p>
    <v-btn @click="changePublicProfile" :disabled="$store.getters.loading" block class="my-2" color="primary" variant="flat">Apply Changes</v-btn>
    <h2 class="my-4">Email</h2>
    <v-text-field v-model="user.email" class="my-2" hide-details label="Email" variant="underlined"/>
    <v-btn @click="changeEmail" :disabled="user.email === '' || $store.getters.loading" block class="my-2" color="primary" variant="flat">Apply Changes</v-btn>
    <h2 class="my-4">Password</h2>
    <v-text-field v-model="oldPassword" class="my-2" hide-details label="Old Password" type="password" variant="underlined"/>
    <v-text-field v-model="password" class="my-2" hide-details label="New Password" type="password" variant="underlined"/>
    <v-text-field v-model="confirmPassword" class="my-2" hide-details label="Confirm New Password" type="password" variant="underlined"/>
    <v-btn @click="changePassword" :disabled="[oldPassword, password].includes('') || password !== confirmPassword || $store.getters.loading" block class="my-2" color="primary" variant="flat">Apply Changes</v-btn>
  </template>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

export default {
  name: 'SettingsView',
  data() {
    return {
      user: null,
      oldPassword: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async loadUser() {
      if (!await this.$root.loadUser()) return false;
      this.user = _.cloneDeep(this.$store.state.user);
      return true;
    },
    async changePublicProfile() {
      this.$store.commit('startLoading');
      try {
        let body = {
          name: this.user.name,
          gravatarEmail: this.user.gravatarEmail
        };
        if (body.name === '') {
          body.name = null;
        }
        if (body.gravatarEmail === '') {
          body.gravatarEmail = null;
        }
        await axios.patch(`${process.env.VUE_APP_BACKEND}/me`, body);
        if (!await this.loadUser()) return false;
        this.$root.showSuccess('Successfully applied changes');
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async changeEmail() {
      this.$store.commit('startLoading');
      try {
        let { email } = this.user;
        await axios.patch(`${process.env.VUE_APP_BACKEND}/me`, { email });
        this.$root.showSuccess(`Verification link has been sent to ${this.user.email}`);
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async changePassword() {
      this.$store.commit('startLoading');
      try {
        await axios.patch(`${process.env.VUE_APP_BACKEND}/me`, { oldPassword: this.oldPassword, password: this.password });
        if (!await this.loadUser()) return false;
        this.$root.showSuccess('Successfully applied changes');
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
    await this.loadUser();
  }
};
</script>
