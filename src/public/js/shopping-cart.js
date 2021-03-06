function buyProduct(id, name, discountedPrice){
    // const product = JSON.parse(productJson);
    console.log(id, name, discountedPrice);

}

function addToShoppingCart(id, name, discountedPrice){
    let shoppingCart = localStorage.getItem('cart');

    shoppingCart = shoppingCart == null ? [] : JSON.parse(shoppingCart);
    let product = { id, name, 
        price: discountedPrice, 
        // amount: 1 
    };
    let productExists = shoppingCart.some(cartProduct => product.id == cartProduct.id);
    // if(productExists){
    //     shoppingCart = shoppingCart.map(cartProduct => {
    //         if(cartProduct.id == product.id){
    //             cartProduct.amount++;
    //         }
    //         return cartProduct;
    //     })
    // } else{
    //     shoppingCart.push(product);
    // }
    !productExists ? shoppingCart.push(product) : null;

    localStorage.setItem('cart', JSON.stringify(shoppingCart))

    modifyCartView();


}

function modifyCartView(){
    let cartMenu = document.querySelector('#cartMenu');
    let shoppingCart = localStorage.getItem('cart');
    shoppingCart = shoppingCart == null ? [] : JSON.parse(shoppingCart);
    let productList = '';
    let total = 0;
    let productIds = '';
    shoppingCart.forEach(product => {
        productList += `
        <div class="d-flex justify-content-between">
            <span>${product.name}</span>
            <span>$${product.price}</span>
        </div>
        <hr/>`;
        total += +product.price;
        productIds += product.id + ',' 

    });

    let cartData = `${ productList }
    <div class="d-flex justify-content-end">TOTAL: $${total}</div>
    <div class="d-flex justify-content-end">
    <form action="/order/checkout" method="POST">
        <input type="hidden" name="productIds" value="${productIds}" /> 
        <button type="submit" class="btn btn-info">Ir al checkout</button>
    </form>
    </div>`;

    let cartCode = `
    <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <i class="fas fa-cart-arrow-down"></i>
    Carrito <span class="badge badge-info">${shoppingCart.length} items</span>
    </a>
    <div class="dropdown-menu p-3" style="min-width: 500px" aria-labelledby="navbarDropdownMenuLink">
        ${shoppingCart.length ? cartData : 'Carrito vacío'}
    </div>`;
    cartMenu.innerHTML = cartCode;
}

modifyCartView();

const checkoutForm = document.querySelector("#checkoutForm");

checkoutForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    processPay()
})

function processPay(){
    console.log(checkoutForm.total.value);
    // fetch(location.origin + '/order/pay',  {
    //     method: 'post',
    //     body: JSON.stringify(opts)
    //   })

}