import '@/scss/base.scss';
import '@/scss/index.scss';

import './plugins/firebase/index.js';
import Vue from 'vue';
import App from './App.vue';
import Store from './Store/index.js';
import Login from './plugins/Login/index.js';
import DataManager from './plugins/DataManager/index.js';
import { auth, messaging } from './plugins/firebase/index.js';
import FirebaseCloudMessage from './plugins/FirebaseCloudMessage/index.js';

// サービスワーカー登録
navigator.serviceWorker.register('/sw.js').then(registration => {
  // プッシュ通知（対応していれば）
  if (messaging !== null) {
    messaging.useServiceWorker(registration);
  }

  // サービスワーカーのアップデート確認
  registration.onupdatefound = () => {
    console.log('ServiceWorker update found.');
    registration.update();
  };
});

auth.onAuthStateChanged(user => {
  if (!user) {
    Login.create();
    return;
  }

  // プッシュ通知ポップアップ
  if (messaging !== null) {
    const firebaseCloudMessage = FirebaseCloudMessage();
    firebaseCloudMessage.requestPermission();
    firebaseCloudMessage.bind();
  }

  Login.destroy();

  document.body.insertAdjacentHTML('beforeend', '<div id="app"></div>');

  // state初期化
  Store.initialize();
  Store.setLoginUser(user.email.split('@')[0]);
  const userName = {
    yuki: '勇気',
    tomoe: '友恵',
    ikuma: '生真'
  };
  Store.setLoginUserName(userName[user.email.split('@')[0]]);

  // データベースの変更を監視
  DataManager.updater.watch();

  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  });
});
