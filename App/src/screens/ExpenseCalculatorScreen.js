import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, Brain, RefreshCw, AlertCircle } from 'lucide-react-native';
import { formatCurrency } from '../utils';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ExpenseCalculatorScreen = () => {
    const INITIAL_CATEGORIES = [
        { id: '1', name: 'Home Rent / EMI', amount: 15000, category: 'Fixed' },
        { id: '2', name: 'Groceries', amount: 5000, category: 'Variable' },
        { id: '3', name: 'Electricity & Water', amount: 2000, category: 'Fixed' },
        { id: '4', name: 'Internet & Mobile', amount: 1200, category: 'Fixed' },
        { id: '5', name: 'Fuel & Transport', amount: 3500, category: 'Variable' },
        { id: '6', name: 'Insurance Premiums', amount: 1500, category: 'Fixed' },
    ];

    const [expenses, setExpenses] = useState(INITIAL_CATEGORIES);
    const [income, setIncome] = useState(50000);
    const [showAI, setShowAI] = useState(false);

    const totalExpenses = useMemo(() =>
        expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
        , [expenses]);

    const savings = income - totalExpenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    const aiInsights = useMemo(() => {
        const insights = [];
        const luxuryExpenses = expenses.filter(e => e.category === 'Luxury' && Number(e.amount) > 0);
        const variableExpenses = expenses.filter(e => e.category === 'Variable' && Number(e.amount) > 0);

        const luxuryTotal = luxuryExpenses.reduce((a, b) => a + Number(b.amount), 0);

        if (luxuryExpenses.length > 0) {
            const topLuxury = [...luxuryExpenses].sort((a, b) => b.amount - a.amount)[0];
            if (topLuxury.amount > (income * 0.05)) {
                insights.push({
                    type: 'warning',
                    text: `Your spending on "${topLuxury.name}" (${formatCurrency(topLuxury.amount)}) is quite high. Reducing this by 30% could save you ${formatCurrency(Math.round(topLuxury.amount * 0.3 * 12))} annually.`
                });
            }
        }

        const leakThreshold = income * 0.08;
        variableExpenses.forEach(exp => {
            if (exp.amount > leakThreshold) {
                insights.push({
                    type: 'info',
                    text: `"${exp.name}" might be a 'Money Leak'. A 20% saving (~${formatCurrency(Math.round(exp.amount * 0.2))}) is achievable.`
                });
            }
        });

        if (savingsRate < 25) {
            insights.push({
                type: 'urgent',
                text: `Your Savings Rate (${Math.round(savingsRate)}%) is below the ideal 25%. Consider cutting down on non-essential subscriptions.`
            });
        }

        if (luxuryTotal > (income * 0.15)) {
            insights.push({
                type: 'warning',
                text: "Luxury expenses are hindering your wealth creation. Try a 'No-Buy' challenge for the next 2 months."
            });
        }

        return insights;
    }, [expenses, income, savingsRate]);

    const addRow = (category = 'Variable') => {
        const newId = Math.random().toString(36).substr(2, 9);
        setExpenses([
            ...expenses,
            { id: newId, name: '', amount: 0, category: category }
        ]);
    };

    const removeRow = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const updateRow = (id, field, value) => {
        setExpenses(expenses.map(e => (e.id === id ? { ...e, [field]: value } : e)));
    };

    const resetSheet = () => {
        Alert.alert(
            'Reset Sheet',
            'Reset all values to default?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset', onPress: () => {
                        setExpenses(INITIAL_CATEGORIES);
                        setIncome(50000);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="px-5">
                <Text className="text-3xl font-black text-white mt-4 mb-2">
                    Monthly <Text className="text-primary">Expense Planner</Text>
                </Text>
                <Text className="text-gray-400 mb-6">Track and optimize your spending</Text>

                {/* Income Card */}
                <GlassCard className="p-6 mb-6">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Monthly Income</Text>
                    <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                        <Text className="text-primary font-bold text-lg mr-2">₹</Text>
                        <TextInput
                            className="flex-1 text-white font-bold text-2xl"
                            value={income.toString()}
                            keyboardType="numeric"
                            onChangeText={(t) => setIncome(Number(t) || 0)}
                        />
                    </View>
                </GlassCard>

                {/* Summary Cards */}
                <View className="flex-row gap-3 mb-6">
                    <GlassCard className="flex-1 p-4">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Expenses</Text>
                        <Text className="text-red-400 font-bold text-lg">{formatCurrency(totalExpenses)}</Text>
                    </GlassCard>
                    <GlassCard className="flex-1 p-4">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Savings</Text>
                        <Text className="text-secondary font-bold text-lg">{formatCurrency(savings)}</Text>
                    </GlassCard>
                    <GlassCard className="flex-1 p-4">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Rate</Text>
                        <Text className="text-primary font-bold text-lg">{Math.round(savingsRate)}%</Text>
                    </GlassCard>
                </View>

                {/* Expense List */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white font-bold text-lg">Expenses</Text>
                        <TouchableOpacity onPress={resetSheet} className="flex-row items-center gap-2">
                            <RefreshCw size={16} color="#FFD700" />
                            <Text className="text-primary text-sm font-bold">Reset</Text>
                        </TouchableOpacity>
                    </View>

                    {expenses.map((expense) => (
                        <GlassCard key={expense.id} className="p-4 mb-3">
                            <View className="flex-row items-center gap-3">
                                <View className="flex-1">
                                    <TextInput
                                        className="text-white font-bold text-base mb-2"
                                        value={expense.name}
                                        placeholder="Expense name"
                                        placeholderTextColor="#525252"
                                        onChangeText={(t) => updateRow(expense.id, 'name', t)}
                                    />
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-primary font-bold">₹</Text>
                                        <TextInput
                                            className="text-white font-bold flex-1"
                                            value={expense.amount.toString()}
                                            keyboardType="numeric"
                                            onChangeText={(t) => updateRow(expense.id, 'amount', Number(t) || 0)}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => removeRow(expense.id)} className="p-2">
                                    <Trash2 size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))}

                    <TouchableOpacity
                        onPress={() => addRow()}
                        className="bg-surface-lighter py-4 rounded-2xl flex-row justify-center items-center border border-white/10 mb-6"
                    >
                        <Plus size={20} color="#FFD700" style={{ marginRight: 8 }} />
                        <Text className="text-primary font-bold">Add Expense</Text>
                    </TouchableOpacity>
                </View>

                {/* AI Insights Button */}
                <PrimaryButton
                    title="AI Munshi's Counsel"
                    icon={Brain}
                    onPress={() => setShowAI(true)}
                />

                <View className="h-32" />
            </ScrollView>

            {/* AI Modal */}
            {showAI && (
                <Animated.View entering={FadeInDown} className="absolute bottom-0 left-0 right-0 h-[70%] bg-surface border-t border-white/10 rounded-t-[40px] p-6">
                    <View className="items-center mb-6">
                        <View className="w-12 h-1 bg-white/20 rounded-full mb-6" />
                        <Brain size={48} color="#FFD700" />
                        <Text className="text-2xl font-black text-white mt-4">AI Munshi's Counsel</Text>
                    </View>

                    <ScrollView className="flex-1">
                        {aiInsights.length > 0 ? (
                            aiInsights.map((insight, idx) => (
                                <View key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-3">
                                    <View className="flex-row items-start gap-3">
                                        <AlertCircle
                                            size={20}
                                            color={insight.type === 'urgent' ? '#EF4444' : insight.type === 'warning' ? '#F59E0B' : '#10B981'}
                                        />
                                        <Text className="text-gray-300 text-sm flex-1">{insight.text}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="items-center py-8">
                                <Text className="text-gray-400">Your finances look great! Keep it up.</Text>
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity onPress={() => setShowAI(false)} className="mt-4 bg-surface-lighter py-4 rounded-xl items-center border border-white/10">
                        <Text className="text-white font-bold">Close</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

export default ExpenseCalculatorScreen;
