<template>
  <transition name="message">
    <div v-if="isShow" class="message" :class="{ 'message--error': isError }" @click="hide">
      {{ text }}
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventEmitter from '@/ts/plugins/EventEmitter/index';
import Store from '@/ts/Store/index';

@Component
export default class GlobalMessage extends Vue {
  private isShow = false;
  private isError = false;
  private text = '';
  private timerId?: NodeJS.Timeout;

  created(): void {
    EventEmitter.on('SET_MESSAGE_TEXT', this.changeText);
    EventEmitter.on('SET_IS_MESSAGE_SHOW', this.changeIsShow);
    EventEmitter.on('SET_MESSAGE_TYPE', this.changeType);
  }

  changeText(): void {
    this.text = Store.state.messageText;
  }

  changeIsShow(): void {
    if (Store.state.isMessageShow) {
      this.show();
    } else {
      this.hide();
    }
  }

  changeType(): void {
    this.isError = false;

    if (Store.state.messageType === 'error') {
      this.isError = true;
    }
  }

  show(): void {
    this.isShow = true;

    // 5秒経って消えてなかったら消す
    if (this.timerId !== void 0) clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      if (this.isShow) this.hide();
    }, 5000);
  }

  hide(): void {
    this.isShow = false;
  }
}
</script>
