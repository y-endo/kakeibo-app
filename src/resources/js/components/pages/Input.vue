<template>
  <section id="page-input" :aria-hidden="page === 'input' ? 'false' : 'true'" class="block-content" role="tabpanel">
    <module-input-form
      :money="money"
      :category="category"
      :sub-category="subCategory"
      :payment="payment"
      :date="date"
      :memo="memo"
      :user="user"
      @input-money="setMoney"
      @input-category="setCategory"
      @input-sub-category="setSubCategory"
      @input-payment="setPayment"
      @input-date="setDate"
      @input-memo="setMemo"
      @input-user="setUser"
    ></module-input-form>
  </section>
</template>

<script>
import moment from 'moment';
import ModuleInputForm from '@/js/components/modules/InputForm.vue';
import Store from '@/js/Store/index.js';

export default {
  name: 'PageInput',
  components: {
    ModuleInputForm
  },
  props: {
    page: {
      type: String,
      default: () => ''
    }
  },
  data: function() {
    return {
      money: null,
      category: [],
      subCategory: [],
      payment: [],
      date: moment().format('YYYY-MM-DD'),
      memo: '',
      user: [Store.state.loginUserName]
    };
  },
  methods: {
    setMoney(value) {
      this.money = value;
    },
    setCategory(value) {
      this.category = value;
    },
    setSubCategory(value) {
      this.subCategory = value;
    },
    setPayment(value) {
      this.payment = value;
    },
    setDate(value) {
      this.date = value;
    },
    setMemo(value) {
      this.memo = value;
    },
    setUser(value) {
      this.user = value;
    }
  }
};
</script>
