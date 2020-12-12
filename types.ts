export interface Response {
  statusCode: number;
  body: string;
  headers: {
    "Access-Control-Allow-Origin": string,
    "Access-Control-Allow-Credentials": boolean
  };
}

export interface Cake {
  id: number,
  name: string,
  comment: string,
  imageUrl: string,
  yumFactor: number
}
