<template>
  <section class="app-main" style="min-height: 100%">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
