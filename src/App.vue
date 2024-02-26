<template>
  <v-app>
    <v-navigation-drawer elevation="0" v-model="drawer">
      <v-list>
        <router-link to="/" custom v-slot="{ navigate }">
          <v-list-item @click="navigate" prepend-icon="mdi-home" title="Home"/>
        </router-link>
        <router-link to="/classes" custom v-slot="{ navigate }">
          <v-list-item @click="navigate" prepend-icon="mdi-compass" title="Discover"/>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="border-b" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer"/>
      <v-spacer/>
      <template v-if="$store.state.user === null">
        <v-btn @click="logInDialog = true" class="mr-2" color="primary" variant="tonal">Log In</v-btn>
        <router-link to="/register" custom v-slot="{ navigate }">
          <v-btn @click="navigate" class="mr-4" color="primary" variant="flat">Sign Up</v-btn>
        </router-link>
      </template>
      <template v-else>
        <v-avatar id="avatar" :image="gravatarImage" class="mr-8" size="small"/>
        <v-menu activator="#avatar">
          <v-list border elevation="0">
            <router-link :to="`/users/${$store.state.user.id}`" custom v-slot="{ navigate }">
              <v-list-item @click="navigate">
                <v-list-item-title><strong>{{ $store.state.user.name ?? $store.state.user.username }}</strong> ({{ $store.state.user.username }})</v-list-item-title>
              </v-list-item>
            </router-link>
            <router-link to="/settings" custom v-slot="{ navigate }">
              <v-list-item @click="navigate">
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-list-item title="Log Out" @click="logOut"/>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    <v-dialog v-model="logInDialog" width="500">
      <v-card elevation="0">
        <v-card-title>Log In</v-card-title>
        <v-divider/>
        <v-card-text>
          <v-text-field v-model="usernameOrEmail" class="my-2" hide-details label="Username / Email" variant="underlined"/>
          <v-text-field v-model="password" class="my-2" hide-details label="Password" type="password" variant="underlined"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="logInDialog = false" color="primary" variant="text">Cancel</v-btn>
          <v-btn @click="logIn().then(ok => ok && (logInDialog = false))" :disabled="[usernameOrEmail, password].includes('') || $store.getters.loading" color="primary" variant="text">Log In</v-btn>
        </v-card-actions>
        <v-divider/>
        <v-card-actions>
          <router-link to="/register" custom v-slot="{ navigate }">
            <v-btn @click="logInDialog = false; navigate()" color="primary" variant="text">Sign Up</v-btn>
          </router-link>
          <router-link to="/reset-password" custom v-slot="{ navigate }">
            <v-btn @click="logInDialog = false; navigate()" color="primary" variant="text">Reset Password</v-btn>
          </router-link>
          <router-link to="/resend-email" custom v-slot="{ navigate }">
            <v-btn @click="logInDialog = false; navigate()" color="primary" variant="text">Resend Verification Email</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog.visible" width="500">
      <v-card elevation="0">
        <v-card-text>{{ confirmDialog.text }}</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="confirmDialog.onNoButtonClick" :disabled="$store.getters.loading" color="primary" variant="text">{{ confirmDialog.noButtonText }}</v-btn>
          <v-btn @click="confirmDialog.onYesButtonClick" :disabled="$store.getters.loading" color="primary" variant="text">{{ confirmDialog.yesButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar :color="snackbar.color" timeout="3000" variant="flat" v-model="snackbar.visible">{{ snackbar.text }}</v-snackbar>
  </v-app>
</template>

<style>
a {
  color: v-bind('primaryColor');
  text-decoration: none;
}
</style>

<script>
import axios from 'axios';
import theme from '@/theme';

axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      drawer: false,
      logInDialog: false,
      confirmDialog: {
        visible: false,
        text: null,
        yesButtonText: null,
        noButtonText: null,
        onYesButtonClick: null,
        onNoButtonClick: null
      },
      snackbar: {
        visible: false,
        color: null,
        text: null
      },
      primaryColor: theme.colors.primary,
    };
  },
  methods: {
    async loadUser() {
      this.$store.commit('startLoading');
      try {
        this.$store.commit('setUser', (await axios.get(`${process.env.VUE_APP_BACKEND}/me`)).data);
      } catch (e) {
        if (e?.response?.status !== 401) {
          this.showError(e?.response?.data?.message ?? e);
          return false;
        }
        this.$store.commit('setUser', null);
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async logIn() {
      this.$store.commit('startLoading');
      try {
        await axios.put(`${process.env.VUE_APP_BACKEND}/auth`, { usernameOrEmail: this.usernameOrEmail, password: this.password });
        if (!await this.loadUser()) return false;
        this.showSuccess(`Welcome ${this.$store.state.user.name ?? this.$store.state.user.username}!`);
      } catch (e) {
        this.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async logOut() {
      this.$store.commit('startLoading');
      try {
        await axios.delete(`${process.env.VUE_APP_BACKEND}/auth`);
        if (!await this.loadUser()) return false;
        this.showSuccess('Bye!');
      } catch (e) {
        this.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    showSuccess(message) {
      this.snackbar = {
        visible: true,
        color: 'success',
        text: message
      };
    },
    showError(message) {
      this.snackbar = {
        visible: true,
        color: 'error',
        text: message
      };
    },
    ensureLoggedIn() {
      if (this.$store.state.user === null) {
        this.logInDialog = true;
        return false;
      }
      return true;
    },
    confirm(message, yesButtonText, noButtonText) {
      this.confirmDialog = {
        visible: true,
        yesButtonText: yesButtonText,
        noButtonText: noButtonText,
        text: message
      };
      return new Promise(resolve => {
        this.confirmDialog.onYesButtonClick = () => {
          resolve(true);
          this.confirmDialog.visible = false;
        };
        this.confirmDialog.onNoButtonClick = () => {
          resolve(false);
          this.confirmDialog.visible = false;
        };
      });
    }
  },
  computed: {
    gravatarImage() {
      return `${process.env.VUE_APP_GRAVATAR}/avatar/${this.$store.state.user.gravatarHash}?d=mp`;
    }
  },
  async mounted() {
    await this.loadUser();
  }
};
</script>
