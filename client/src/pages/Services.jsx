import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"

import { fetchServices } from "../features/productSlice";
import CategoryFilter from "../components/CategoryFilter"
import ItemCard from "../components/ItemCard";

function Services () {
    const dispatch = useDispatch()
    const {list, loading} = useSelector(state => state.Services)

    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

    const handleFilter = (id) => dispatch(fetchServices(id))

    return (
        <div>
            <CategoryFilter type="Service" onSelectCategory={handleFilter}/>
            <div className="item-grid">
                {list.map(service => <ItemCard key={service.id} item={service} type={service}/>)}          
            </div>
        </div>
    )
}

export default Services;
