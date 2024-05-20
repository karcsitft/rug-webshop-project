export interface Order{
    id?: string;
    products: Array<Object>;
    state: string;
    userid: string;
    totalprice: number;
}