import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';

import {Observable, Subject, Subscription} from 'rxjs';

import {StockService} from './shared/stock.service';
import {StockModel} from './shared/stock.model';
import {ChatClient} from '../chat/shared/chat-client.model';
import {debounceTime, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-chat',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit, OnDestroy {
  stockfc = this.fb.group({
    stockName: [''],
    initValue: [''],
    description: [''],
    currentValue: [''],
  });
  nameFC = new FormControl('');
  unsubscribe$ = new Subject();
  stockCreate: StockModel | undefined;
  error: string | undefined;
  stocks$: Observable<StockModel[]> | undefined;
  constructor(private fb: FormBuilder, private stockService: StockService) { }

  ngOnInit(): void {

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

  sendStock(): void {
    if (this.stockfc.value)
    {
      this.stockService.sendStock(this.stockfc.value);
      console.log(this.stockfc.value)
    }
  }
}
