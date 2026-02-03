import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductById } from "../features/productSlice";
import ReviewSection from "../components/ReviewSection"

function ProductDetail () {
    const {id} = useParams()
    const dispatch = useDispatch()
    const product = useSelector(state => state.products.selectedProduct);

    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [id, dispatch])
    if (!product) return <p>Loading...</p>

    return (
        <div className="detail">
            <img src={product.image_url} alt={product.name} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h2>Price: {product.price}</h2>
            <p>In Stock: {product.stock_quantity}</p>
            <button disabled={product.stock_quantity <= 0}>Add to Cart</button>
            <ReviewSection productId={product.id}/>
        </div>
    )

}
export default ProductDetail;