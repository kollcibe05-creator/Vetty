import React, {useEffect, useState} from "react";
import CategoryCard from "./CategoryCard"

function CategoryFilter ({category_type, onSelectedCategory}) {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch("/categories")
        .then(r => r.json())
        .then(data => {
            const filtered = data.filter(category => category.category_type.toLowerCase() === category_type.toLowerCase())
            setCategories(filtered)
        })
    }, [category_type])

    return (
    <div className="filter-bar">
        <button onClick={() => onSelectedCategory(null)}>All</button>
        {categories.map( category => (<CategoryCard key={category.id} category={category_type} onFilter={onSelectedCategory} />))}

    </div>
    )
}