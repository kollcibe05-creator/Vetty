import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"

import { fetchProducts } from "../features/productSlice";
import CategoryFilter from "../components/CategoryFilter"
import ItemCard from "../components/ItemCard";

function Products () {
    const dispatch = useDispatch()
    const {items, loading} = useSelector(state => state.Products)

    useEffect (() => {
        dispatch(fetchProducts())
    }, [dispatch])

    const handleFilter = (id) => dispatch(fetchProducts(id))
    return (
        <div >
            <CategoryFilter type="Product" onSelectedCategory={handleFilter}/>
            {loading ? <p>Loading Products...</p> : (
                <div className="item-grid">
                    {items.map(product => <ItemCard key={product.id} item={product} type="product"/>)}
                </div>    
            )}
        </div>
    )
}

export default Products;