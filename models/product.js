// Importing the "fs" module in the file to get access to the file storage (Read/Write) functionality into the files.
const fs = require('fs');

// Importing the "path" package to build dynamic paths useful to access them in the application.
const path = require('path');

module.exports = class Product{
    constructor(prodTitle){
        this.title = prodTitle;
    }

    // This is the method to save the product information into a file by using the "fs" package.
    save(){
        // Before reading the file we have to get the access to the file which is the path of the file to perform read/write actions.
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
        // In order to save the data to a file first the file is to be created and checked if any information is present in that file.
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if(!err){
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }
    // This is the method to fetch all the product information.
    // This method is made static so that none of the inherited classes from this class have access to modify this method.
    static fetchAll(cb){
        // In order to fetch from a file we have to get the access to the file by pointing to the directory using path;
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
        fs.readFile(p, (err, fileContent) => {
            if(err){
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
}
