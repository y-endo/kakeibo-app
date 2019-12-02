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

<script>
import moment from 'moment';
import DataManager from '@/js/plugins/DataManager/index.js';
import EventEmitter from '@/js/plugins/EventEmitter/index.js';
import ModuleHistoryList from '@/js/components/modules/HistoryList.vue';
import ModuleModal from '@/js/components/modules/Modal.vue';
import ModuleLoading from '@/js/components/modules/Loading.vue';
import Store from '@/js/Store/index.js';

export default {
  name: 'PageHistory',
  components: {
    ModuleHistoryList,
    ModuleModal,
    ModuleLoading
  },
  props: {
    page: {
      type: String,
      default: () => ''
    }
  },
  data: function() {
    return {
      isActivateFirst: true,
      historyData: {},
      isModalOpen: false,
      modalType: '',
      modalPositionTop: 0,
      editData: {},
      isInputFormWatchEnable: false,
      isLoading: false,
      searchQuery: {
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
        orderBy: [{ key: 'date', sort: 'desc' }, { key: 'pubDate', sort: 'desc' }]
      },
      filter: {
        user: Store.state.loginUserName
      }
    };
  },
  created() {
    EventEmitter.on('SET_PAGE', () => {
      if (!(this.isActivateFirst && Store.state.page === 'history')) return;
      this.isActivateFirst = false;
      this.getDocuments();
    });
    EventEmitter.on('REFRESH_HISTORY', this.getDocuments);
    EventEmitter.on('SET_IS_MODAL_OPEN', this.changeIsModalOpen);
  },
  methods: {
    getDocuments() {
      this.historyData = {};
      this.isLoading = true;

      DataManager.reader
        .getDocuments(this.searchQuery)
        .then(documents => {
          this.historyData = {};

          if (this.filter.minMoney) {
            documents = documents.filter(document => document.money >= this.filter.minMoney);
          }

          if (this.filter.maxMoney) {
            documents = documents.filter(document => document.money <= this.filter.maxMoney);
          }

          if (this.filter.category) {
            documents = documents.filter(document => this.filter.category.includes(document.category));
          }

          if (this.filter.subCategory) {
            documents = documents.filter(document => this.filter.subCategory.includes(document.subCategory));
          }

          if (this.filter.payment) {
            documents = documents.filter(document => this.filter.payment.includes(document.payment));
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
    },
    openEditModal(e) {
      Store.setIsModalOpen(true);
      this.modalType = 'edit';
      this.isModalOpen = true;
      this.modalPositionTop = this.$el.scrollTop;
      this.editData = {
        id: e.data.id,
        money: e.data.money,
        category: [e.data.category],
        subCategory: [e.data.subCategory],
        payment: [e.data.payment],
        date: e.data.date,
        memo: e.data.memo,
        user: [e.data.user]
      };
      setTimeout(() => {
        this.isInputFormWatchEnable = true;
      }, 200);
    },
    changeIsModalOpen(e) {
      this.isModalOpen = Store.state[e.state];

      if (this.isModalOpen) {
        this.modalType = 'search';
        this.$el.style.overflow = 'hidden';
        this.modalPositionTop = this.$el.scrollTop;
      } else {
        this.$el.style.overflow = '';
        this.isInputFormWatchEnable = false;
      }
    },
    setSearchQuery(value) {
      this.searchQuery = value.query;
      this.filter = value.filter;
      this.getDocuments();
    },
    closeModal() {
      this.isInputFormWatchEnable = false;
    },
    setMoney(value) {
      this.editData.money = value;
    },
    setCategory(value) {
      this.editData.category = value;
    },
    setSubCategory(value) {
      this.editData.subCategory = value;
    },
    setPayment(value) {
      this.editData.payment = value;
    },
    setDate(value) {
      this.editData.date = value;
    },
    setMemo(value) {
      this.editData.memo = value;
    },
    setUser(value) {
      this.editData.user = value;
    }
  }
};
</script>
