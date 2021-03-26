import {StockModel} from './stock.model';


export interface StockDto {
  stocks: StockModel[];
  stock: StockModel;
}
