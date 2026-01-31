import React from "react"
import Link from "react-router-dom"

function ItemCard({item, type}){
    const path = type === "Product" ? `/products/${item.id}`: `/services/${item.id}`
    
    return (
        
        <div className="card">
            <Link to={path}>
            <img src={item.image_url} alt={item.name}/>
            <div className="card-info">
            <h3>{item.name}</h3>
            <p>{item.description ? item.description.slice(0, 70) + "...": "No description"}</p>
            <p>{type === "Product" ? `<strong>Ksh. $${item.price}</strong>`: `Starts at <strong>Ksh. ${item.base_price}</strong>`}</p>
            <button>View Details</button>
            </div>
            </Link> 
        </div>
    )
}

export default ItemCard;