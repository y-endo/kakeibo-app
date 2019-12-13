<template>
  <div :class="{ 'select--active': isFocus }" :disabled="disable" class="select" @click="handleClickSelect">
    <input v-model="internalValue" :multiple="multiple" :required="required" type="select" class="select_hidden" />
    <div class="select_icon"></div>
    <ul v-show="internalValue.length !== 0" class="select_value-list">
      <li
        v-for="(value, index) in internalValue"
        :key="index"
        :class="{ 'select_value-list-item--single': !multiple }"
        class="select_value-list-item"
      >
        <div class="select_value-text">
          {{ value }}
        </div>
        <span v-show="multiple" class="select_delete" :data-select-value="value" @click.stop="handleClickDelete">×</span>
      </li>
    </ul>
    <div v-show="isFocus" class="select_option">
      <ul class="select_option-list">
        <li
          v-for="(option, index) in options"
          :key="index"
          :data-select-value="option"
          class="select_option-list-item"
          @click.stop="handleClickOption"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

const classNameSelected = 'select_option-list-item--selected';

@Component
export default class ModuleSelect extends Vue {
  /**
   * data
   */
  private isFocus = false;

  /**
   * props
   */
  @Prop({ type: Boolean, default: () => false })
  private disable!: boolean;

  @Prop({ type: Boolean, default: () => true })
  private required!: boolean;

  @Prop({ type: Boolean, default: () => false })
  private multiple!: boolean;

  @Prop({ type: Array, default: () => [] })
  private value!: string[];

  @Prop({ type: Array, default: () => [] })
  private options!: boolean;

  @Emit('input')
  private emitInput(value: string[]): string[] {
    return value;
  }

  /**
   * computed
   */
  private get internalValue(): string[] {
    return this.value;
  }
  private set internalValue(newValue: string[]) {
    if (this.value !== newValue) this.emitInput(newValue);
  }

  /**
   * lifecycle hook
   */
  created(): void {
    document.addEventListener('click', this.documentClick);
  }

  /**
   * methods
   */
  documentClick(e: UIEvent): void {
    const select = (e.target as HTMLElement).closest('.select');
    if (select === null || select !== this.$el) {
      this.isFocus = false;
    }
  }

  handleClickSelect(): void {
    if (this.disable) return;
    this.isFocus = !this.isFocus;

    // propsで値が変わったときにclassの変更が実行されないので、開くときに毎回確認する
    this.$el.querySelectorAll('.select_option-list-item').forEach(element => {
      element.classList.remove(classNameSelected);
      if (this.internalValue.length > 0) {
        this.internalValue.forEach(value => {
          if (element.getAttribute('data-select-value') === value) {
            element.classList.add(classNameSelected);
          }
        });
      }
    });
  }

  handleClickOption(e: UIEvent): void {
    const currentTarget = e.currentTarget as HTMLElement;
    const dataValue = currentTarget.getAttribute('data-select-value');

    if (dataValue === null) return;

    currentTarget.classList.toggle(classNameSelected);

    if (currentTarget.classList.contains(classNameSelected)) {
      if (this.multiple) {
        this.internalValue.push(dataValue);
      } else {
        this.$el.querySelectorAll('.select_option-list-item').forEach(element => {
          if (element !== currentTarget) element.classList.remove(classNameSelected);
        });
        this.internalValue = [dataValue];
        this.close();
      }
    } else {
      if (this.multiple) {
        this.internalValue = this.internalValue.filter(value => value !== dataValue);
      } else {
        this.internalValue = [];
        this.close();
      }
    }
  }

  handleClickDelete(e: UIEvent): void {
    const dataValue = (e.currentTarget as HTMLElement).getAttribute('data-select-value');
    this.internalValue = this.internalValue.filter(value => value !== dataValue);
  }

  close(): void {
    this.isFocus = false;
  }
}
</script>
