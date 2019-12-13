import moment from 'moment';
import { database } from '@/ts/plugins/firebase/index';
import EventEmitter from '@/ts/plugins/EventEmitter/index';

type UpdateHomeDataOption = {
  money: number;
  payment: string;
  date: string;
  user: string;
};

class DataUpdater {
  watch(): void {
    database.collection('home').onSnapshot(() => {
      EventEmitter.emit('DATABASE_HOME_UPDATE');
    });
    database.collection('data').onSnapshot(() => {
      EventEmitter.emit('DATABASE_DATA_UPDATE');
    });
  }

  update(id: string, newValue: firebase.firestore.UpdateData): Promise<void> {
    console.log('DataManager: DataUpdater.update');
    return new Promise((resolve, reject) => {
      database
        .collection('data')
        .doc(id)
        .update(newValue)
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  resetHomeData(type: string): Promise<void> | undefined {
    console.log('DataManager: DataUpdater.resetHomeData', type);
    if (type === 'day') {
      return database
        .collection('home')
        .doc('expenditure')
        .update({ day: { all: 0, yuki: 0, tomoe: 0, ikuma: 0, today: moment().format('YYYY-MM-DD') } });
    } else if (type === 'month') {
      return database
        .collection('home')
        .doc('expenditure')
        .update({
          day: { all: 0, yuki: 0, tomoe: 0, ikuma: 0, today: moment().format('YYYY-MM-DD') },
          month: { all: 0, yuki: 0, tomoe: 0, ikuma: 0, thisMonth: moment().format('MM') },
          emoney: { all: 0, yuki: 0, tomoe: 0, ikuma: 0 },
          credit: { all: 0, yuki: 0, tomoe: 0, ikuma: 0 }
        });
    }
    return;
  }

  updateHomeData(newValue: UpdateHomeDataOption): Promise<void> | undefined {
    console.log('DataManager: DataUpdater.updateHomeData');
    // 登録されたデータが今月のものじゃない
    if (
      moment()
        .startOf('month')
        .format('YYYY-MM-DD') > newValue.date ||
      moment()
        .endOf('month')
        .format('YYYY-MM-DD') < newValue.date
    )
      return;

    return new Promise((resolve, reject) => {
      const user: { [key: string]: string } = {
        勇気: 'yuki',
        友恵: 'tomoe',
        生真: 'ikuma'
      };
      newValue.user = user[newValue.user];

      database
        .collection('home')
        .doc('expenditure')
        .get()
        .then(document => {
          const today = moment().format('YYYY-MM-DD');
          const currentData = document.data();

          console.log(document.data());

          if (currentData === void 0) {
            reject();
            return;
          }

          if (['ポイント', 'ICカード', 'ギフト'].includes(newValue.payment)) {
            currentData.emoney.all += newValue.money;
            currentData.emoney[newValue.user] += newValue.money;
          } else {
            // 今日のデータ
            if (newValue.date === today) {
              currentData.day.all += newValue.money;
              currentData.day[newValue.user] += newValue.money;
            }
            // 今月のデータ
            currentData.month.all += newValue.money;
            currentData.month[newValue.user] += newValue.money;
          }

          if (newValue.payment === 'クレジットカード') {
            currentData.credit.all += newValue.money;
            currentData.credit[newValue.user] += newValue.money;
          }

          console.log(currentData);

          database
            .collection('home')
            .doc('expenditure')
            .update(currentData)
            .then(result => {
              resolve(result);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default DataUpdater;
