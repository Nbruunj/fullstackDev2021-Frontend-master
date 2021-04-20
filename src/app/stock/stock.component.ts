import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';

import {Observable, Subject, Subscription} from 'rxjs';

import {StockService} from './shared/stock.service';
import {StockModel} from './shared/stock.model';
import {ChatClient} from '../chat/shared/chat-client.model';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {StockState} from './state/stock.state';
import {ListenForStocks} from './state/stock.actions';


@Component({
  selector: 'app-chat',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit, OnDestroy {
  @Select(StockState.stocks) stockClients$: Observable<StockModel[]> | undefined;
  stockfc = this.fb.group({
    stockName: [''],
    initValue: [''],
    description: [''],
    currentValue: [''],
  });
  valueFC = this.fb.group({
    value: ['']
  });

  nameFC = new FormControl('');
  unsubscribe$ = new Subject();
  stockCreate: StockModel | undefined;
  error: string | undefined;
  stocks$: Observable<StockModel[]> | undefined;
  selectedStock: StockModel | undefined;

  constructor(private fb: FormBuilder, private stockService: StockService, private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ListenForStocks());

    this.stocks$ = this.stockService.listenForStocks();
    this.stockService.welcomeStocks();
  }

  sendMessage(): void {
    console.log(this.stockfc.value);
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelect(stock: StockModel): void {
    this.selectedStock = stock;
  }

  sendStock(): void {
    if (this.stockfc.value) {
      this.stockService.sendStock(this.stockfc.value);
      console.log(this.stockfc.value)
    }
  }
    updateStock(): void {
      if(this.selectedStock)
    {
      this.stockService.updateStock(this.selectedStock.id,
        {
          id: this.selectedStock.id,
          currentValue: this.valueFC.value.value,
          description: this.selectedStock.description,
          initValue: this.selectedStock.initValue,
          stockName: this.selectedStock.stockName
        });
    }
  }
  }

