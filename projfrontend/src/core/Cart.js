import React, { useState, useEffect } from 'react'
import "../styles.css"
import { API } from '../backend';
import Base from './Base';
import Card from './Card';
import { getProducts } from './helper/coreapicalls';
import { loadCart } from './helper/CartHelper';
import Payment from './Payment';



const Cart = () => {

    const [products, setProducts] = useState([])

    const [reload, setReload] = useState(false)//using it instead of a method kinda like a psuedo method to reload the stuff

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])

    const loadAllProducts = () => {
        return (
            <div>
                <h2>Product Section</h2>
                {products.map((product, index) => (
                    <Card
                        key={index}
                        product={product}
                        addtoCart={false}
                        removeFromCart={true}
                        setReload={setReload}
                        reload={reload}
                    />
                ))}
            </div>
        )
    }
    const loadCheckout = (products) => {
        return (
            <div>
                <h2>Checkout Section</h2>
            </div>
        )
    }


    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">{products.length > 0 ? loadAllProducts() : (
                    <h3>NO products in cart</h3>
                )}</div>
                <div className="col-6"><Payment products={products} setReload={setReload} /></div>
            </div>
        </Base>
    )
}

export default Cart
