import DataReader from './DataReader/index';
import DataRegister from './DataRegister/index';
import DataUpdater from './DataUpdater/index';

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

const dataManager = new DataManager();

export default dataManager;
