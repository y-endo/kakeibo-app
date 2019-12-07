import EventEmitter from '@/ts/plugins/EventEmitter/index';

export interface StoreState {
  page: string;
  isModalOpen: boolean;
  loginUser: string;
  loginUserName: string;
  isMessageShow: boolean;
  messageText: string;
  messageType: string;
}

export type StoreEvent = {
  state: keyof StoreState;
};

class Store {
  public state: StoreState;

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
    EventEmitter.emit('SET_PAGE', <StoreEvent>{ state: 'page' });
  }

  setIsModalOpen(value: boolean): void {
    this.state.isModalOpen = value;
    EventEmitter.emit('SET_IS_MODAL_OPEN', <StoreEvent>{ state: 'isModalOpen' });
  }

  setLoginUser(value: string): void {
    this.state.loginUser = value;
    EventEmitter.emit('SET_LOGIN_USER', <StoreEvent>{ state: 'loginUser' });
  }

  setLoginUserName(value: string): void {
    this.state.loginUserName = value;
    EventEmitter.emit('SET_LOGIN_USER_NAME', <StoreEvent>{ state: 'loginUserName' });
  }

  setIsMessageShow(value: boolean): void {
    this.state.isMessageShow = value;
    EventEmitter.emit('SET_IS_MESSAGE_SHOW', <StoreEvent>{ state: 'isMessageShow' });
  }

  setMessageType(value: string): void {
    this.state.messageType = value;
    EventEmitter.emit('SET_MESSAGE_TYPE', <StoreEvent>{ state: 'messageType' });
  }

  setMessageText(value: string): void {
    this.state.messageText = value;
    EventEmitter.emit('SET_MESSAGE_TEXT', <StoreEvent>{ state: 'messageText' });
  }
}

const store = new Store();

export { store as default, store as Store };
