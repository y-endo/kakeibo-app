<template>
  <transition name="message">
    <div v-if="isShow" class="message" :class="{ 'message--error': isError }" @click="hide">
      {{ text }}
    </div>
  </transition>
</template>

<script>
import EventEmitter from '@/js/plugins/EventEmitter/index.js';
import Store from '@/js/Store/index.js';

export default {
  name: 'GlobalMessage',
  data: function() {
    return {
      isShow: false,
      isError: false,
      text: '',
      timerId: -1
    };
  },
  created() {
    EventEmitter.on('SET_MESSAGE_TEXT', this.changeText);
    EventEmitter.on('SET_IS_MESSAGE_SHOW', this.changeIsShow);
    EventEmitter.on('SET_MESSAGE_TYPE', this.changeType);
  },
  methods: {
    changeText() {
      this.text = Store.state.messageText;
    },
    changeIsShow() {
      if (Store.state.isMessageShow) {
        this.show();
      } else {
        this.hide();
      }
    },
    changeType() {
      this.isError = false;

      if (Store.state.messageType === 'error') {
        this.isError = true;
      }
    },
    show() {
      this.isShow = true;

      // 5秒経って消えてなかったら消す
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        if (this.isShow) this.hide();
      }, 5000);
    },
    hide() {
      this.isShow = false;
    }
  }
};
</script>
