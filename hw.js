
  ///////////////////////////////////////
 ////////  Data Initialization  ////////
///////////////////////////////////////

//| Cart actions enum (so I don't have to type out those strings, and can easily change their value if needed)
const CartActions = {
    add: "add_to_cart",
    delete: "remove_from_cart",
    deleteAllOf: "remove_all_from_cart",
    empty: "empty_cart"
}

// The cart function that does cart things
const cart = (
    action="add_to_cart",
    item={ id: 0 },
    cart=[]
)=>{
    switch (action) {
        case CartActions.add:
            return [ item, ...cart ];
            
        case CartActions.delete:
            let found = false;
            return cart.filter(v => found || !(v.id == item.id && (found = true)))
            
        case CartActions.deleteAllOf:
            return cart.filter(v => v.id != item.id)
            
        case CartActions.empty:
            return [];
    
        default:
            console.error(`"${action}" is not a valid action!`);
            return null;
    }
}

  ///////////////////////////////////
 ////////  Testing My Code  ////////
///////////////////////////////////

// Making my cart
let myCart = cart(CartActions.add, { id: 1 });

//| Adding to cart!
myCart = cart(CartActions.add, { id: 1 }, myCart);
console.log(myCart); //>> [ { id: 1 }, { id: 1 } ]

//| Deleteing all matching items from cart
myCart = cart(CartActions.deleteAllOf, { id: 1 }, myCart);
console.log(myCart); //>> []

//| Adding more items
myCart = cart(CartActions.add, { id: 2 }, myCart);
myCart = cart(CartActions.add, { id: 2 }, myCart);
myCart = cart(CartActions.add, { id: 2 }, myCart);
console.log(myCart); //>> [ { id: 2 }, { id: 2 }, { id: 2 } ]


//| Showing cart function performs "out of place" operations
cart(CartActions.add, { id: 2 }, myCart);
console.log(myCart); //>> [ { id: 2 }, { id: 2 }, { id: 2 } ]

//| Emptying cart
myCart = cart(CartActions.empty, {}, myCart);
console.log(myCart); //>> []

//| Giving bad action
myCart = cart("some else", {}, myCart);
console.log(myCart); //>> null