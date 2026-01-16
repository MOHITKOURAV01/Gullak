export const calculateEMI = (principal, ratePercent, tenureYears) => {
    const monthlyRate = ratePercent / 12 / 100;
    const months = tenureYears * 12;

    if (monthlyRate === 0) {
        return Math.round(principal / months);
    }

    const emi = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );

    return emi;
};

export const calculateTotalAmount = (emi, tenureYears) => {
    return emi * tenureYears * 12;
};

export const calculateTotalInterest = (totalAmount, principal) => {
    return totalAmount - principal;
};
