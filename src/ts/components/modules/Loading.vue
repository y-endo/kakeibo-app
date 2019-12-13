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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ModuleLoading extends Vue {
  /**
   * props
   */
  @Prop({ type: Boolean, default: true })
  private isShow!: boolean;
}
</script>
