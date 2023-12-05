export interface Provider {
    name: string;
    unitOfWholesale: string;
    priceOfWholesale: number
}

export class Product {
    constructor(
        public name: string, 
        public unitOfRetail: string, 
        public priceOfRetail: number, 
        public imagePath?: string, 
        public providers?: Provider[], 
        public id?: string
    ) {}
}