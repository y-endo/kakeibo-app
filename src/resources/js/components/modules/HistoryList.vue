<template>
  <div class="history">
    <div class="history_date">
      <div class="history_date-year">
        {{ dateString.year }}
      </div>
      {{ dateString.month }}/{{ dateString.day }}
    </div>
    <div class="history_detail">
      <div class="history_total">
        <div class="history_total-item"><span class="history_total-label">収入</span>{{ totalIncome }}円</div>
        <div class="history_total-item"><span class="history_total-label">支出</span>{{ totalExpense }}円</div>
      </div>
      <ul class="history_list">
        <li
          v-for="(item, index) in itemData"
          :key="index"
          :data-user="item.user"
          class="history_list-item"
          @click="handleClick($event, item)"
        >
          <p
            class="history_money"
            :class="{ 'history_money--positive': item.category === '収入', 'history_money--neutral': item.category === '貯蓄' }"
          >
            {{ item.money }}円
          </p>
          <p class="history_user">
            {{ item.user[0] }}
          </p>
          <ul class="history_tag-list">
            <li class="history_tag-list-item">
              {{ item.subCategory }}
            </li>
            <li class="history_tag-list-item">
              {{ item.payment }}
            </li>
          </ul>
          <p v-show="item.memo !== ''" class="history_excerpt">
            {{ item.memo }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleHistoryList',
  props: {
    date: {
      type: String,
      default: () => ''
    },
    itemData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dateString() {
      const dateArray = this.date.split('-');
      return {
        year: dateArray[0],
        month: dateArray[1],
        day: dateArray[2]
      };
    },
    totalExpense() {
      let result = 0;
      this.itemData.forEach(item => {
        if (item.sign !== 'minus' || ['ポイント', 'ICカード', 'ギフト'].includes(item.payment)) return;
        result -= item.money;
      });
      return result;
    },
    totalIncome() {
      let result = 0;
      this.itemData.forEach(item => {
        if (item.sign === 'minus' || item.category === '貯蓄') return;
        result += item.money;
      });
      return result;
    }
  },
  methods: {
    handleClick(e, data) {
      this.$emit('list-click', { event: e, data: data });
    }
  }
};
</script>
