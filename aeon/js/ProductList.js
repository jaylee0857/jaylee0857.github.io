        var addcart = document.querySelectorAll('.add-cart')
        // var addcart_mo = document.querySelectorAll('.add-cart-mo')
        var product = document.querySelectorAll('.product-card')


        for (let index = 0; index < addcart.length; index++) {
            const addcarts = addcart[index];
            // const addcarts_mo = addcart_mo[index];
            const products = product[index];

            addcarts.onclick = function () {
                checkStatus()
            }

            // addcarts_mo.onclick = function () {
            //     checkStatus()
            // }

            function checkStatus() {
                products.classList.toggle('active')
                if (products.classList.contains('active')) {
                    addcarts.style.backgroundColor = '#D1D1D1'
                    addcarts.style.color = '#BE1518'
                    addcarts.innerHTML = '<div><span style="font-weight: 900; margin-right: 10px">x</span>Cancel Inquiry</div>'
                    // addcarts_mo.style.backgroundColor = '#D1D1D1'
                    // addcarts_mo.innerHTML = '<div><span style="color:red">x</span></div>'

                } else {
                    addcarts.style.backgroundColor = '#848484'
                    addcarts.style.color = '#fff'
                    addcarts.innerHTML = '<div><span style="font-weight: 900; margin-right: 10px">+</span>Inquiry Cart</div>'
                    // addcarts_mo.style.backgroundColor = '#848484'
                    // addcarts_mo.innerHTML = '<div><img src="/img/Product/cartbtn.png" alt="cart-btn Icon"></div>'
                }
            }
        }
