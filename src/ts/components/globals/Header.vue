<template>
  <header id="header" class="header">
    <div class="header-inner">
      <h1 v-if="page === 'home'" class="title-page">ホーム</h1>
      <h1 v-else-if="page === 'input'" class="title-page">入力</h1>
      <h1 v-else-if="page === 'history'" class="title-page">履歴</h1>
      <h1 v-else-if="page === 'analysis'" class="title-page">分析</h1>
      <button v-show="page === 'history' && isModalOpen === false" class="button-refresh" @click="handleClickRefresh">更新</button>
      <button v-show="page === 'history' && isModalOpen === false" class="button-search" @click="handleClickSearch">検索</button>
      <button v-show="page === 'history' && isModalOpen === true" class="button-close" @click="handleClickSearch">閉じる</button>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventEmitter from '@/ts/plugins/EventEmitter/index';
import Store from '@/ts/Store/index';

@Component
export default class GlobalHeader extends Vue {
  private isModalOpen = false;

  @Prop({ type: String, default: '' })
  private page!: string;

  created(): void {
    EventEmitter.on('SET_IS_MODAL_OPEN', this.changeIsModalOpen);
  }

  handleClickSearch(e: UIEvent): void {
    const currentTarget = e.currentTarget;
    if (currentTarget === null) return;

    Store.setIsModalOpen((currentTarget as HTMLElement).classList.contains('button-close') ? false : true);
  }

  handleClickRefresh(): void {
    EventEmitter.emit('REFRESH_HISTORY');
  }

  changeIsModalOpen(): void {
    this.isModalOpen = Store.state.isModalOpen;
  }
}

// export default {
//   name: 'GlobalHeader',
//   props: {
//     page: {
//       type: String,
//       default: () => ''
//     }
//   },
//   data: function() {
//     return {
//       isModalOpen: false
//     };
//   },
//   created() {
//     EventEmitter.on('SET_IS_MODAL_OPEN', this.changeIsModalOpen);
//   },
//   methods: {
//     handleClickSearch(e) {
//       Store.setIsModalOpen(e.currentTarget.classList.contains('button-close') ? false : true);
//     },
//     handleClickRefresh() {
//       EventEmitter.emit('REFRESH_HISTORY');
//     },
//     changeIsModalOpen() {
//       this.isModalOpen = Store.state.isModalOpen;
//     }
//   }
// };
</script>
