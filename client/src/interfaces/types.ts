export interface product{
    nameProduct: string,
    id: number,
    img: string,
    category:string,
    quantity: number,
    price: number
}
export interface Product{
    nameProduct: string,
    id: number,
    img: string,
    category:string,
    quantity: number,
    price: number
}
export interface User {
    id: number;
    img: string;
    nameAccount: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    status: number;
    cart: any[];
    historyBuy: any[];
    lock: string;
  };
  export interface CartItem {
    idProduct: number;
    quantityBuy: number;
  }
  export interface Account {
    id: number;
    status: number;
    cart: CartItem[];
    historyBuy: any[];
  }
  