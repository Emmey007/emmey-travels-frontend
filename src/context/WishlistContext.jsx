import { createContext, useContext, useState, useEffect } from 'react'
import { privateInstance } from '../api/axios'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth()
    const [wishlist, setWishlist] = useState([])
    const [wishlistIds, setWishlistIds] = useState([])

    useEffect(() => {
        if (user) fetchWishlist()
        else {
            setWishlist([])
            setWishlistIds([])
        }
    }, [user])

    const fetchWishlist = async () => {
        try {
            const res = await privateInstance.get('/wishlist')
            const items = res.data.wishlist || []
            setWishlist(items)
            setWishlistIds(items.map(item => item.listing?._id))
        } catch (err) {
            console.log('Could not fetch wishlist')
        }
    }

    const addToWishlist = async (listingId) => {
        try {
            await privateInstance.post('/wishlist', { listingId })
            setWishlistIds(prev => [...prev, listingId])
            fetchWishlist()
        } catch (err) {
            console.log('Could not add to wishlist')
        }
    }

    const removeFromWishlist = async (listingId) => {
        try {
            await privateInstance.delete(`/wishlist/${listingId}`)
            setWishlistIds(prev => prev.filter(id => id !== listingId))
            setWishlist(prev => prev.filter(item => item.listing?._id !== listingId))
        } catch (err) {
            console.log('Could not remove from wishlist')
        }
    }

    const isWishlisted = (listingId) => wishlistIds.includes(listingId)

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, addToWishlist, removeFromWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => useContext(WishlistContext)