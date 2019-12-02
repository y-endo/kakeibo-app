import DataReader from './DataReader/index.js';
import DataRegister from './DataRegister/index.js';
import DataUpdater from './DataUpdater/index.js';

class DataManager {
  constructor() {
    this.reader = DataReader;
    this.register = DataRegister;
    this.updater = DataUpdater;
  }
}

export default new DataManager();
