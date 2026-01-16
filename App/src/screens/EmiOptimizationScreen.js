import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calculator, Brain, Save, Lightbulb, TrendingDown } from 'lucide-react-native';
import { formatCurrency } from '../utils';
import { calculateEMI, calculateTotalAmount, calculateTotalInterest } from '../utils/calculations';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

const EmiOptimizationScreen = () => {
    const [amount, setAmount] = useState(1000000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(10);
    const [showAI, setShowAI] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const emi = calculateEMI(amount, rate, tenure);
    const totalAmount = calculateTotalAmount(emi, tenure);
    const totalInterest = calculateTotalInterest(totalAmount, amount);

    const saveConfiguration = () => {
        // In a real app, save to AsyncStorage
        setIsSaved(true);
        Alert.alert('Success', 'Configuration saved!');
        setTimeout(() => setIsSaved(false), 2000);
    };

    const savingsTips = [
        {
            title: 'Prepayment Strategy',
            description: 'Make one extra EMI payment per year to reduce your loan tenure by 2-3 years and save lakhs in interest.'
        },
        {
            title: 'Step-Up EMI',
            description: 'Increase your EMI by 5-10% annually as your income grows. This significantly reduces the loan burden.'
        },
        {
            title: 'Round-Up Payments',
            description: `Round up your EMI from ${formatCurrency(emi)} to ${formatCurrency(Math.ceil(emi / 1000) * 1000)}. Small amounts compound into big savings.`
        },
        {
            title: 'Bi-Weekly Payments',
            description: 'Pay half EMI every 2 weeks instead of monthly. You\'ll make 13 payments/year instead of 12.'
        }
    ];

    const aiAnalysis = {
        interestRatio: ((totalInterest / amount) * 100).toFixed(1),
        optimizedTenure: Math.max(5, tenure - 3),
        potentialSaving: Math.round(totalInterest * 0.25)
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="px-5">
                <Text className="text-3xl font-black text-white mt-4 mb-2">
                    EMI <Text className="text-primary">Optimization</Text>
                </Text>
                <Text className="text-gray-400 mb-6">Smart loan planning with AI insights</Text>

                {/* EMI Display Card */}
                <GlassCard className="p-8 items-center mb-6">
                    <View className="w-40 h-40 rounded-full border-[12px] border-primary/20 items-center justify-center mb-6 relative">
                        <View className="absolute w-full h-full rounded-full border-[12px] border-primary border-t-transparent border-l-transparent rotate-45" />
                        <Text className="text-gray-400 text-[10px] font-bold uppercase">Monthly EMI</Text>
                        <Text className="text-xl font-black text-white">{formatCurrency(emi)}</Text>
                    </View>

                    <View className="flex-row w-full justify-between px-4">
                        <View>
                            <Text className="text-gray-500 text-[10px] uppercase font-bold">Principal</Text>
                            <Text className="text-white font-bold">{formatCurrency(amount)}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-[10px] uppercase font-bold text-right">Interest</Text>
                            <Text className="text-primary font-bold text-right">{formatCurrency(totalInterest)}</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Input Fields */}
                <GlassCard className="p-6 mb-6">
                    <Text className="text-white font-bold text-lg mb-4">Loan Details</Text>

                    {/* Loan Amount */}
                    <View className="mb-4">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Loan Amount</Text>
                        <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                            <Text className="text-primary font-bold text-lg mr-2">₹</Text>
                            <TextInput
                                className="flex-1 text-white font-bold text-lg"
                                value={amount.toString()}
                                keyboardType="numeric"
                                onChangeText={(t) => setAmount(Number(t) || 0)}
                            />
                        </View>
                    </View>

                    {/* Interest Rate & Tenure */}
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Interest Rate (%)</Text>
                            <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                                <TextInput
                                    className="flex-1 text-white font-bold text-lg"
                                    value={rate.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(t) => setRate(Number(t) || 0)}
                                />
                                <Text className="text-primary font-bold">%</Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Tenure (Years)</Text>
                            <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                                <TextInput
                                    className="flex-1 text-white font-bold text-lg"
                                    value={tenure.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(t) => setTenure(Number(t) || 0)}
                                />
                                <Calculator size={16} color="#10B981" />
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={saveConfiguration}
                        className="bg-surface-lighter py-3 rounded-xl flex-row justify-center items-center border border-white/10"
                    >
                        <Save size={18} color={isSaved ? "#10B981" : "#FFD700"} style={{ marginRight: 8 }} />
                        <Text className={`font-bold ${isSaved ? 'text-secondary' : 'text-primary'}`}>
                            {isSaved ? 'Saved!' : 'Save Config'}
                        </Text>
                    </TouchableOpacity>
                </GlassCard>

                {/* Action Buttons */}
                <View className="gap-3 mb-6">
                    <PrimaryButton
                        title="Calculate with AI"
                        icon={Brain}
                        onPress={() => setShowAI(true)}
                    />
                    <TouchableOpacity
                        onPress={() => setShowTips(true)}
                        className="bg-secondary py-4 rounded-2xl flex-row justify-center items-center"
                    >
                        <Lightbulb size={20} color="#000" style={{ marginRight: 8 }} />
                        <Text className="text-background font-black text-lg">Savings Tips</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-32" />
            </ScrollView>

            {/* AI Analysis Modal */}
            {showAI && (
                <Animated.View entering={FadeInDown} className="absolute bottom-0 left-0 right-0 h-[65%] bg-surface border-t border-white/10 rounded-t-[40px] p-6">
                    <View className="items-center mb-6">
                        <View className="w-12 h-1 bg-white/20 rounded-full mb-6" />
                        <Brain size={48} color="#FFD700" />
                        <Text className="text-2xl font-black text-white mt-4">AI Loan Analysis</Text>
                    </View>

                    <ScrollView className="flex-1">
                        <View className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-4">
                            <Text className="text-primary font-bold text-base mb-2">Interest to Principal Ratio</Text>
                            <Text className="text-gray-300 text-sm leading-6">
                                You are paying <Text className="text-white font-bold">{aiAnalysis.interestRatio}%</Text> in interest for every ₹100 borrowed.
                                {aiAnalysis.interestRatio > 80 && ' This is quite high - consider negotiating for a better rate.'}
                            </Text>
                        </View>

                        <View className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-4">
                            <Text className="text-secondary font-bold text-base mb-2">Tenure Optimization</Text>
                            <Text className="text-gray-300 text-sm leading-6">
                                Reducing tenure to <Text className="text-white font-bold">{aiAnalysis.optimizedTenure} years</Text> could save you approximately{' '}
                                <Text className="text-secondary font-bold">{formatCurrency(aiAnalysis.potentialSaving)}</Text> in interest, though EMI will increase.
                            </Text>
                        </View>

                        <View className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-4">
                            <Text className="text-amber-400 font-bold text-base mb-2">Rate Negotiation Tip</Text>
                            <Text className="text-gray-300 text-sm leading-6">
                                If your CIBIL score is above 750, you can negotiate for {rate - 1}% interest rate. This alone could save you lakhs.
                            </Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity onPress={() => setShowAI(false)} className="mt-4 bg-surface-lighter py-4 rounded-xl items-center border border-white/10">
                        <Text className="text-white font-bold">Close Analysis</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Savings Tips Modal */}
            {showTips && (
                <Animated.View entering={FadeInDown} className="absolute bottom-0 left-0 right-0 h-[65%] bg-surface border-t border-white/10 rounded-t-[40px] p-6">
                    <View className="items-center mb-6">
                        <View className="w-12 h-1 bg-white/20 rounded-full mb-6" />
                        <Lightbulb size={48} color="#10B981" />
                        <Text className="text-2xl font-black text-white mt-4">Smart Savings Tips</Text>
                    </View>

                    <ScrollView className="flex-1">
                        {savingsTips.map((tip, idx) => (
                            <View key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <TrendingDown size={18} color="#10B981" />
                                    <Text className="text-secondary font-bold text-base">{tip.title}</Text>
                                </View>
                                <Text className="text-gray-300 text-sm leading-6">{tip.description}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={() => setShowTips(false)} className="mt-4 bg-surface-lighter py-4 rounded-xl items-center border border-white/10">
                        <Text className="text-white font-bold">Close Tips</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

export default EmiOptimizationScreen;
