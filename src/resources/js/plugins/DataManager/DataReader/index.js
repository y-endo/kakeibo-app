import { database } from '@/js/plugins/firebase/index.js';

class DataReader {
  constructor() {}

  getDocument(id) {
    console.log('DataManager: DataReader.getDocument', id);
    return new Promise((resolve, reject) => {
      database
        .collection('data')
        .doc(id)
        .get()
        .then(document => {
          resolve(document.data());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getDocuments(option = {}) {
    console.log('DataManager: DataReader.getDocuments', option);
    return new Promise(resolve => {
      const documents = [];
      let query = database.collection('data');

      if (option.where) {
        option.where.forEach(where => {
          query = query.where(where.key, where.operator, where.value);
        });
      }
      if (option.orderBy) {
        option.orderBy.forEach(orderBy => {
          query = query.orderBy(orderBy.key, orderBy.sort);
        });
      }

      query.get().then(querySnapshot => {
        querySnapshot.forEach(document => {
          const data = document.data();
          data.id = document.id;
          documents.push(data);
        });

        console.log('読み込み数:', documents.length);

        resolve(documents);
      });
    });
  }

  getHomeData() {
    console.log('DataManager: DataReader.getHomeData');
    return new Promise(resolve => {
      const query = database.collection('home').doc('expenditure');

      query.get().then(document => {
        resolve(document.data());
      });
    });
  }
}

export default new DataReader();
