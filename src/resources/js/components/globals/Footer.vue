<template>
  <footer id="footer">
    <div class="nav">
      <ul class="nav-list">
        <li class="nav-list_item">
          <div class="nav-button-container">
            <button
              :aria-selected="page === 'home' ? 'true' : 'false'"
              role="tab"
              aria-controls="page-home"
              class="nav-button"
              @click="changeTabPanel"
            >
              <svg viewBox="0 0 512 512" class="nav-button_icon"><use xlink:href="#icon-home"></use></svg>
              <span class="nav-button_text">ホーム</span>
            </button>
          </div>
        </li>
        <li class="nav-list_item">
          <div class="nav-button-container">
            <button
              :aria-selected="page === 'input' ? 'true' : 'false'"
              role="tab"
              aria-controls="page-input"
              class="nav-button"
              @click="changeTabPanel"
            >
              <svg viewBox="0 0 512 512" class="nav-button_icon u-ml-5"><use xlink:href="#icon-write"></use></svg>
              <span class="nav-button_text">入力</span>
            </button>
          </div>
        </li>
        <li class="nav-list_item">
          <div class="nav-button-container">
            <button
              :aria-selected="page === 'history' ? 'true' : 'false'"
              role="tab"
              aria-controls="page-history"
              class="nav-button"
              @click="changeTabPanel"
            >
              <svg viewBox="0 0 512 512" class="nav-button_icon"><use xlink:href="#icon-history"></use></svg>
              <span class="nav-button_text">履歴</span>
            </button>
          </div>
        </li>
        <li class="nav-list_item">
          <div class="nav-button-container">
            <button
              :aria-selected="page === 'analysis' ? 'true' : 'false'"
              role="tab"
              aria-controls="page-analysis"
              class="nav-button"
              @click="changeTabPanel"
            >
              <svg viewBox="0 0 512 512" class="nav-button_icon"><use xlink:href="#icon-analysis"></use></svg>
              <span class="nav-button_text">分析</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import Store from '@/js/Store/index.js';

export default {
  name: 'GlobalFooter',
  props: {
    page: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    changeTabPanel(e) {
      Store.setPage(e.currentTarget.getAttribute('aria-controls').replace('page-', ''));
    }
  }
};
</script>
