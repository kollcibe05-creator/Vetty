import React from "react"

function CategoryCard({category, onFilter}){
    return (
        <div className="category-card" onClick={() => onFilter(category.id)}>
            <h3>{category.name}</h3>
            <p>{category.category_type}</p>
            
        </div>
    )
}

export default CategoryCard;