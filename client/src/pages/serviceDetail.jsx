import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceById, bookAppointment } from "../features/serviceSlice";
import ReviewSection from "../components/ReviewSection"

function ServiceDetail(){
    const {id} = useParams()
    const dispatch = useDispatch()
    const service = useSelector(state => state.services.selectedService);
    const [date, setDate] = useState("")
    useEffect(() => {
        dispatch(fetchServiceById(id))
    }, [id, dispatch])

    const handleBooking =() => {
        dispatch(bookAppointment({
            service_id: service.id,
            appointment_date: date,
            total_price: service.base_price
        }))
    }
    if (!service) return <p>Loading...</p>

    return (
        <div className="detail">
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <h3>Base Price: Ksh. {service.base_price}</h3>
            <input type="datetime-local" onChange={e => setDate(e.target.value)} />
            <ReviewSection serviceId={service.id}/>
            <button onClick={handleBooking}>Confirm Booking</button>
        </div>
    )


}

export default ServiceDetail;