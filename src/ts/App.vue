<template>
  <div id="app">
    <global-svg-symbol></global-svg-symbol>
    <global-header :page="page"></global-header>
    <global-message></global-message>
    <main id="main">
      <page-home :page="page"></page-home>
      <page-input :page="page"></page-input>
      <page-history :page="page"></page-history>
      <page-analysis :page="page"></page-analysis>
    </main>
    <global-footer :page="page"></global-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GlobalHeader from '@/ts/components/globals/Header.vue';
import GlobalFooter from '@/ts/components/globals/Footer.vue';
import GlobalSvgSymbol from '@/ts/components/globals/SvgSymbol.vue';
import GlobalMessage from '@/ts/components/globals/Message.vue';
import PageHome from '@/ts/components/pages/Home.vue';
import PageInput from '@/ts/components/pages/Input.vue';
import PageHistory from '@/ts/components/pages/History.vue';
import PageAnalysis from '@/ts/components/pages/Analysis.vue';
import { Store, StoreEvent } from '@/ts/Store/index';
import EventEmitter from '@/ts/plugins/EventEmitter/index';

@Component({
  components: {
    GlobalHeader,
    GlobalFooter,
    GlobalSvgSymbol,
    GlobalMessage,
    PageHome,
    PageInput,
    PageHistory,
    PageAnalysis
  }
})
export default class App extends Vue {
  private page: string = Store.state.page;

  created() {
    EventEmitter.on('SET_PAGE', this.changeState);
  }

  changeState(e: StoreEvent) {
    this.page = Store.state[e.state as 'page'];
  }
}
</script>
