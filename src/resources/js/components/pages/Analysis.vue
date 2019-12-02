<template>
  <section id="screen-analysis" :aria-hidden="page === 'analysis' ? 'false' : 'true'" class="block-content" role="tabpanel">
    <div class="block-box u-pt-0 u-pb-0">
      <form class="u-pos-r" @submit="handleSubmit">
        <module-loading :is-show="isLoading"></module-loading>
        <table class="table-style-01">
          <tbody>
            <tr class="table-style-01_row">
              <th class="table-style-01_head-lv1">年</th>
              <th class="table-style-01_head-lv1">月</th>
              <th class="table-style-01_head-lv1">利用者</th>
            </tr>
            <tr class="table-style-01_row">
              <td class="table-style-01_data">
                <module-select v-model="year" :options="yearOptions"></module-select>
              </td>
              <td class="table-style-01_data">
                <module-select v-model="month" :options="monthOptions"></module-select>
              </td>
              <td class="table-style-01_data">
                <module-select v-model="user" :options="userOptions"></module-select>
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="分析" class="input-submit" />
      </form>
      <div v-if="Object.keys(data).length > 0" class="u-mt-30">
        <dl class="list-definition u-mb-10-sp">
          <dt class="list-definition_term">
            支出
          </dt>
          <dd class="list-definition_description">{{ data['支出']['概要']['practical'] }}円</dd>
        </dl>
        <dl class="list-definition u-mb-10-sp">
          <dt class="list-definition_term">
            収入
          </dt>
          <dd class="list-definition_description">{{ data['収入']['概要']['all'] }}円</dd>
        </dl>
        <dl class="list-definition u-mb-10-sp">
          <dt class="list-definition_term">
            収支
          </dt>
          <dd class="list-definition_description">
            <span
              class="text-money"
              :class="{ 'text-money--positive': data.incomeAndOutgo >= 0, 'text-money--negative': data.incomeAndOutgo < 0 }"
              >{{ data.incomeAndOutgo }}円</span
            >
          </dd>
        </dl>
        <dl class="list-definition u-mb-10-sp">
          <dt class="list-definition_term">
            貯蓄
          </dt>
          <dd class="list-definition_description">
            <span class="text-money" :class="{ 'text-money--positive': data['貯蓄']['概要']['all'] > 0 }"
              >{{ data['貯蓄']['概要']['all'] }}円</span
            >
          </dd>
        </dl>
        <div v-if="data.expenditures.length > 0">
          <p class="title-lv2">支出内訳</p>
          <table class="table-style-01 u-mt-10">
            <colgroup class="u-w-40p"></colgroup>
            <colgroup class="u-w-60p"></colgroup>
            <tbody>
              <tr class="table-style-01_row">
                <th class="table-style-01_head-lv1">
                  項目名
                </th>
                <td class="table-style-01_data u-ta-r u-fz-1_6rem">支払い額<span class="text-small">（ギフト等を含む）</span></td>
              </tr>
              <tr v-for="(expenditure, index) in data.expenditures" :key="index" class="table-style-01_row">
                <th class="table-style-01_head-lv2">
                  {{ expenditure.key }}
                </th>
                <td class="table-style-01_data u-ta-r u-fz-1_6rem">
                  {{ expenditure.practical }}<span class="text-small">（{{ expenditure.all }}）</span>円
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="data.incomes.length > 0">
          <p class="title-lv2">収入内訳</p>
          <table class="table-style-01 u-mt-10">
            <colgroup class="u-w-40p"></colgroup>
            <colgroup class="u-w-60p"></colgroup>
            <tbody>
              <tr class="table-style-01_row">
                <th class="table-style-01_head-lv1">
                  項目名
                </th>
                <td class="table-style-01_data u-ta-r u-fz-1_6rem">収入額</td>
              </tr>
              <tr v-for="(income, index) in data.incomes" :key="index" class="table-style-01_row">
                <th class="table-style-01_head-lv2">
                  {{ income.key }}
                </th>
                <td class="table-style-01_data u-ta-r u-fz-1_6rem">{{ income.all }}円</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="data.storages.length > 0">
          <p class="title-lv2">貯蓄内訳</p>
          <table class="table-style-01 u-mt-10">
            <colgroup class="u-w-40p"></colgroup>
            <colgroup class="u-w-60p"></colgroup>
            <tbody>
              <tr class="table-style-01_row">
                <th class="table-style-01_head-lv1">
                  項目名
                </th>
                <td class="table-style-01_data u-ta-r u-fz-1_6rem">貯蓄額</td>
              </tr>
              <tr v-for="(storage, index) in data.storages" :key="index" class="table-style-01_row">
                <th class="table-style-01_head-lv2">
                  {{ storage.key }}
                </th>
                <td class="table-style-01_data u-ta-r u-fz-1_6rem">{{ storage.all }}円</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment';
import ModuleSelect from '@/js/components/modules/Select.vue';
import ModuleLoading from '@/js/components/modules/Loading.vue';
import DataManager from '@/js/plugins/DataManager/index.js';
import Store from '@/js/Store/index.js';

export default {
  name: 'PageAnalysis',
  components: {
    ModuleSelect,
    ModuleLoading
  },
  props: {
    page: {
      type: String,
      default: () => ''
    }
  },
  data: function() {
    const now = moment();
    const yearOptions = [];

    // 2019年から今のYYYY
    for (let year = 2019; year <= now.format('YYYY'); year++) {
      yearOptions.push(year);
    }

    return {
      year: [now.format('YYYY')],
      month: [now.format('MM')],
      user: [Store.state.loginUserName],
      yearOptions,
      monthOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      userOptions: ['全員', '勇気', '友恵', '生真'],
      data: {},
      isLoading: false
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.render();
    },
    render() {
      this.isLoading = true;

      const target = moment(`${this.year[0]}-${this.month[0].padStart(2, '0')}-01`);
      const start = target.startOf('month').format('YYYY-MM-DD');
      const end = target.endOf('month').format('YYYY-MM-DD');
      const query = [{ key: 'date', operator: '>=', value: start }, { key: 'date', operator: '<=', value: end }];
      if (this.user[0] !== '全員') {
        query.push({ key: 'user', operator: '==', value: this.user[0] });
      }

      const data = {
        支出: {
          概要: {}
        },
        収入: {
          概要: {}
        },
        貯蓄: {
          概要: {}
        }
      };
      DataManager.reader
        .getDocuments({
          where: query
        })
        .then(documents => {
          documents.forEach(doc => {
            data[doc.category][doc.subCategory] = data[doc.category][doc.subCategory] || {};
            data[doc.category][doc.subCategory]['virtual'] = data[doc.category][doc.subCategory]['virtual'] || 0;
            data[doc.category][doc.subCategory]['credit'] = data[doc.category][doc.subCategory]['credit'] || 0;
            data[doc.category][doc.subCategory]['cash'] = data[doc.category][doc.subCategory]['cash'] || 0;
            data[doc.category][doc.subCategory]['all'] = data[doc.category][doc.subCategory]['all'] || 0;
            data[doc.category]['概要']['virtual'] = data[doc.category]['概要']['virtual'] || 0;
            data[doc.category]['概要']['credit'] = data[doc.category]['概要']['credit'] || 0;
            data[doc.category]['概要']['cash'] = data[doc.category]['概要']['cash'] || 0;
            data[doc.category]['概要']['all'] = data[doc.category]['概要']['all'] || 0;

            if (doc.category === '支出') {
              // 実際に消費した金額 ICカード等で払ったものは含めない
              data['支出'][doc.subCategory]['practical'] = data['支出'][doc.subCategory]['practical'] || 0;
              data['支出']['概要']['practical'] = data['支出']['概要']['practical'] || 0;

              if (!['ポイント', 'ICカード', 'ギフト'].includes(doc.payment)) {
                data['支出'][doc.subCategory]['practical'] += doc.money;
                data['支出']['概要']['practical'] += doc.money;
              }
            }

            if (['ポイント', 'ICカード', 'ギフト'].includes(doc.payment)) {
              data[doc.category][doc.subCategory]['virtual'] += doc.money;
              data[doc.category]['概要']['virtual'] += doc.money;
            } else if (doc.payment === 'クレジットカード') {
              data[doc.category][doc.subCategory]['credit'] += doc.money;
              data[doc.category]['概要']['credit'] += doc.money;
            } else {
              data[doc.category][doc.subCategory]['cash'] += doc.money;
              data[doc.category]['概要']['cash'] += doc.money;
            }

            data[doc.category][doc.subCategory]['all'] += doc.money;
            data[doc.category]['概要']['all'] += doc.money;
          });

          data.expenditures = [];
          data.incomes = [];
          data.storages = [];

          for (let key in data['支出']) {
            if (key === '概要') continue;
            data.expenditures.push({ key, practical: data['支出'][key]['practical'], all: data['支出'][key]['all'] });
          }
          for (let key in data['収入']) {
            if (key === '概要') continue;
            data.incomes.push({ key, all: data['収入'][key]['all'] });
          }
          for (let key in data['貯蓄']) {
            if (key === '概要') continue;
            data.storages.push({ key, all: data['貯蓄'][key]['all'] });
          }

          data['収入']['概要']['all'] = data['収入']['概要']['all'] || 0;
          data['支出']['概要']['practical'] = data['支出']['概要']['practical'] || 0;
          data['貯蓄']['概要']['all'] = data['貯蓄']['概要']['all'] || 0;

          // 収支の計算
          data.incomeAndOutgo = data['収入']['概要']['all'] - data['支出']['概要']['practical'];

          console.log(data);
          this.data = data;

          this.isLoading = false;
        })
        .catch(error => {
          Store.setMessageText('エラー: 分析に失敗しました。');
          Store.setMessageType('error');
          Store.setIsMessageShow(true);
          this.isLoading = false;
          console.error(error);
        });
    }
  }
};
</script>
