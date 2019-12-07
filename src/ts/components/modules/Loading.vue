<template>
  <transition name="loading">
    <div v-if="isShow" class="loading">
      <div class="loading_icon">
        <div class="loading_cut">
          <div class="loading_donut"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModuleLoading',
  props: {
    isShow: {
      type: Boolean,
      default: () => true
    }
  }
};
</script>
