import React from "react";

function CategoryCard({ category, onFilter, isActive }) {
    return (
        <button 
            className={`px-5 py-2 rounded-full border transition-all duration-300 font-medium text-sm shadow-sm whitespace-nowrap ${
                isActive 
                ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200" 
                : "bg-white text-blue-600 border-blue-500 hover:bg-blue-50"
            }`} 
            onClick={() => onFilter(category.name === "All" ? "" : category.name)}
        >
            {category.name}
        </button>
    );
}

export default CategoryCard;