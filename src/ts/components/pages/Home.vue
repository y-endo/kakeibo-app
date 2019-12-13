<template>
  <section id="page-home" :aria-hidden="page === 'home' ? 'false' : 'true'" class="block-content" role="tabpanel">
    <div class="block-box u-pt-0 u-pb-0">
      <p class="title-lv1">{{ today }}</p>
      <div class="tab">
        <div class="tab-trigger">
          <button class="tab-trigger_item" aria-selected="true" value="all" @click="handleClick">合計</button>
          <button class="tab-trigger_item" aria-selected="false" value="yuki" @click="handleClick">勇気</button>
          <button class="tab-trigger_item" aria-selected="false" value="tomoe" @click="handleClick">友恵</button>
          <button class="tab-trigger_item" aria-selected="false" value="ikuma" @click="handleClick">生真</button>
        </div>
        <div class="tab-detail">
          <module-loading :is-show="isLoading"></module-loading>
          <div class="tab-detail_item" aria-hidden="false">
            <dl class="list-definition u-mb-10-sp">
              <dt class="list-definition_term">
                今日
              </dt>
              <dd class="list-definition_description">{{ expenditure.day[selected] }}円</dd>
            </dl>
            <dl class="list-definition u-mb-10-sp">
              <dt class="list-definition_term">
                今月
              </dt>
              <dd class="list-definition_description">{{ expenditure.month[selected] }}円</dd>
            </dl>
            <dl class="list-definition u-mb-10-sp">
              <dt class="list-definition_term">
                クレジットカード
              </dt>
              <dd class="list-definition_description">{{ expenditure.credit[selected] }}円</dd>
            </dl>
            <dl class="list-definition u-mb-10-sp">
              <dt class="list-definition_term">
                ポイント / ICカード / ギフト
              </dt>
              <dd class="list-definition_description">{{ expenditure.emoney[selected] }}円</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';
import DataManager from '@/ts/plugins/DataManager/index';
import EventEmitter from '@/ts/plugins/EventEmitter/index';
import ModuleLoading from '@/ts/components/modules/Loading.vue';

type ExpenditureType = {
  [key: string]: {
    all: number;
    yuki: number;
    tomoe: number;
    ikuma: number;
  };
};

@Component({
  components: {
    ModuleLoading
  }
})
export default class PageHome extends Vue {
  @Prop({ type: String, default: '' })
  private page!: string;

  private today = moment().format('YYYY-MM-DD');
  private expenditure: ExpenditureType = {
    day: {
      all: 0,
      yuki: 0,
      tomoe: 0,
      ikuma: 0
    },
    month: {
      all: 0,
      yuki: 0,
      tomoe: 0,
      ikuma: 0
    },
    credit: {
      all: 0,
      yuki: 0,
      tomoe: 0,
      ikuma: 0
    },
    emoney: {
      all: 0,
      yuki: 0,
      tomoe: 0,
      ikuma: 0
    }
  };
  private selected = 'all';
  private isLoading = true;

  created(): void {
    EventEmitter.on('DATABASE_HOME_UPDATE', this.getHomeData);
  }

  getHomeData(): void {
    DataManager.reader.getHomeData().then(data => {
      if (data.day.today !== this.today) {
        DataManager.updater.resetHomeData('day');
        return;
      } else if (data.month.thisMonth !== moment().format('MM')) {
        DataManager.updater.resetHomeData('month');
        return;
      }
      this.expenditure = data;
      this.isLoading = false;
    });
  }

  handleClick(e: UIEvent): void {
    const clicked = (e.currentTarget as HTMLElement).getAttribute('value') as string;
    const items = this.$el.querySelectorAll('.tab-trigger_item');

    items.forEach(item => {
      item.setAttribute('aria-selected', String(item.getAttribute('value') === clicked));
    });

    this.selected = clicked;
  }
}
</script>
