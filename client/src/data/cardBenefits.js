// Structured card benefits data for Gullak AI recommendation engine
// Each card has parseable benefits that can be calculated

export const cardBenefits = [
    {
        id: 1,
        name: "HDFC Millennia",
        bank: "HDFC Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "online_shopping",
                merchants: ["amazon.in", "flipkart.com", "myntra.com"],
                rate: 0.05, // 5%
                cap_per_month: 1000, // ₹1,000 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            },
            {
                type: "discount",
                category: "dining",
                merchants: ["swiggy.com", "zomato.com"],
                rate: 0.20, // 20% discount
                cap_per_transaction: null,
                cap_per_month: null,
                days: ["Thu", "Fri", "Sat", "Sun"] // Only on these days
            },
            {
                type: "lounge_access",
                category: "travel",
                count_per_year: 8,
                domestic: true,
                international: false
            }
        ],
        annual_fee: 1000,
        fee_waiver: { min_spend: 100000 } // Waived on ₹1L spend
    },
    {
        id: 2,
        name: "Amazon Pay ICICI",
        bank: "ICICI Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "merchant_specific",
                merchants: ["amazon.in"],
                rate: 0.05, // 5%
                cap_per_month: 750, // ₹750 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            }
        ],
        annual_fee: 0, // Lifetime free
        fee_waiver: null
    },
    {
        id: 3,
        name: "Flipkart Axis Bank",
        bank: "Axis Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "merchant_specific",
                merchants: ["flipkart.com"],
                rate: 0.05, // 5%
                cap_per_month: 1000, // ₹1,000 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            }
        ],
        annual_fee: 500,
        fee_waiver: { min_spend: 200000 } // Waived on ₹2L spend
    },
    {
        id: 4,
        name: "SBI Cashback",
        bank: "SBI",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "online_shopping",
                merchants: [], // All online spends
                rate: 0.05, // 5%
                cap_per_month: 5000, // ₹5,000 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            }
        ],
        annual_fee: 999,
        fee_waiver: { min_spend: 200000 } // Waived on ₹2L spend
    },
    {
        id: 5,
        name: "Axis Atlas",
        bank: "Axis Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "reward_points",
                category: "travel",
                merchants: ["makemytrip.com", "goibibo.com", "booking.com", "agoda.com"],
                rate: 5, // 5 EDGE Miles per ₹100 = 5% equivalent
                cap_per_month: null,
                cap_per_transaction: null,
                conversion_rate: 0.01 // 1 mile = ₹0.01 (approximate)
            },
            {
                type: "reward_points",
                category: "all_other",
                merchants: [],
                rate: 2, // 2 EDGE Miles per ₹100 = 2% equivalent
                cap_per_month: null,
                cap_per_transaction: null,
                conversion_rate: 0.01
            },
            {
                type: "lounge_access",
                category: "travel",
                count_per_year: null, // Unlimited based on tier
                domestic: true,
                international: true
            }
        ],
        annual_fee: 5000,
        fee_waiver: { min_spend: 1000000 } // Waived on ₹10L spend
    },
    {
        id: 6,
        name: "IDFC First WOW",
        bank: "IDFC First",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.06, // 6% equivalent (6X rewards)
                cap_per_month: null,
                cap_per_transaction: null
            },
            {
                type: "forex",
                category: "international",
                merchants: [],
                markup: 0, // Zero forex markup
                cap_per_transaction: null
            },
            {
                type: "discount",
                category: "entertainment",
                merchants: ["bookmyshow.com"],
                rate: 0.50, // Buy 1 Get 1 (50% discount)
                cap_per_transaction: null,
                cap_per_month: null
            }
        ],
        annual_fee: 0, // Lifetime free
        fee_waiver: null
    },
    {
        id: 7,
        name: "HDFC Infinia Metal",
        bank: "HDFC Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "reward_points",
                category: "all_other",
                merchants: [],
                rate: 3.33, // 5X reward points = 3.33% equivalent
                cap_per_month: null,
                cap_per_transaction: null,
                conversion_rate: 0.01
            },
            {
                type: "discount",
                category: "entertainment",
                merchants: ["bookmyshow.com"],
                rate: 0.50, // Buy 1 Get 1
                cap_per_transaction: null,
                cap_per_month: null
            },
            {
                type: "discount",
                category: "dining",
                merchants: [],
                rate: 0.50, // Buy 1 Get 1
                cap_per_transaction: null,
                cap_per_month: null
            },
            {
                type: "lounge_access",
                category: "travel",
                count_per_year: null, // Unlimited
                domestic: true,
                international: true
            },
            {
                type: "forex",
                category: "international",
                merchants: [],
                markup: 0.02, // 2% forex markup (lowest)
                cap_per_transaction: null
            }
        ],
        annual_fee: 12500,
        fee_waiver: null
    },
    {
        id: 8,
        name: "Swiggy HDFC",
        bank: "HDFC Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "merchant_specific",
                merchants: ["swiggy.com"],
                rate: 0.10, // 10% cashback
                cap_per_month: 500, // ₹500 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            }
        ],
        annual_fee: 500,
        fee_waiver: { min_spend: 200000 } // Waived on ₹2L spend
    },
    {
        id: 9,
        name: "Zomato RBL",
        bank: "RBL Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "merchant_specific",
                merchants: ["zomato.com"],
                rate: 0.10, // 10% cashback
                cap_per_month: 500, // ₹500 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            }
        ],
        annual_fee: 500,
        fee_waiver: { min_spend: 200000 }
    },
    {
        id: 10,
        name: "ICICI Platinum",
        bank: "ICICI Bank",
        type: "Credit Card",
        benefits: [
            {
                type: "cashback",
                category: "fuel",
                merchants: [],
                rate: 0.05, // 5% on fuel
                cap_per_month: 500, // ₹500 per month
                cap_per_transaction: null
            },
            {
                type: "cashback",
                category: "all_other",
                merchants: [],
                rate: 0.01, // 1%
                cap_per_month: null,
                cap_per_transaction: null
            }
        ],
        annual_fee: 0, // Lifetime free
        fee_waiver: null
    }
];

// Merchant mapping for URL detection
export const merchantMap = {
    "amazon.in": "Amazon",
    "flipkart.com": "Flipkart",
    "myntra.com": "Myntra",
    "swiggy.com": "Swiggy",
    "zomato.com": "Zomato",
    "makemytrip.com": "MakeMyTrip",
    "goibibo.com": "Goibibo",
    "booking.com": "Booking.com",
    "agoda.com": "Agoda",
    "bookmyshow.com": "BookMyShow"
};

// Category mapping
export const categoryMap = {
    "online_shopping": "Online Shopping",
    "dining": "Dining/Food Delivery",
    "travel": "Travel",
    "entertainment": "Entertainment",
    "fuel": "Fuel",
    "international": "International Spends",
    "merchant_specific": "Specific Merchant",
    "all_other": "All Other Spends"
};
