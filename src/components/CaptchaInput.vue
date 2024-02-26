<template>
  <v-img @click="reloadCaptcha" :src="captchaImage" width="300" height="100"/>
  <v-text-field v-model="captchaText" @input="$emit('input', captchaText)" class="my-2" hide-details label="CAPTCHA Text" variant="underlined"/>
</template>

<script>
export default {
  name: 'CaptchaInput',
  emits: ['input'],
  data() {
    return {
      captchaText: '',
      cacheKey: Date.now()
    };
  },
  computed: {
    captchaImage() {
      return `${process.env.VUE_APP_BACKEND}/captcha?nocache=${this.cacheKey}`;
    }
  },
  methods: {
    reloadCaptcha() {
      this.cacheKey = Date.now();
    }
  }
};
</script>
