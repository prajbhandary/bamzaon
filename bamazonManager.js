var mysql = require ("mysql")
var inquirer = require ("inquirer")


var connection = mysql.createConnection({
    host :"localhost",
    port : 3306,
    user :"root",
    password: "root",
    database : "bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("Welcome to Bamazon!!! : Your Connection id" + connection.threadId);
     display();
   //  connection.end()
});

function display(){
    inquirer.prompt([
        {
        name : "choice",
        type :"list",
        message : "Please Choose one of the Following",
        choices: ['View Product for Sales','View low Inventory','Add to Inventory','Add new Product', 'Exit']
        }
    ]).then(function(answer){
        console.log(answer.choice)
        if (answer.choice == 'View Product for Sales'){
            viewProducts();
        }
        else if (answer.choice == 'View low Inventory'){
            lowInventory();
        }
        else if (answer.choice == 'Add to Inventory'){
            addInventory();
        }
        else if (answer.choice == 'Add new Product'){
           addProduct();
        }
        else if (answer.choice == 'Exit'){
            connection.end();
        }
})
}
// view prodocuts

function viewProducts (){
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.table(res)
        display();
    })
   
}

//low Inventory

function lowInventory (){
    connection.query("SELECT * FROM products where stock_quantity < 6", function(err,res){
        if (err) throw err;
        console.table(res)
        display();
    })
   
}

// adding Inventory

function addInventory (){
    inquirer.prompt([
        {
            name : "productId",
            type : "input",
            message : "Please enter the Product Id",
            validate: function(value){
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name : "inventory",
            type : "input",
            message : "How many more items do you want to add",
            validate: function(value){
                if( isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        var product = answer.productId
        var quantity = answer.inventory
         var querySQL = "SELECT * FROM products where product_id = ?" 
       
       console.log (answer.product_id) 
       connection.query(querySQL,product ,function(err,data){
            if (err) throw err
            if(data.length > 0){
                console.log("updating ....")
                quantity = parseInt(data[0].stock_quantity) + parseInt(quantity)
                console.log(quantity)
                 update (product,quantity)
            } else {
                console.log("Not a valid Product!!")
                console.log(" -------------------------------- ");
                display();
            }
            
        })

    })
    
}

// product addition

function addProduct(){
    inquirer.prompt([
        {
            name : "productName",
            type : "input",
            message : "Please enter the Product Name"
        },
        {
            name : "departmentName",
            type : "input",
            message : "Which department?"
        },
        {
            name : "price",
            type : "input",
            message : "Price of the Product?",
            validate: function(value){
                if( isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name : "stockQuantity",
            type : "input",
            message : "Quantity Available",
            validate: function(value){
                if( isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        console.log("adding ...")
        insert(answer.productName,answer.departmentName,answer.price,answer.stockQuantity);
    })
    
}

function update (product,quantity){
     var product = product
     var quantity = quantity
     var updateQuery = "Update products set ? where ?"    
        connection.query(updateQuery,[
        {
            stock_quantity : quantity
        },
        {
            product_id : product 
        }]
        )
        console.log("Updated!!!")
        console.log(" -------------------------------- ");
        display();
}

function insert(productName,departmentName,price,stockQuantity){
    productName = productName
    departmentName = departmentName
    price = parseInt(price)
       stockQuantity = parseInt(stockQuantity)
    var insertQuery = "Insert into products (product_name,department_name,price,stock_quantity) values ?" 
    var values =[
        [productName,departmentName,price,stockQuantity]
    ]
    connection.query(insertQuery,[values],function(err,res){
        if (err) throw err
        console.log ("added !!!")
        console.log(" -------------------------------- ");
        display();
    })
}