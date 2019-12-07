import { database } from '@/ts/plugins/firebase/index.js';

class DataRegister {
  private isRegistering: boolean;

  constructor() {
    this.isRegistering = false;
  }

  add(data: firebase.firestore.DocumentData): Promise<firebase.firestore.DocumentReference> | undefined {
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

  delete(document: string): Promise<void> | undefined {
    if (this.isRegistering) return;
    this.isRegistering = true;
    console.log('DataManager: DataRegister.delete');
    return new Promise((resolve, reject) => {
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
