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
  private closeModal(): void {
    return;
  }

  // @Emit('search-query')
  // private searchQuery():

  handleClick(): void {
    Store.setIsModalOpen(false);
    this.$emit('close-modal');
  }
  setSearchQuery(value: SearchQuery): void {
    this.$emit('search-query', value);
  }
  inputMoney(value: number): void {
    this.$emit('input-money', value);
  }
  inputCategory(value: string[]): void {
    this.$emit('input-category', value);
  }
  inputSubCategory(value: string[]): void {
    this.$emit('input-sub-category', value);
  }
  inputPayment(value: string[]): void {
    this.$emit('input-payment', value);
  }
  inputDate(value: string): void {
    this.$emit('input-date', value);
  }
  inputMemo(value: string): void {
    this.$emit('input-memo', value);
  }
  inputUser(value: string[]): void {
    this.$emit('input-user', value);
  }
}
</script>
