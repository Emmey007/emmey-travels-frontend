import { useNavigate } from 'react-router-dom'

export const BookNowButton = ({ destination }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/booking', { state: { destination } })
    }

    return (
        <button className="book-now-btn" onClick={handleClick}>
            Book Now
        </button>
    )
}