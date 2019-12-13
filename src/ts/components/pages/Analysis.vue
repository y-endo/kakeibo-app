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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Where } from 'type/index';
import moment from 'moment';
import ModuleSelect from '@/ts/components/modules/Select.vue';
import ModuleLoading from '@/ts/components/modules/Loading.vue';
import DataManager from '@/ts/plugins/DataManager/index';
import Store from '@/ts/Store/index';

// 2019年から今のYYYY
const now = moment();
const yearOptions: number[] = [];
for (let year = 2019; year <= parseInt(now.format('YYYY'), 10); year++) {
  yearOptions.push(year);
}

type Summary = {
  virtual: number;
  credit: number;
  cash: number;
  all: number;
  practical?: number;
};

type Detail = {
  key: string;
  all: number;
  practical?: number;
};

type AnalysisData = {
  支出: {
    [key: string]: Summary;
    概要: Summary;
  };
  収入: {
    [key: string]: Summary;
    概要: Summary;
  };
  貯蓄: {
    [key: string]: Summary;
    概要: Summary;
  };
  expenditures: Detail[];
  incomes: Detail[];
  storages: Detail[];
  incomeAndOutgo: number;
};

@Component({
  components: {
    ModuleSelect,
    ModuleLoading
  }
})
export default class PageAnalysis extends Vue {
  /**
   * data
   */
  private year: string[] = [now.format('YYYY')];
  private month: string[] = [now.format('MM')];
  private user: string[] = [Store.state.loginUserName];
  private yearOptions: number[] = yearOptions;
  private monthOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private userOptions: string[] = ['全員', '勇気', '友恵', '生真'];
  private data: AnalysisData | {} = {};
  private isLoading = false;

  /**
   * props
   */
  @Prop({ type: String, default: '' })
  private page!: string;

  /**
   * methods
   */
  private handleSubmit(e: UIEvent): void {
    e.preventDefault();
    this.renderAnalysis();
  }

  private renderAnalysis(): void {
    this.isLoading = true;

    const target = moment(`${this.year[0]}-${this.month[0].padStart(2, '0')}-01`);
    const start = target.startOf('month').format('YYYY-MM-DD');
    const end = target.endOf('month').format('YYYY-MM-DD');
    const query: Where[] = [
      { key: 'date', operator: '>=', value: start },
      { key: 'date', operator: '<=', value: end }
    ];
    if (this.user[0] !== '全員') {
      query.push({ key: 'user', operator: '==', value: this.user[0] });
    }

    const summary: Summary = {
      virtual: 0,
      credit: 0,
      cash: 0,
      all: 0
    };
    const data: AnalysisData = {
      支出: {
        概要: { ...summary }
      },
      収入: {
        概要: { ...summary }
      },
      貯蓄: {
        概要: { ...summary }
      },
      expenditures: [],
      incomes: [],
      storages: [],
      incomeAndOutgo: 0
    };
    DataManager.reader
      .getDocuments({
        where: query
      })
      .then(documents => {
        documents.forEach(doc => {
          const category: '支出' | '収入' | '貯蓄' = doc.category;
          const subCategory: string = doc.subCategory;

          data[category][subCategory] = data[category][subCategory] || {};
          data[category][subCategory]['virtual'] = data[category][subCategory]['virtual'] || 0;
          data[category][subCategory]['credit'] = data[category][subCategory]['credit'] || 0;
          data[category][subCategory]['cash'] = data[category][subCategory]['cash'] || 0;
          data[category][subCategory]['all'] = data[category][subCategory]['all'] || 0;

          if (category === '支出') {
            // 実際に消費した金額 ICカード等で払ったものは含めない
            data['支出'][subCategory]['practical'] = data['支出'][subCategory]['practical'] || 0;
            data['支出']['概要']['practical'] = data['支出']['概要']['practical'] || 0;

            if (!['ポイント', 'ICカード', 'ギフト'].includes(doc.payment)) {
              data['支出'][subCategory]['practical'] += doc.money;
              data['支出']['概要']['practical'] += doc.money;
            }
          }

          if (['ポイント', 'ICカード', 'ギフト'].includes(doc.payment)) {
            data[category][subCategory]['virtual'] += doc.money;
            data[category]['概要']['virtual'] += doc.money;
          } else if (doc.payment === 'クレジットカード') {
            data[category][subCategory]['credit'] += doc.money;
            data[category]['概要']['credit'] += doc.money;
          } else {
            data[category][subCategory]['cash'] += doc.money;
            data[category]['概要']['cash'] += doc.money;
          }

          data[category][subCategory]['all'] += doc.money;
          data[category]['概要']['all'] += doc.money;
        });

        for (const key in data['支出']) {
          if (key === '概要') continue;
          data.expenditures.push({ key, practical: data['支出'][key]['practical'], all: data['支出'][key]['all'] });
        }
        for (const key in data['収入']) {
          if (key === '概要') continue;
          data.incomes.push({ key, all: data['収入'][key]['all'] });
        }
        for (const key in data['貯蓄']) {
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
</script>
