<template>
  <div v-show="isOpen" :style="{ top: top + 'px' }" class="modal">
    <div class="modal-bg" @click="handleClick"></div>
    <div class="modal-container">
      <div class="modal_inner">
        <module-search-form v-if="modalType === 'search'" @search-query="setSearchQuery"></module-search-form>
        <module-input-form
          v-else-if="modalType === 'edit'"
          :id="editData.id"
          :is-edit="true"
          :is-watch-enable="isInputFormWatchEnable"
          :has-delete="true"
          :money="editData.money"
          :category="editData.category"
          :sub-category="editData.subCategory"
          :payment="editData.payment"
          :date="editData.date"
          :memo="editData.memo"
          :user="editData.user"
          @input-money="inputMoney"
          @input-category="inputCategory"
          @input-sub-category="inputSubCategory"
          @input-payment="inputPayment"
          @input-date="inputDate"
          @input-memo="inputMemo"
          @input-user="inputUser"
        ></module-input-form>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleSearchForm from '@/js/components/modules/SearchForm.vue';
import ModuleInputForm from '@/js/components/modules/InputForm.vue';
import Store from '@/js/Store/index.js';

export default {
  name: 'ModuleModal',
  components: {
    ModuleSearchForm,
    ModuleInputForm
  },
  props: {
    isInputFormWatchEnable: {
      type: Boolean,
      default: () => true
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    modalType: {
      type: String,
      default: () => ''
    },
    top: {
      type: Number,
      default: () => 0
    },
    editData: {
      type: Object,
      default: () => {
        return {
          id: null,
          money: null,
          category: [],
          subCategory: [],
          payment: [],
          date: '',
          memo: '',
          user: ''
        };
      }
    }
  },
  methods: {
    handleClick() {
      Store.setIsModalOpen(false);
      this.$emit('close-modal');
    },
    setSearchQuery(value) {
      this.$emit('search-query', value);
    },
    inputMoney(value) {
      this.$emit('input-money', value);
    },
    inputCategory(value) {
      this.$emit('input-category', value);
    },
    inputSubCategory(value) {
      this.$emit('input-sub-category', value);
    },
    inputPayment(value) {
      this.$emit('input-payment', value);
    },
    inputDate(value) {
      this.$emit('input-date', value);
    },
    inputMemo(value) {
      this.$emit('input-memo', value);
    },
    inputUser(value) {
      this.$emit('input-user', value);
    }
  }
};
</script>
