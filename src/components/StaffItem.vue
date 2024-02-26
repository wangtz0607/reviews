<template>
  <router-link :to="`/staffs/${staff.id}`" custom v-slot="{ href, navigate }">
    <a :href="href">
      <v-card @click="navigate" class="my-2 pa-2">
        <h3>{{ staff.name }}</h3>
        <div class="d-flex align-center mt-1">
          <v-chip prepend-icon="mdi-pound" size="small">{{ staff.officialId }}</v-chip>
          <span class="ml-2" style="font-size: 14px">{{ staff.numClasses }} {{ staff.numClasses === 1 ? 'class' : 'classes' }}</span>
        </div>
      </v-card>
    </a>
  </router-link>
</template>

<script>
export default {
  name: 'StaffItem',
  props: ['staff']
};
</script>
