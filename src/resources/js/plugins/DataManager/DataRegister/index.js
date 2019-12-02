import { database } from '@/js/plugins/firebase/index.js';

class DataRegister {
  constructor() {
    this.isRegistering = false;
  }

  add(data) {
    if (this.isRegistering) return;
    this.isRegistering = true;
    console.log('DataManager: DataRegister.add');
    return new Promise((resolve, reject) => {
      database
        .collection('data')
        .add(data)
        .then(result => {
          this.isRegistering = false;
          resolve(result);
        })
        .catch(error => {
          this.isRegistering = false;
          reject(error);
        });
    });
  }

  delete(document) {
    if (this.isRegistering) return;
    this.isRegistering = true;
    console.log('DataManager: DataRegister.delete');
    return new Promise((resolve, reject) => {
      database
        .collection('data')
        .doc(document)
        .delete()
        .then(result => {
          this.isRegistering = false;
          resolve(result);
        })
        .catch(error => {
          this.isRegistering = false;
          reject(error);
        });
    });
  }
}

export default new DataRegister();
