<template>
  <header id="header" class="header">
    <div class="header-inner">
      <h1 v-if="page === 'home'" class="title-page">ホーム</h1>
      <h1 v-else-if="page === 'input'" class="title-page">入力</h1>
      <h1 v-else-if="page === 'history'" class="title-page">履歴</h1>
      <h1 v-else-if="page === 'analysis'" class="title-page">分析</h1>
      <button v-show="page === 'history' && isModalOpen === false" class="button-refresh" @click="handleClickRefresh">
        更新
      </button>
      <button v-show="page === 'history' && isModalOpen === false" class="button-search" @click="handleClickSearch">
        検索
      </button>
      <button v-show="page === 'history' && isModalOpen === true" class="button-close" @click="handleClickSearch">
        閉じる
      </button>
    </div>
  </header>
</template>

<script>
import EventEmitter from '@/js/plugins/EventEmitter/index.js';
import Store from '@/js/Store/index.js';

export default {
  name: 'GlobalHeader',
  props: {
    page: {
      type: String,
      default: () => ''
    }
  },
  data: function() {
    return {
      isModalOpen: false
    };
  },
  created() {
    EventEmitter.on('SET_IS_MODAL_OPEN', this.changeIsModalOpen);
  },
  methods: {
    handleClickSearch(e) {
      Store.setIsModalOpen(e.currentTarget.classList.contains('button-close') ? false : true);
    },
    handleClickRefresh() {
      EventEmitter.emit('REFRESH_HISTORY');
    },
    changeIsModalOpen() {
      this.isModalOpen = Store.state.isModalOpen;
    }
  }
};
</script>
