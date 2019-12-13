import firebaseConfig from '@/ts/config/firebase.json';
import { database } from '@/ts/plugins/firebase/index';
import { messaging } from '@/ts/plugins/firebase/index';
import Store from '@/ts/Store/index';

const FirebaseCloudMessage = (): { [key: string]: Function } => {
  // 通知許可のポップアップ
  function requestPermission(): void {
    (messaging as firebase.messaging.Messaging).requestPermission().then(() => {
      (messaging as firebase.messaging.Messaging).usePublicVapidKey(firebaseConfig.publicVapidKey);
      (messaging as firebase.messaging.Messaging).getToken().then(token => {
        console.log('FirebaseCloudMessage - messaging.getToken():', token);
        if (token === null) return;
        updateToken(token);
      });
    });
  }

  function bind(): void {
    // トークンの更新処理
    (messaging as firebase.messaging.Messaging).onTokenRefresh(() => {
      (messaging as firebase.messaging.Messaging).getToken().then(token => {
        console.log('FirebaseCloudMessage - messaging.onTokenRefresh().getToken():', token);
        if (token === null) return;
        updateToken(token);
      });
    });

    // メッセージの受信
    (messaging as firebase.messaging.Messaging).onMessage(payload => {
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
  async function updateToken(newToken: string): Promise<void> {
    const willUpdate = await database
      .collection('messaging')
      .doc('token')
      .get()
      .then(document => {
        // DBに登録されているトークンと異なる場合は更新
        return (document.data() as firebase.firestore.DocumentData)[Store.state.loginUser] !== newToken ? true : false;
      });

    return new Promise((resolve, reject) => {
      if (willUpdate) {
        database
          .collection('messaging')
          .doc('token')
          .update({
            [Store.state.loginUser]: newToken
          })
          .then(() => {
            console.log('FirebaseCloudMessage - updateToken: 成功');
            resolve();
          })
          .catch(error => {
            console.error('FirebaseCloudMessage - updateToken: 失敗', error);
            reject();
          });
      }
      resolve();
    });
  }

  return {
    requestPermission,
    bind
  };
};

export default FirebaseCloudMessage;
