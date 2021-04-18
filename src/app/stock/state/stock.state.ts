import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';

import {Subscription} from 'rxjs';
import {StockModel} from '../shared/stock.model';
import {StockService} from '../shared/stock.service';
import {ListenForStocks, LoadStockFromStorage, StocksLoggedIn, StopListeningForStocks, UpdateStocks} from './stock.actions';


export interface StockStateModel {
  Stocks: StockModel[];
  RelevantStock: StockModel | undefined;
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    Stocks: [],
    RelevantStock: undefined,
  }
})
@Injectable()
export class StockState {
  private stocksUnsub: Subscription | undefined;

  constructor(private stockService: StockService) {
  }

  @Selector()
  static relevantStock(state: StockStateModel): StockModel |undefined {
    return state.RelevantStock;
  }

  @Selector()
  static stocks(state: StockStateModel): StockModel[] {
    return state.Stocks;
  }

  @Selector()
  static stockIds(state: StockStateModel): string[] {
    return state.Stocks.map(c => c.id);
  }

  /*@Selector()
  static clientsOnline(state: ChatStateModel): number {
    return state.chatClients.length;
  }*/

  @Action(ListenForStocks)
  getStocks(ctx: StateContext<StockStateModel>): void {
    // Old state Object...
    // {
    //     chatClients: [
    //       //    {id: '33', nickname: 'bob'},
    //       //    {id: '22', nickname: 'dd'}
    //     //    ],
    //     chatClient: {id: '2', nickname: 'd'}
    //   }
    this.stocksUnsub = this.stockService.listenForStocks()
      .subscribe(stocks => {
        ctx.dispatch(new UpdateStocks(stocks));
      });
  }

  @Action(StopListeningForStocks)
  stopListeningForStock(ctx: StateContext<StockStateModel>): void {
    if (this.stocksUnsub) {
      this.stocksUnsub.unsubscribe();
    }
  }

  @Action(UpdateStocks)
  UpdateStocks(ctx: StateContext<StockStateModel>, uc: UpdateStocks): void {
    // Old state Object...
    // {
    //     chatClients: [
    //       //    {id: '33', nickname: 'bob'},
    //       //    {id: '22', nickname: 'dd'}
    //     //    ],
    //     chatClient: {id: '2', nickname: 'd'}
    //   }
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      Stocks: uc.stocks
    };
    ctx.setState(newState);
  }

  @Action(StocksLoggedIn)
  StockLoggedIn(ctx: StateContext<StockStateModel>, stockLoggedInAction: StocksLoggedIn): void {
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      RelevantStock: stockLoggedInAction.stock
    };
    ctx.setState(newState);
  }

  @Action(LoadStockFromStorage)
  loadStockFromStorage(ctx: StateContext<StockStateModel>): void {
    const state = ctx.getState();
    const stock = state.RelevantStock;
    if (stock) {
      this.stockService.joinStock({
        id: stock.id,
        stockName: stock.stockName,
        currValue: stock.currentValue,
        initValue: stock.initValue,
        description: stock.description
      });
    }
  }
}
