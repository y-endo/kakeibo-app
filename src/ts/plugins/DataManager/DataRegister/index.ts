import { database } from '@/ts/plugins/firebase/index.js';

class DataRegister {
  private isRegistering: boolean;

  constructor() {
    this.isRegistering = false;
  }

  add(data: firebase.firestore.DocumentData): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      if (this.isRegistering) {
        resolve();
        return;
      }
      this.isRegistering = true;
      console.log('DataManager: DataRegister.add');

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

  delete(document: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isRegistering) {
        resolve();
        return;
      }
      this.isRegistering = true;
      console.log('DataManager: DataRegister.delete');

      database
        .collection('data')
        .doc(document)
        .delete()
        .then(() => {
          this.isRegistering = false;
          resolve();
        })
        .catch(error => {
          this.isRegistering = false;
          reject(error);
        });
    });
  }
}

export default DataRegister;
