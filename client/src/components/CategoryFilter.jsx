import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CategoryFilter({ category_type, onSelectedCategory, activeCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5555/categories")
            .then(r => r.json())
            .then(data => {
                // Filter categories based on the type (Service vs Product)
                const filtered = data.filter(cat => 
                    cat.category_type.toLowerCase() === category_type.toLowerCase()
                );
                setCategories(filtered);
            })
            .catch(err => console.error("Error fetching categories:", err));
    }, [category_type]);

    const buttonClass = (isActive) => `
        px-5 py-2 rounded-full border transition-all duration-300 font-medium text-sm shadow-sm whitespace-nowrap
        ${isActive 
            ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200" 
            : "bg-white text-blue-600 border-blue-500 hover:bg-blue-50"
        }
    `;

    return (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {/* The "All" Button */}
            <button
                onClick={() => onSelectedCategory("")}
                className={buttonClass(activeCategory === "")}
            >
                All
            </button>

            {/* Dynamic Buttons from Seed/DB */}
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectedCategory(cat.name)}
                    className={buttonClass(activeCategory === cat.name)}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;