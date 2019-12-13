<template>
  <section id="screen-history" :aria-hidden="page === 'history' ? 'false' : 'true'" class="block-content u-pt-0 u-pb-0" role="tabpanel">
    <module-loading :is-show="isLoading"></module-loading>
    <div v-for="(value, name) in historyData" :key="name" class="block-box-bg-alternate">
      <module-history-list :date="name" :item-data="value" @list-click="openEditModal"></module-history-list>
    </div>
    <module-modal
      :top="modalPositionTop"
      :is-open="isModalOpen"
      :modal-type="modalType"
      :edit-data="editData"
      :is-input-form-watch-enable="isInputFormWatchEnable"
      @search-query="setSearchQuery"
      @close-modal="closeModal"
      @input-money="setMoney"
      @input-category="setCategory"
      @input-sub-category="setSubCategory"
      @input-payment="setPayment"
      @input-date="setDate"
      @input-memo="setMemo"
      @input-user="setUser"
    ></module-modal>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Where, OrderBy, DocumentsFilter, HistoryItem, StoreEventType, SearchQuery } from 'type/index';
import moment from 'moment';
import DataManager from '@/ts/plugins/DataManager/index';
import EventEmitter from '@/ts/plugins/EventEmitter/index';
import ModuleHistoryList from '@/ts/components/modules/HistoryList.vue';
import ModuleModal from '@/ts/components/modules/Modal.vue';
import ModuleLoading from '@/ts/components/modules/Loading.vue';
import Store from '@/ts/Store/index';

type EditData = {
  id?: string;
  money?: number;
  category?: string[];
  subCategory?: string[];
  payment?: string[];
  date?: string;
  memo?: string;
  user?: string[];
};

@Component({
  components: {
    ModuleHistoryList,
    ModuleModal,
    ModuleLoading
  }
})
export default class PageHistory extends Vue {
  @Prop({ type: String, default: '' })
  private page!: string;

  private isActivateFirst = true;
  private historyData: { [key: string]: firebase.firestore.DocumentData[] } = {};
  private isModalOpen = false;
  private modalType = '';
  private modalPositionTop = 0;
  private editData: EditData = {};
  private isInputFormWatchEnable = false;
  private isLoading = false;
  private searchQuery: { where: Where[]; orderBy: OrderBy[] } = {
    where: [
      {
        key: 'date',
        operator: '>=',
        value: moment()
          .subtract(7, 'days')
          .format('YYYY-MM-DD')
      },
      { key: 'date', operator: '<=', value: moment().format('YYYY-MM-DD') },
      { key: 'user', operator: '==', value: Store.state.loginUserName }
    ],
    orderBy: [
      { key: 'date', sort: 'desc' },
      { key: 'pubDate', sort: 'desc' }
    ]
  };
  private filter: DocumentsFilter = {
    user: Store.state.loginUserName
  };

  created(): void {
    EventEmitter.on('SET_PAGE', () => {
      if (!(this.isActivateFirst && Store.state.page === 'history')) return;
      this.isActivateFirst = false;
      this.getDocuments();
    });
    EventEmitter.on('REFRESH_HISTORY', this.getDocuments);
    EventEmitter.on('SET_IS_MODAL_OPEN', this.changeIsModalOpen);
  }

  getDocuments(): void {
    this.historyData = {};
    this.isLoading = true;

    DataManager.reader
      .getDocuments(this.searchQuery)
      .then(documents => {
        this.historyData = {};

        if (this.filter.minMoney) {
          documents = documents.filter(document => document.money >= (this.filter.minMoney as number));
        }

        if (this.filter.maxMoney) {
          documents = documents.filter(document => document.money <= (this.filter.maxMoney as number));
        }

        if (this.filter.category) {
          documents = documents.filter(document => (this.filter.category as string[]).includes(document.category));
        }

        if (this.filter.subCategory) {
          documents = documents.filter(document => (this.filter.subCategory as string[]).includes(document.subCategory));
        }

        if (this.filter.payment) {
          documents = documents.filter(document => (this.filter.payment as string[]).includes(document.payment));
        }

        if (this.filter.memo) {
          documents = documents.filter(document => document.memo.indexOf(this.filter.memo) !== -1);
        }

        documents.forEach(document => {
          if (!this.historyData[document.date]) this.historyData[document.date] = [];
          this.historyData[document.date].push(document);
        });

        this.isLoading = false;
      })
      .catch(error => {
        Store.setMessageText('エラー: 履歴の取得に失敗しました。');
        Store.setMessageType('error');
        Store.setIsMessageShow(true);
        this.isLoading = false;
        console.error(error);
      });
  }

  openEditModal(data: HistoryItem): void {
    Store.setIsModalOpen(true);
    this.modalType = 'edit';
    this.isModalOpen = true;
    this.modalPositionTop = this.$el.scrollTop;
    this.editData = {
      id: data.id,
      money: data.money,
      category: [data.category],
      subCategory: [data.subCategory],
      payment: [data.payment],
      date: data.date,
      memo: data.memo,
      user: [data.user]
    };
    setTimeout(() => {
      this.isInputFormWatchEnable = true;
    }, 200);
  }

  changeIsModalOpen(e: StoreEventType): void {
    this.isModalOpen = Store.state[e.state as 'isModalOpen'];

    if (this.isModalOpen) {
      this.modalType = 'search';
      (this.$el as HTMLElement).style.overflow = 'hidden';
      this.modalPositionTop = this.$el.scrollTop;
    } else {
      (this.$el as HTMLElement).style.overflow = '';
      this.isInputFormWatchEnable = false;
    }
  }

  setSearchQuery(value: SearchQuery): void {
    this.searchQuery = value.query;
    this.filter = value.filter;
    this.getDocuments();
  }

  closeModal(): void {
    this.isInputFormWatchEnable = false;
  }

  setMoney(value: number): void {
    this.editData.money = value;
  }

  setCategory(value: string[]): void {
    this.editData.category = value;
  }

  setSubCategory(value: string[]): void {
    this.editData.subCategory = value;
  }

  setPayment(value: string[]): void {
    this.editData.payment = value;
  }

  setDate(value: string): void {
    this.editData.date = value;
  }

  setMemo(value: string): void {
    this.editData.memo = value;
  }

  setUser(value: string[]): void {
    this.editData.user = value;
  }
}
</script>
