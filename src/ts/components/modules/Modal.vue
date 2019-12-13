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

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import { SearchQuery } from 'type/index';
import ModuleSearchForm from '@/ts/components/modules/SearchForm.vue';
import ModuleInputForm from '@/ts/components/modules/InputForm.vue';
import Store from '@/ts/Store/index';

type EditDataType = {
  id: string | null;
  money: number | null;
  category: string[] | [];
  subCategory: string[] | [];
  payment: string[] | [];
  date: string;
  memo: string;
  user: string[] | [];
};

@Component({
  components: {
    ModuleSearchForm,
    ModuleInputForm
  }
})
export default class ModuleModal extends Vue {
  @Prop({ type: Boolean, default: true })
  private isInputFormWatchEnable!: boolean;

  @Prop({ type: Boolean, default: false })
  private isOpen!: boolean;

  @Prop({ type: String, default: '' })
  private modalType!: string;

  @Prop({ type: Number, default: 0 })
  private top!: number;

  @Prop({
    type: Object,
    default: {
      id: null,
      money: null,
      category: [],
      subCategory: [],
      payment: [],
      date: '',
      memo: '',
      user: []
    }
  })
  private editData!: EditDataType;

  @Emit('close-modal')
  private emitCloseModal(): void {
    return;
  }

  @Emit('search-query')
  private emitSearchQuery(value: SearchQuery): SearchQuery {
    return value;
  }

  @Emit('input-money')
  private emitInputMoney(value: number): number {
    return value;
  }

  @Emit('input-category')
  private emitInputCategory(value: string[]): string[] {
    return value;
  }

  @Emit('input-sub-category')
  private emitInputSubCategory(value: string[]): string[] {
    return value;
  }

  @Emit('input-payment')
  private emitInputPayment(value: string[]): string[] {
    return value;
  }

  @Emit('input-date')
  private emitInputDate(value: string): string {
    return value;
  }

  @Emit('input-memo')
  private emitInputMemo(value: string): string {
    return value;
  }

  @Emit('input-user')
  private emitInputUser(value: string[]): string[] {
    return value;
  }

  handleClick(): void {
    Store.setIsModalOpen(false);
    this.emitCloseModal();
  }
  setSearchQuery(value: SearchQuery): void {
    this.emitSearchQuery(value);
  }
  inputMoney(value: number): void {
    this.emitInputMoney(value);
  }
  inputCategory(value: string[]): void {
    this.emitInputCategory(value);
  }
  inputSubCategory(value: string[]): void {
    this.emitInputSubCategory(value);
  }
  inputPayment(value: string[]): void {
    this.emitInputPayment(value);
  }
  inputDate(value: string): void {
    this.emitInputDate(value);
  }
  inputMemo(value: string): void {
    this.emitInputMemo(value);
  }
  inputUser(value: string[]): void {
    this.emitInputUser(value);
  }
}
</script>
