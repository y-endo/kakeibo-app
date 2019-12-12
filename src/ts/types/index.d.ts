// DataReader（firestore）のwhereクエリ
export type Where = {
  key: string | firebase.firestore.FieldPath;
  operator: firebase.firestore.WhereFilterOp;
  value: string;
};

// DataReader（firestore）のorderbyクエリ
export type OrderBy = {
  key: string | firebase.firestore.FieldPath;
  sort: firebase.firestore.OrderByDirection;
};

// DataReader.getDocuments（firestore）の引数
export type GetDocumentsOption = {
  where?: Where[];
  orderBy?: OrderBy[];
};

// DataReader.getDocumentで取得したデータに対するフィルター
export type DocumentsFilter = {
  minMoney?: number;
  maxMoney?: number;
  category?: string[];
  subCategory?: string[];
  payment?: string[];
  memo?: string;
  user?: string;
};

export type Query = {
  where: Where[];
  orderBy: OrderBy[];
};

export type SearchQuery = {
  query: Query;
  filter: DocumentsFilter;
};

// Store.stateの型
export type StoreStateType = {
  page: string;
  isModalOpen: boolean;
  loginUser: string;
  loginUserName: string;
  isMessageShow: boolean;
  messageText: string;
  messageType: string;
};

// StoreがEmitするイベントの型
export type StoreEventType = {
  state: keyof StoreStateType;
};

// Storeクラスのインターフェース
export interface StoreInterface {
  state: {
    [P in keyof StoreStateType]: StoreStateType[P];
  };
}
