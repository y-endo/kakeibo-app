<template>
  <form @submit="handleSubmit">
    <table class="table-style-01 u-w-100p u-mt-0">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <thead>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1" colspan="2">
            日付範囲
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv2">
            開始
          </th>
          <td class="table-style-01_data">
            <input v-model="startDate" required type="date" class="input" min="2019-01-01" />
          </td>
        </tr>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv2">
            終了
          </th>
          <td class="table-style-01_data">
            <input v-model="endDate" required type="date" class="input" />
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01 u-w-100p">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <thead>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1" colspan="2">
            金額
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv2">
            最低
          </th>
          <td class="table-style-01_data">
            <input v-model="minMoney" min="0" placeholder="最低" type="number" class="input" />
          </td>
        </tr>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv2">
            最大
          </th>
          <td class="table-style-01_data">
            <input v-model="maxMoney" min="0" placeholder="最大" type="number" class="input" />
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            大カテゴリー
          </th>
          <td class="table-style-01_data">
            <module-select v-model="category" :options="categoryOptions" :required="false" :multiple="true"></module-select>
          </td>
        </tr>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            小カテゴリー
          </th>
          <td class="table-style-01_data">
            <module-select
              v-model="subCategory"
              :options="subCategoryOptions"
              :required="false"
              :multiple="true"
              :disable="category.length === 0"
            ></module-select>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            支払い方法
          </th>
          <td class="table-style-01_data">
            <module-select v-model="payment" :required="false" :multiple="true" :options="paymentOptions"></module-select>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            メモ
          </th>
          <td class="table-style-01_data">
            <textarea v-model="memo" placeholder="メモ" class="textarea"></textarea>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            利用者
          </th>
          <td class="table-style-01_data">
            <module-select v-model="user" :required="false" :options="userOptions"></module-select>
          </td>
        </tr>
      </tbody>
    </table>
    <input type="submit" value="検索" class="input-submit" />
  </form>
</template>

<script lang="ts">
import { Component, Emit, Watch, Vue } from 'vue-property-decorator';
import { Where, OrderBy, DocumentsFilter, Query, SearchQuery } from 'type/index';
import moment from 'moment';
import categoryProps from '@/ts/config/categoryProps.json';
import ModuleSelect from '@/ts/components/modules/Select.vue';
import Store from '@/ts/Store/index';

@Component({
  components: {
    ModuleSelect
  }
})
export default class ModuleSearchForm extends Vue {
  private startDate = moment()
    .subtract(7, 'days')
    .format('YYYY-MM-DD');
  private endDate = moment().format('YYYY-MM-DD');
  private minMoney = 0;
  private maxMoney = null;
  private category = [];
  private subCategory = [];
  private payment = [];
  private memo = '';
  private user = [Store.state.loginUserName];
  private categoryOptions = categoryProps.main;
  private paymentOptions = ['現金', 'クレジットカード', '振込', 'ポイント', 'ICカード', 'ギフト'];
  private userOptions = ['勇気', '友恵', '生真'];

  get subCategoryOptions(): string[] {
    if (this.category.length === 0) return [];

    let value: string[] = [];
    this.category.forEach(category => {
      value = value.concat(categoryProps.sub[category]);
    });
    return value;
  }

  @Watch('category')
  handleWatchCategory(): void {
    this.subCategory = [];
  }

  @Emit('search-query')
  private searchQuery(value: SearchQuery): SearchQuery {
    return value;
  }

  handleSubmit(e: Event): void {
    e.preventDefault();

    const dayDiff = moment(this.endDate).diff(moment(this.startDate), 'days');
    if (dayDiff > 31) {
      Store.setMessageText(`エラー: 日付範囲が"${dayDiff}"日分です。 一度に取得できるデータは"31"日分です。`);
      Store.setMessageType('error');
      Store.setIsMessageShow(true);
      return;
    }

    const where: Where[] = [
      { key: 'date', operator: '>=', value: this.startDate },
      { key: 'date', operator: '<=', value: this.endDate }
    ];
    const filter: DocumentsFilter = {};

    // 最小金額
    const minMoney = parseInt(String(this.minMoney));
    if (!isNaN(minMoney) && typeof minMoney === 'number' && minMoney >= 0) {
      filter.minMoney = minMoney;
    }

    // 最大金額
    const maxMoney = parseInt(String(this.maxMoney));
    if (!isNaN(maxMoney) && typeof maxMoney === 'number' && maxMoney >= 0) {
      filter.maxMoney = maxMoney;
    }

    // カテゴリ
    if (this.category.length > 0) {
      filter.category = this.category;
    }

    // サブカテゴリ
    if (this.subCategory.length > 0) {
      filter.subCategory = this.subCategory;
    }

    // 支払い方法
    if (this.payment.length > 0) {
      filter.payment = this.payment;
    }

    // メモ
    if (this.memo !== '') {
      filter.memo = this.memo;
    }

    // 利用者
    if (this.user.length > 0) {
      where.push({ key: 'user', operator: '==', value: this.user[0] });
    }

    const orderBy: OrderBy[] = [
      { key: 'date', sort: 'desc' },
      { key: 'pubDate', sort: 'desc' }
    ];
    const query: Query = {
      where,
      orderBy
    };

    this.searchQuery({ query, filter });

    Store.setIsModalOpen(false);
  }
}
</script>
