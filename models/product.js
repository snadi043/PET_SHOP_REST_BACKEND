const product = [];

module.exports = class Product{
    constructor(prodTitle){
        this.title = prodTitle;
    }

    // This is the method to save the product information.
    save(){
        product.push(this);
    }

    // This is the method to fetch all the product information.
    // This method is made static so that none of the inherited classes from this class have access to modify this method.
    static fetchAll(){
        return product;
    }
}