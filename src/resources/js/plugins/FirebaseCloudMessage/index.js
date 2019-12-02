import firebaseConfig from '@/js/config/firebase.json';
import { database } from '@/js/plugins/firebase/index.js';
import { messaging } from '@/js/plugins/firebase/index.js';
import Store from '@/js/Store/index.js';

const FirebaseCloudMessage = () => {
  // 通知許可のポップアップ
  function requestPermission() {
    messaging.requestPermission().then(() => {
      messaging.usePublicVapidKey(firebaseConfig.publicVapidKey);
      messaging.getToken().then(token => {
        console.log('FirebaseCloudMessage - messaging.getToken():', token);
        updateToken(token);
      });
    });
  }

  function bind() {
    // トークンの更新処理
    messaging.onTokenRefresh(() => {
      messaging.getToken().then(token => {
        console.log('FirebaseCloudMessage - messaging.onTokenRefresh().getToken():', token);
        updateToken(token);
      });
    });

    // メッセージの受信
    messaging.onMessage(payload => {
      const title = payload.notification.title;
      const options = {
        body: payload.notification.body,
        icon: payload.notification.icon
      };

      if (Notification.permission === 'granted') {
        new Notification(title, options);
      }
    });
  }

  /**
   * ログインしているユーザーのトークンを更新する
   * @param {String} newToken 新しいトークン
   */
  async function updateToken(newToken) {
    const willUpdate = await database
      .collection('messaging')
      .doc('token')
      .get()
      .then(document => {
        // DBに登録されているトークンと異なる場合は更新
        return document.data()[Store.state.loginUser] !== newToken ? true : false;
      });

    if (willUpdate) {
      database
        .collection('messaging')
        .doc('token')
        .update({
          [Store.state.loginUser]: newToken
        })
        .then(() => {
          console.log('FirebaseCloudMessage - updateToken: 成功');
        })
        .catch(error => {
          console.error('FirebaseCloudMessage - updateToken: 失敗', error);
        });
    }
  }

  return {
    requestPermission,
    bind
  };
};

export default FirebaseCloudMessage;
