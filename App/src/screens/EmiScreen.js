import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calculator, Brain, Zap, Info, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatCurrency } from '../utils';

const EmiScreen = () => {
    const [amount, setAmount] = useState(1000000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(10);
    const [showAi, setShowAi] = useState(false);

    // Calc Logic
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    const totalAmount = emi * months;
    const totalInterest = totalAmount - amount;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="px-5">
                <Text className="text-3xl font-black text-white mt-4 mb-1">EMI <Text className="text-primary">Calculator</Text></Text>
                <Text className="text-gray-400 mb-8">Plan your loan repayment.</Text>

                {/* Output Card */}
                <View className="bg-surface-lighter rounded-[32px] p-8 items-center border border-white/5 mb-8">
                    <View className="w-40 h-40 rounded-full border-[12px] border-primary/20 items-center justify-center mb-6 relative">
                        <View className="absolute w-full h-full rounded-full border-[12px] border-primary border-t-transparent border-l-transparent rotate-45" />
                        <Text className="text-gray-400 text--[10px] font-bold uppercase">Monthly EMI</Text>
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
                </View>

                {/* Inputs */}
                <View className="bg-surface rounded-3xl p-6 border border-white/5 space-y-6 mb-8">
                    {/* Amount */}
                    <View>
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Loan Amount</Text>
                        <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                            <Text className="text-primary font-bold text-lg mr-2">₹</Text>
                            <TextInput
                                className="flex-1 text-white font-bold text-lg"
                                value={amount.toString()}
                                keyboardType="numeric"
                                onChangeText={(t) => setAmount(Number(t))}
                            />
                        </View>
                    </View>

                    {/* Rate & Tenure */}
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Interest (%)</Text>
                            <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                                <TextInput
                                    className="flex-1 text-white font-bold text-lg"
                                    value={rate.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(t) => setRate(Number(t))}
                                />
                                <Zap size={16} color="#FFD700" />
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Tenure (Yrs)</Text>
                            <View className="bg-background rounded-xl flex-row items-center border border-white/10 px-4 py-3">
                                <TextInput
                                    className="flex-1 text-white font-bold text-lg"
                                    value={tenure.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(t) => setTenure(Number(t))}
                                />
                                <Calculator size={16} color="#10B981" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity
                    onPress={() => setShowAi(true)}
                    className="w-full bg-primary py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-amber-500/20 mb-32"
                >
                    <Brain size={20} color="#000" style={{ marginRight: 8 }} />
                    <Text className="text-background font-black text-lg">Analyze with AI</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* AI Modal Simulation */}
            {showAi && (
                <Animated.View entering={FadeInDown} className="absolute bottom-0 left-0 right-0 h-[60%] bg-surface border-t border-white/10 rounded-t-[40px] p-8 shadow-2xl">
                    <View className="items-center mb-6">
                        <View className="w-12 h-1 bg-white/20 rounded-full mb-6" />
                        <Brain size={48} color="#FFD700" />
                        <Text className="text-2xl font-black text-white mt-4">Gullak Intelligence</Text>
                    </View>

                    <View className="space-y-4">
                        <View className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <Text className="text-primary font-bold mb-1">💡 Smart Saving</Text>
                            <Text className="text-gray-400 text-sm">Prepay just 1 EMI every year to reduce your tenure by <Text className="text-white font-bold">3 years</Text>.</Text>
                        </View>
                        <View className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <Text className="text-red-400 font-bold mb-1">⚠️ High Interest Warning</Text>
                            <Text className="text-gray-400 text-sm">Your rate of {rate}% is slightly high. Negotiate for 8.5%.</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => setShowAi(false)} className="mt-8 bg-surface-lighter py-4 rounded-xl items-center border border-white/10">
                        <Text className="text-white font-bold">Close Analysis</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

export default EmiScreen;
