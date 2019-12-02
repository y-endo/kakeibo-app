const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fireStore = admin.firestore();

exports.createData = functions.firestore.document('data/{documentId}').onCreate(change => {
  console.log('===== createData =====');

  const data = change.data();
  console.log('data:', data);

  let pushTarget;
  if (data.lastEditor === 'yuki') {
    pushTarget = 'tomoe';
  } else if (data.lastEditor === 'tomoe') {
    pushTarget = 'yuki';
  }

  fireStore
    .collection('messaging')
    .doc('token')
    .get()
    .then(document => {
      const token = document.data()[pushTarget];

      const payload = {
        notification: {
          title: '家計簿',
          body: `${data.user}: ${data.date}の${data.category}が登録されました。`,
          icon: '/assets/icons/icon-192x192.png',
          sound: 'default',
          click_action: 'https://kakeibo-46f55.firebaseapp.com/'
        }
      };

      const options = {
        priority: 'high'
      };

      admin
        .messaging()
        .sendToDevice(token, payload, options)
        .then(pushResponse => {
          console.log('Successfully sent message:', pushResponse);
        })
        .catch(error => {
          console.log('Error sending message:', error);
        });
    })
    .catch(error => {
      console.log('error', error);
    });

  return true;
});
