import { StoreEventType, StoreInterface } from 'type/index';
import EventEmitter from '@/ts/plugins/EventEmitter/index';

class Store implements StoreInterface {
  public state: StoreInterface['state'];

  constructor() {
    this.state = {
      page: '',
      isModalOpen: false,
      loginUser: '',
      loginUserName: '',
      isMessageShow: false,
      messageText: '',
      messageType: ''
    };
  }

  initialize(): void {
    this.state.page = 'home';
  }

  setPage(value: string): void {
    this.state.page = value;
    EventEmitter.emit('SET_PAGE', { state: 'page' } as StoreEventType);
  }

  setIsModalOpen(value: boolean): void {
    this.state.isModalOpen = value;
    EventEmitter.emit('SET_IS_MODAL_OPEN', { state: 'isModalOpen' } as StoreEventType);
  }

  setLoginUser(value: string): void {
    this.state.loginUser = value;
    EventEmitter.emit('SET_LOGIN_USER', { state: 'loginUser' } as StoreEventType);
  }

  setLoginUserName(value: string): void {
    this.state.loginUserName = value;
    EventEmitter.emit('SET_LOGIN_USER_NAME', { state: 'loginUserName' } as StoreEventType);
  }

  setIsMessageShow(value: boolean): void {
    this.state.isMessageShow = value;
    EventEmitter.emit('SET_IS_MESSAGE_SHOW', { state: 'isMessageShow' } as StoreEventType);
  }

  setMessageType(value: string): void {
    this.state.messageType = value;
    EventEmitter.emit('SET_MESSAGE_TYPE', { state: 'messageType' } as StoreEventType);
  }

  setMessageText(value: string): void {
    this.state.messageText = value;
    EventEmitter.emit('SET_MESSAGE_TEXT', { state: 'messageText' } as StoreEventType);
  }
}

const store = new Store();

export { store as default, store as Store };
