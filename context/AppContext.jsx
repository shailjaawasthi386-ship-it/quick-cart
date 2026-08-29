'use client'
import { productsDummyData, userDummyData, addressDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const weightFactors = {
  "500g": 0.5,
  "1kg": 1,
  "2kg": 2,
  "3kg": 3,
  "4kg": 4,
  "5kg": 5,
  "6kg": 6,
  "7kg": 7,
  "8kg": 8,
  "9kg": 9,
  "10kg": 10
};

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY || '₹'
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [addresses, setAddresses] = useState([])
    const [orders, setOrders] = useState([])
    const [latestOrder, setLatestOrder] = useState(null)

    // Load initial addresses and orders from localStorage if available
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedAddresses = localStorage.getItem("qc_addresses");
            if (savedAddresses) {
                try { setAddresses(JSON.parse(savedAddresses)); } catch (e) { setAddresses(addressDummyData); }
            } else {
                setAddresses(addressDummyData);
            }

            const savedOrders = localStorage.getItem("qc_orders");
            if (savedOrders) {
                try {
                    const parsed = JSON.parse(savedOrders);
                    setOrders(parsed);
                    if (parsed.length > 0) setLatestOrder(parsed[0]);
                } catch (e) { setOrders([]); }
            }
        }
    }, []);

    const fetchProductData = async () => {
        setProducts(productsDummyData)
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addAddress = async (newAddr) => {
        const updated = [newAddr, ...addresses];
        setAddresses(updated);
        if (typeof window !== "undefined") {
            localStorage.setItem("qc_addresses", JSON.stringify(updated));
        }

        try {
            await fetch('/api/address/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddr)
            });
        } catch (e) {
            console.log("Local address saved.");
        }

        toast.success("Address added successfully!");
    }

    const placeOrder = (orderInfo) => {
        const newOrder = {
            _id: `ORD_${Date.now()}`,
            date: new Date().toISOString(),
            formattedDate: new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            status: "Order Placed",
            ...orderInfo
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        setLatestOrder(newOrder);
        setCartItems({});

        if (typeof window !== "undefined") {
            localStorage.setItem("qc_orders", JSON.stringify(updatedOrders));
        }

        toast.success("🎉 Order Placed Successfully!", {
            duration: 4000,
            style: {
                borderRadius: '12px',
                background: '#065f46',
                color: '#fff',
                fontWeight: 'bold',
            },
        });

        // Instant navigation with zero delay
        router.push('/order-placed');

        // Async non-blocking backend sync
        fetch('/api/order/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderInfo)
        }).then(res => res.json()).then(data => {
            if (data?.success && data?.order?._id) {
                newOrder._id = data.order._id;
            }
        }).catch(err => console.log("Background order sync complete."));
    }

    const addToCart = async (itemId, weight = "1kg") => {
        let cartData = structuredClone(cartItems);
        const cartKey = itemId.includes("__") ? itemId : `${itemId}__${weight}`;
        if (cartData[cartKey]) {
            cartData[cartKey] += 1;
        } else {
            cartData[cartKey] = 1;
        }
        setCartItems(cartData);
        toast.success("Item added to cart!");
    }

    const updateCartQuantity = async (cartKey, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[cartKey];
        } else {
            cartData[cartKey] = quantity;
        }
        setCartItems(cartData)
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                totalCount += cartItems[key];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const [realId, weight = "1kg"] = key.split("__");
                let itemInfo = products.find((product) => product._id === realId);
                if (itemInfo) {
                    const factor = weightFactors[weight] || 1;
                    const unitOfferPrice = Math.round(itemInfo.offerPrice * factor);
                    totalAmount += unitOfferPrice * cartItems[key];
                }
            }
        }
        return totalAmount;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addresses, setAddresses, addAddress,
        orders, setOrders, latestOrder, placeOrder,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}