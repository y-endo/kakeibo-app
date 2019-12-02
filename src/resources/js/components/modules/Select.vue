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

<script>
const classNameSelected = 'select_option-list-item--selected';

export default {
  name: 'ModuleSelect',
  props: {
    disable: {
      type: Boolean,
      default: () => false
    },
    required: {
      type: Boolean,
      default: () => true
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      isFocus: false
    };
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        if (this.value !== newValue) this.$emit('input', newValue);
      }
    }
  },
  created() {
    document.addEventListener('click', this.documentClick);
  },
  methods: {
    documentClick(e) {
      const select = e.target.closest('.select');
      if (select === null || select !== this.$el) {
        this.isFocus = false;
      }
    },
    handleClickSelect() {
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
    },
    handleClickOption(e) {
      const dataValue = e.currentTarget.getAttribute('data-select-value');

      e.currentTarget.classList.toggle(classNameSelected);

      if (e.currentTarget.classList.contains(classNameSelected)) {
        if (this.multiple) {
          this.internalValue.push(dataValue);
        } else {
          this.$el.querySelectorAll('.select_option-list-item').forEach(element => {
            if (element !== e.currentTarget) element.classList.remove(classNameSelected);
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
    },
    handleClickDelete(e) {
      const dataValue = e.currentTarget.getAttribute('data-select-value');
      this.internalValue = this.internalValue.filter(value => value !== dataValue);
    },
    close() {
      this.isFocus = false;
    }
  }
};
</script>
