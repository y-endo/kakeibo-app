import EventEmitter from '@/js/plugins/EventEmitter/index.js';

class Store {
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

  initialize() {
    this.state.page = 'home';
  }

  setPage(value) {
    this.state.page = value;
    EventEmitter.emit('SET_PAGE', { state: 'page' });
  }

  setIsModalOpen(value) {
    this.state.isModalOpen = value;
    EventEmitter.emit('SET_IS_MODAL_OPEN', { state: 'isModalOpen' });
  }

  setLoginUser(value) {
    this.state.loginUser = value;
    EventEmitter.emit('SET_LOGIN_USER', { state: 'loginUser' });
  }

  setLoginUserName(value) {
    this.state.loginUserName = value;
    EventEmitter.emit('SET_LOGIN_USER_NAME', { state: 'loginUserName' });
  }

  setIsMessageShow(value) {
    this.state.isMessageShow = value;
    EventEmitter.emit('SET_IS_MESSAGE_SHOW', { state: 'isMessageShow' });
  }

  setMessageType(value) {
    this.state.messageType = value;
    EventEmitter.emit('SET_MESSAGE_TYPE', { state: 'messageType' });
  }

  setMessageText(value) {
    this.state.messageText = value;
    EventEmitter.emit('SET_MESSAGE_TEXT', { state: 'messageText' });
  }
}

export default new Store();
