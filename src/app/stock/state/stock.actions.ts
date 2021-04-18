import {StockModel} from '../shared/stock.model';


export class ListenForStocks {
  static readonly type = '[Stock] Listen For Stocks';
}

export class StopListeningForStocks {
  static readonly type = '[Stock] Stop Listening For Stocks';
}

export class UpdateStocks {
  constructor(public stocks: StockModel[]) {}

  static readonly type = '[Stock] Update Stocks';
}

export class StocksLoggedIn {
  constructor(public stock: StockModel) {}

  static readonly type = '[Stock] New Stock Logged In';
}

export class LoadStockFromStorage {
  static readonly type = '[Stock] Load Stock From Storage';
}
