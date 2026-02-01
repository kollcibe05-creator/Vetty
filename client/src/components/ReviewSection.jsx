import { useEffect, useState } from "react";

function ReviewSection({productId=null, serviceId = null}) {
    const [reviews, setReviews] = useState([])
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(5)

    useEffect(() => {
        const queryParam = productId? `product_id=${productId}`: `service_id=${serviceId}`
        fetch(`/reviews?${queryParam}`)
        .then(r => {
            if (!r.ok) throw new Error("Could not load reviews.")
            return r.json()    
        })
        .then(data => setReviews(data))
        .catch(error => console.error(error))
    }, [productId, serviceId])


    const handleSubmit = (e) => {
        e.preventDefault();
        const newReview = {
            comment, 
            rating,
            productId: productId,
            serviceId: serviceId,
            user_id: 1  /*to be provided in authSlice/user state*/
        }

        fetch('/reviews', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newReview)
        })
        .then(r => r.json())
        .then(savedReview => {
            setReviews([...reviews, savedReview])
            setComment("")
        })
        .catch(err => alert(err.message))
        
    }
 
        


    return (
        <div>
        <div>
            <h3>Customer Reviews</h3>
            <div>
                {reviews.length > 0 ? reviews.map(r => {
                    <div key={r.id}>
                        <strong>{rev.user_id.username}</strong> /*issue*/ 
                        <strong>Rating: {r.rating}</strong>
                        <p>{rev.comment}</p>
                    </div> 
                }): <p>No reviews yet. Be the first!</p>}
            </div>
        </div>    
        <form onSubmit={handleSubmit}>
            <h4>Leave a Review</h4>
            <select value={rating} onChange={e => setRating(e.target.value)}>
                {[5,4,3,2,1].map(num => <option key={num} value={num} Stars></option>)}

            </select>
            <textarea 
            placeholder="Share your thoughts..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            
            
            />
            <button type="submit">Submit Review</button>
        </form>
    </div>    
    )
}

export default ReviewSection