import { cardBenefits, merchantMap, categoryMap } from '../data/cardBenefits';

/**
 * Gullak AI Card Recommendation Engine
 * 
 * Analyzes user's transaction and recommends the best card to use
 * based on maximum savings (cashback/discount/reward points)
 */

/**
 * Detects merchant from URL or merchant name
 */
export const detectMerchant = (merchantNameOrUrl) => {
    if (!merchantNameOrUrl) return null;
    
    const lower = merchantNameOrUrl.toLowerCase();
    
    // Check direct merchant matches
    for (const [url, name] of Object.entries(merchantMap)) {
        if (lower.includes(url) || lower.includes(name.toLowerCase())) {
            return { url, name };
        }
    }
    
    // Check category keywords
    if (lower.includes('amazon')) return { url: 'amazon.in', name: 'Amazon' };
    if (lower.includes('flipkart')) return { url: 'flipkart.com', name: 'Flipkart' };
    if (lower.includes('swiggy')) return { url: 'swiggy.com', name: 'Swiggy' };
    if (lower.includes('zomato')) return { url: 'zomato.com', name: 'Zomato' };
    if (lower.includes('bookmyshow') || lower.includes('bms')) return { url: 'bookmyshow.com', name: 'BookMyShow' };
    if (lower.includes('makemytrip') || lower.includes('mmt')) return { url: 'makemytrip.com', name: 'MakeMyTrip' };
    if (lower.includes('goibibo')) return { url: 'goibibo.com', name: 'Goibibo' };
    
    return null;
};

/**
 * Detects category from merchant or user input
 */
export const detectCategory = (merchant, userCategory) => {
    if (userCategory) {
        const lower = userCategory.toLowerCase();
        if (lower.includes('travel') || lower.includes('flight') || lower.includes('hotel')) return 'travel';
        if (lower.includes('dining') || lower.includes('food') || lower.includes('restaurant')) return 'dining';
        if (lower.includes('movie') || lower.includes('entertainment')) return 'entertainment';
        if (lower.includes('fuel') || lower.includes('petrol') || lower.includes('diesel')) return 'fuel';
        if (lower.includes('online') || lower.includes('shopping') || lower.includes('ecommerce')) return 'online_shopping';
        if (lower.includes('international') || lower.includes('forex')) return 'international';
    }
    
    if (merchant) {
        const merchantUrl = merchant.url || merchant;
        if (['makemytrip.com', 'goibibo.com', 'booking.com', 'agoda.com'].includes(merchantUrl)) return 'travel';
        if (['swiggy.com', 'zomato.com'].includes(merchantUrl)) return 'dining';
        if (['bookmyshow.com'].includes(merchantUrl)) return 'entertainment';
        if (['amazon.in', 'flipkart.com', 'myntra.com'].includes(merchantUrl)) return 'online_shopping';
    }
    
    return 'all_other';
};

/**
 * Calculates savings for a specific card and transaction
 */
export const calculateCardSavings = (card, transaction) => {
    const { amount, merchant, category, date } = transaction;
    
    let totalSavings = 0;
    let applicableBenefit = null;
    let savingsBreakdown = [];
    
    // Detect merchant and category
    const detectedMerchant = merchant ? detectMerchant(merchant) : null;
    const detectedCategory = detectCategory(detectedMerchant, category);
    
    // Check if transaction is on a specific day (for day-based discounts)
    const dayOfWeek = date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short' }) : null;
    
    // Find applicable benefits
    for (const benefit of card.benefits) {
        let isApplicable = false;
        let savings = 0;
        
        // Check merchant-specific benefits
        if (benefit.merchants && benefit.merchants.length > 0) {
            if (detectedMerchant && benefit.merchants.includes(detectedMerchant.url)) {
                isApplicable = true;
            }
        }
        
        // Check category-based benefits
        if (!isApplicable && benefit.category === detectedCategory) {
            isApplicable = true;
        }
        
        // Check "all_other" fallback
        if (!isApplicable && benefit.category === 'all_other') {
            isApplicable = true;
        }
        
        // Check day restrictions (e.g., Thu-Sun for dining)
        if (isApplicable && benefit.days && dayOfWeek) {
            if (!benefit.days.includes(dayOfWeek)) {
                isApplicable = false;
            }
        }
        
        if (isApplicable) {
            // Calculate savings based on benefit type
            if (benefit.type === 'cashback') {
                savings = amount * benefit.rate;
                
                // Apply caps
                if (benefit.cap_per_transaction) {
                    savings = Math.min(savings, benefit.cap_per_transaction);
                }
                if (benefit.cap_per_month) {
                    // Note: Monthly cap would need transaction history, for now we assume it's available
                    savings = Math.min(savings, benefit.cap_per_month);
                }
                
                if (savings > 0) {
                    savingsBreakdown.push({
                        type: 'cashback',
                        rate: benefit.rate * 100,
                        amount: savings,
                        description: `${benefit.rate * 100}% cashback`
                    });
                }
            } else if (benefit.type === 'discount') {
                savings = amount * benefit.rate;
                
                // Apply caps
                if (benefit.cap_per_transaction) {
                    savings = Math.min(savings, benefit.cap_per_transaction);
                }
                if (benefit.cap_per_month) {
                    savings = Math.min(savings, benefit.cap_per_month);
                }
                
                if (savings > 0) {
                    savingsBreakdown.push({
                        type: 'discount',
                        rate: benefit.rate * 100,
                        amount: savings,
                        description: `${benefit.rate * 100}% discount`
                    });
                }
            } else if (benefit.type === 'reward_points') {
                // Convert reward points to cash value
                const points = (amount / 100) * benefit.rate;
                const conversionRate = benefit.conversion_rate || 0.01; // Default 1 point = ₹0.01
                savings = points * conversionRate;
                
                if (savings > 0) {
                    savingsBreakdown.push({
                        type: 'reward_points',
                        rate: benefit.rate,
                        amount: savings,
                        description: `${benefit.rate} miles/points per ₹100 (≈${(benefit.rate * conversionRate * 100).toFixed(1)}% value)`
                    });
                }
            }
            
            if (savings > 0 && (!applicableBenefit || savings > applicableBenefit.savings)) {
                applicableBenefit = {
                    ...benefit,
                    savings,
                    breakdown: savingsBreakdown
                };
                totalSavings = savings;
            }
        }
    }
    
    return {
        card,
        savings: totalSavings,
        benefit: applicableBenefit,
        breakdown: savingsBreakdown,
        effectiveRate: amount > 0 ? (totalSavings / amount) * 100 : 0
    };
};

/**
 * Main recommendation function
 * Returns the best card(s) for a given transaction
 */
export const getBestCardRecommendation = (transaction, userCards = null) => {
    // Use user's cards if provided, otherwise use all available cards
    const cardsToCheck = userCards || cardBenefits;
    
    if (!transaction || !transaction.amount || transaction.amount <= 0) {
        return {
            error: "Please provide a valid transaction amount"
        };
    }
    
    // Calculate savings for each card
    const cardResults = cardsToCheck.map(card => 
        calculateCardSavings(card, transaction)
    );
    
    // Sort by savings (highest first)
    cardResults.sort((a, b) => b.savings - a.savings);
    
    const bestCard = cardResults[0];
    const alternatives = cardResults.slice(1, 4); // Top 3 alternatives
    
    // Detect merchant and category for display
    const detectedMerchant = transaction.merchant ? detectMerchant(transaction.merchant) : null;
    const detectedCategory = detectCategory(detectedMerchant, transaction.category);
    
    return {
        bestCard: {
            name: bestCard.card.name,
            bank: bestCard.card.bank,
            savings: bestCard.savings,
            effectiveRate: bestCard.effectiveRate,
            benefit: bestCard.benefit,
            breakdown: bestCard.breakdown,
            whereToUse: detectedMerchant ? detectedMerchant.name : (categoryMap[detectedCategory] || 'Anywhere'),
            proTip: getProTip(bestCard.card, bestCard.benefit, transaction)
        },
        alternatives: alternatives.map(alt => ({
            name: alt.card.name,
            bank: alt.card.bank,
            savings: alt.savings,
            effectiveRate: alt.effectiveRate,
            benefit: alt.benefit
        })),
        transaction: {
            amount: transaction.amount,
            merchant: detectedMerchant?.name || transaction.merchant || 'Unknown',
            category: categoryMap[detectedCategory] || 'General'
        }
    };
};

/**
 * Generates a pro tip based on card and benefit
 */
const getProTip = (card, benefit, transaction) => {
    const tips = [];
    
    if (benefit?.days && benefit.days.length > 0) {
        tips.push(`Use on ${benefit.days.join(', ')} for maximum benefit`);
    }
    
    if (benefit?.cap_per_month) {
        tips.push(`Monthly cap: ₹${benefit.cap_per_month}`);
    }
    
    if (benefit?.cap_per_transaction) {
        tips.push(`Per transaction cap: ₹${benefit.cap_per_transaction}`);
    }
    
    if (card.bank === 'HDFC Bank' || card.bank === 'Axis Bank') {
        tips.push('Check if you can use via UPI for additional benefits');
    }
    
    if (benefit?.type === 'reward_points') {
        tips.push('Points can be transferred to airline/hotel partners for better value');
    }
    
    return tips.length > 0 ? tips[0] : 'Use this card for maximum savings on this transaction';
};
