#!/usr/bin/env python3
"""
Smart Image URL Generator for Vetty Products
Maps product names to relevant Unsplash images based on keywords
"""

def get_smart_image_url(product_name, category_name=None):
    """
    Generate relevant image URL based on product name and category keywords
    """
    name_lower = product_name.lower()
    category_lower = category_name.lower() if category_name else ""
    
    # Dog food images
    if any(keyword in name_lower for keyword in ['dog food', 'puppy', 'adult dog']):
        return 'https://images.unsplash.com/photo-1605218427306-027582b13e9a?auto=format&fit=crop&q=80&w=600'
    
    # Cat food images  
    if any(keyword in name_lower for keyword in ['cat food', 'kitten', 'feline']):
        return 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=600'
    
    # Leash and collar images
    if any(keyword in name_lower for keyword in ['leash', 'collar', 'harness']):
        return 'https://images.unsplash.com/photo-1606984282382-57e2bfe56a47?auto=format&fit=crop&q=80&w=600'
    
    # Medicine and health images
    if any(keyword in name_lower for keyword in ['medicine', 'flea', 'tick', 'vitamin', 'supplement']):
        return 'https://images.unsplash.com/photo-1606195741688-c3c503705d5c?auto=format&fit=crop&q=80&w=600'
    
    # Toy images
    if any(keyword in name_lower for keyword in ['toy', 'ball', 'puzzle', 'chew']):
        return 'https://images.unsplash.com/photo-1606350980771-6e2b6c8c9a?auto=format&fit=crop&q=80&w=600'
    
    # Grooming images
    if any(keyword in name_lower for keyword in ['grooming', 'brush', 'scissors', 'kit', 'shampoo']):
        return 'https://images.unsplash.com/photo-1516734214044-2e5a8b0b5b3c?auto=format&fit=crop&q=80&w=600'
    
    # Carrier and travel images
    if any(keyword in name_lower for keyword in ['carrier', 'crate', 'travel', 'bed']):
        return 'https://images.unsplash.com/photo-1583337435048-2de5dc1a0a2b?auto=format&fit=crop&q=80&w=600'
    
    # Cat specific images
    if any(keyword in name_lower for keyword in ['cat', 'kitten', 'feline', 'scratching']):
        return 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=600'
    
    # Default pet image
    return 'https://images.unsplash.com/photo-1601758225944-4c85d5d25b7c?auto=format&fit=crop&q=80&w=600'

def update_product_images(products):
    """
    Update a list of products with smart image URLs
    """
    for product in products:
        if hasattr(product, 'name') and hasattr(product, 'category'):
            product.image_url = get_smart_image_url(product.name, product.category.name if product.category else None)
        elif isinstance(product, dict):
            product['image_url'] = get_smart_image_url(
                product.get('name', ''), 
                product.get('category_name', '') or (product.get('category', {}).name if isinstance(product.get('category'), dict) else '')
            )
    
    return products
