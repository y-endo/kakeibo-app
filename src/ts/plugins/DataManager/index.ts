import DataReader from './DataReader/index.js';
import DataRegister from './DataRegister/index.js';
import DataUpdater from './DataUpdater/index.js';

class DataManager {
  public reader: DataReader;
  public register: DataRegister;
  public updater: DataUpdater;

  constructor() {
    this.reader = new DataReader();
    this.register = new DataRegister();
    this.updater = new DataUpdater();
  }
}

export default new DataManager();
