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

<script>
import GlobalHeader from '@/js/components/globals/Header.vue';
import GlobalFooter from '@/js/components/globals/Footer.vue';
import GlobalSvgSymbol from '@/js/components/globals/SvgSymbol.vue';
import GlobalMessage from '@/js/components/globals/Message.vue';
import PageHome from '@/js/components/pages/Home.vue';
import PageInput from '@/js/components/pages/Input.vue';
import PageHistory from '@/js/components/pages/History.vue';
import PageAnalysis from '@/js/components/pages/Analysis.vue';
import Store from '@/js/Store/index.js';
import EventEmitter from '@/js/plugins/EventEmitter/index.js';

export default {
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter,
    GlobalSvgSymbol,
    GlobalMessage,
    PageHome,
    PageInput,
    PageHistory,
    PageAnalysis
  },
  data: function() {
    return {
      page: Store.state.page
    };
  },
  created() {
    EventEmitter.on('SET_PAGE', this.changeState);
  },
  methods: {
    changeState(e) {
      this[e.state] = Store.state[e.state];
    }
  }
};
</script>
