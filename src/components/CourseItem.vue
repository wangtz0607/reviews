<template>
  <router-link :to="`/courses/${course.id}`" custom v-slot="{ href, navigate }">
    <a :href="href">
      <v-card @click="navigate" class="my-2 pa-2">
        <div class="d-flex align-center">
          <h3>{{ course.name }}</h3>
          <v-badge color="primary" :content="course.audience" inline/>
          <v-badge color="primary" :content="course.type" inline/>
        </div>
        <div class="d-flex align-center mt-1">
          <v-chip prepend-icon="mdi-pound" size="small">{{ course.officialId }}</v-chip>
          <span class="ml-2" style="font-size: 14px">{{ course.numClasses }} {{ course.numClasses === 1 ? 'class' : 'classes' }}</span>
        </div>
      </v-card>
    </a>
  </router-link>
</template>

<script>
export default {
  name: 'CourseItem',
  props: ['course']
};
</script>
