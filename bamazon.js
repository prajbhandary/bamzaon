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
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.table(res)
        //console.log(res[1].product_id)]
        sale()
    })
}

function sale(){
    inquirer.prompt([
        {
        name : "product_id",
        type :"input",
        message : "Please enter the product Id"
        },
        {
        name : "Quantity",
        type : "input",
        message :"Enter Quantity "
        }
    ]).then(function(answer){
       // console.log(answer);
        var product = answer.product_id
        var quantity = answer.Quantity
        var queryStr = "select * from products where product_id = ?"
        connection.query(queryStr,product, function(err,data){
            if (err) throw err;
            console.log("validating Product and quantity ");
            console.log(data.length)
            if(data.length == 0){
                console.log(" Product doesnt Exist!")
                console.log(" ====================================================== ");
                display();
            } else if (data[0].stock_quantity < quantity){
                    console.log ("not enough quanity");
                    console.log(" ====================================================== ");
                    display();
             }else{
            
           // console.log(data[0].stock_quantity);
            update (product,quantity,data[0])
                }
        })
        
        
        
    });

}

function update(product,quantity,array){
    
    var quantity = quantity;
    var cost = (parseInt(array.price)*parseInt(quantity))
    var sales = parseInt(array.product_sales) + parseInt(quantity);
    quantity= parseInt(array.stock_quantity) - parseInt(quantity)
    
   // console.log(quantity)
   
    connection.query("Update products set? where ?",
    [
        {
            stock_quantity : quantity,
            product_sales : sales

        },
        {
            product_id : product
        }
    ],function(error){
        if (error) throw err
        
        console.log("purchase succesfull...")
        console.log ("total cost = : $" + cost )
    })

    connection.end();

}