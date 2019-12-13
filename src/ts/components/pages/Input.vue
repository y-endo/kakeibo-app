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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';
import ModuleInputForm from '@/ts/components/modules/InputForm.vue';
import Store from '@/ts/Store/index';

@Component({
  components: {
    ModuleInputForm
  }
})
export default class PageInput extends Vue {
  /**
   * data
   */
  private money: number | null = null;
  private category: string[] = [];
  private subCategory: string[] = [];
  private payment: string[] = [];
  private date: string = moment().format('YYYY-MM-DD');
  private memo = '';
  private user: string[] = [Store.state.loginUserName];

  /**
   * props
   */
  @Prop({ type: String, default: '' })
  private page!: string;

  /**
   * methods
   */
  setMoney(value: number): void {
    this.money = value;
  }

  setCategory(value: string[]): void {
    this.category = value;
  }

  setSubCategory(value: string[]): void {
    this.subCategory = value;
  }

  setPayment(value: string[]): void {
    this.payment = value;
  }

  setDate(value: string): void {
    this.date = value;
  }

  setMemo(value: string): void {
    this.memo = value;
  }

  setUser(value: string[]): void {
    this.user = value;
  }
}
</script>
