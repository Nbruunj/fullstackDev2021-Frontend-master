import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {StockModel} from './stock.model';

import {StockDto} from './stock.dto';
import {map} from 'rxjs/operators';
import {SocketStock} from '../../app.module';
import {JoinStockDto} from './Join-stock.dto';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stock: StockModel | undefined;


  constructor(private socket: SocketStock) { }

  sendStock(stock: StockModel): void
  {
    this.socket.emit('stock', stock);
  }

  listenForStocks(): Observable<StockModel[]> {
    return this.socket
      .fromEvent<StockModel[]>("stocks")
  }

  welcomeStocks(): void {
    this.socket.emit("welcomeStock");
  }
  joinStock(dto: JoinStockDto): void {
    this.socket.emit('joinStock', dto);
  }
  /*
  //From frontend to backend with emit
  sendMessage(msg: string){
    this.socket.emit("message", msg);
  }
  sendTyping(typing: boolean): void {
    this.socket.emit('typing', typing);
  }

  // Frontend is listening for backend events
  listenForMessages(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>("newMessage")
  }

  listenForClients(): Observable<ChatClient[]> {
    return this.socket
      .fromEvent<ChatClient[]>("clients")
  }

  listenForWelcome(): Observable<StockDto> {
    return this.socket
      .fromEvent<StockDto>("welcome")
  }

  listenForClientTyping(): Observable<ChatClient> {
    return this.socket
      .fromEvent<ChatClient>("clientTyping")
  }

  listenForError(): Observable<string> {
    return this.socket
      .fromEvent<string>("error");
  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.socket
      .fromEvent<ChatMessage[]>("allMessages")
  }

  sendName(name: string) {
    this.socket.emit("name", name);
  }
*/
  disconnect(): void {
    this.socket.disconnect();
  }

  connect(): void {
    this.socket.connect();
  }

}
