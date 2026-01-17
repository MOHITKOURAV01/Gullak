import { useMemo } from 'react';

/**
 * Custom hook for debt optimization calculations
 * Implements avalanche strategy (highest interest rate first)
 * Calculates baseline vs optimized repayment scenarios
 */
export const useDebtCalculator = (emis, income, livingExpenses, extraPayment) => {

    // Helper function to calculate roadmap and interest
    const calculateProjection = (currentEmis, monthlyExtra) => {
        if (currentEmis.length === 0) return { timeline: [], totalInterest: 0, totalDuration: 0 };

        let loans = currentEmis.map(e => ({
            ...e,
            currentBalance: Number(e.balance),
            currentRate: Number(e.rate),
            currentEmi: Number(e.amount)
        })).sort((a, b) => b.currentRate - a.currentRate); // Avalanche sort

        let timeline = [];
        let totalInterest = 0;
        let monthCount = 0;
        let availableExtra = Number(monthlyExtra) || 0;

        while (loans.some(l => l.currentBalance > 10) && monthCount < 360) {
            monthCount++;
            let monthlySurplus = availableExtra;
            const target = loans.find(l => l.currentBalance > 10); // Highest rate loan

            loans.forEach(loan => {
                if (loan.currentBalance > 10) {
                    const interest = loan.currentBalance * (loan.currentRate / 100 / 12);
                    totalInterest += interest;

                    let pay = loan.currentEmi;

                    if (target && loan.id === target.id) {
                        pay += monthlySurplus;
                    }

                    let principal = pay - interest;

                    // Handle case where interest > EMI (negative amortization)
                    if (principal < 0) {
                        principal = 0;
                    }

                    if (principal > loan.currentBalance) {
                        principal = loan.currentBalance;
                    }

                    loan.currentBalance -= principal;

                    if (loan.currentBalance <= 10) {
                        loan.currentBalance = 0;
                        timeline.push({
                            month: monthCount,
                            loanName: loan.name,
                            year: Math.floor(monthCount / 12),
                            monthRem: monthCount % 12
                        });
                        availableExtra += loan.currentEmi; // Snowball: freed up EMI adds to surplus
                    }
                }
            });
        }

        return {
            timeline,
            totalInterest,
            totalDuration: monthCount
        };
    };

    const optimized = useMemo(() => calculateProjection(emis, extraPayment), [emis, extraPayment]);
    const baseline = useMemo(() => calculateProjection(emis, 0), [emis]);

    const suggestions = useMemo(() => {
        const sortedByRate = [...emis].sort((a, b) => b.rate - a.rate);
        const sortedByBalance = [...emis].sort((a, b) => a.balance - b.balance);

        const totalMonthlyEMI = emis.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const totalDebt = emis.reduce((acc, curr) => acc + (curr.balance || 0), 0);
        const monthlyBalance = income - livingExpenses - totalMonthlyEMI;
        const debtToIncomeRatio = income > 0 ? (totalMonthlyEMI / income) * 100 : 0;

        return {
            avalanche: sortedByRate[0],
            snowball: sortedByBalance[0],
            stats: {
                totalMonthlyEMI,
                totalDebt,
                monthlyBalance,
                debtToIncomeRatio
            }
        };
    }, [emis, income, livingExpenses]);

    return {
        roadmap: optimized.timeline,
        totalInterest: optimized.totalInterest,
        totalDuration: optimized.totalDuration,
        baseline,
        suggestions
    };
};
