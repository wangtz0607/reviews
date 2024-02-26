<template>
  <router-link :to="`/departments/${department.id}`" custom v-slot="{ href, navigate }">
    <a :href="href">
      <v-card @click="navigate" class="my-2 pa-2">
        <h3>{{ department.name }}</h3>
        <div class="d-flex align-center mt-1">
          <span style="font-size: 14px">{{ department.numCourses }} {{ department.numCourses === 1 ? 'course' : 'courses' }}</span>
        </div>
      </v-card>
    </a>
  </router-link>
</template>

<script>
export default {
  name: 'DepartmentItem',
  props: ['department']
};
</script>
