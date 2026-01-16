import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingDown, ShieldCheck, Zap } from 'lucide-react-native';

const DebtScreen = () => {
    const [strategy, setStrategy] = useState('avalanche');

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="px-5 pt-4">
                <Text className="text-3xl font-black text-white mb-2">Debt <Text className="text-red-400">Crusher</Text></Text>
                <Text className="text-gray-400 mb-8">Strategize your loan repayments.</Text>

                {/* Strategy Toggle */}
                <View className="bg-surface rounded-2xl p-1 flex-row mb-8 border border-white/10">
                    <TouchableOpacity
                        className={`flex-1 py-3 items-center rounded-xl ${strategy === 'avalanche' ? 'bg-surface-lighter' : 'bg-transparent'}`}
                        onPress={() => setStrategy('avalanche')}
                    >
                        <Text className={`font-bold ${strategy === 'avalanche' ? 'text-white' : 'text-gray-500'}`}>Avalanche</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-3 items-center rounded-xl ${strategy === 'snowball' ? 'bg-surface-lighter' : 'bg-transparent'}`}
                        onPress={() => setStrategy('snowball')}
                    >
                        <Text className={`font-bold ${strategy === 'snowball' ? 'text-white' : 'text-gray-500'}`}>Snowball</Text>
                    </TouchableOpacity>
                </View>

                {/* Explanation Card */}
                <View className="bg-gradient-to-br from-red-500/10 to-transparent p-6 rounded-3xl border border-red-500/20 mb-8">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="bg-red-500/20 p-2 rounded-lg">
                            {strategy === 'avalanche' ? <TrendingDown size={24} color="#F87171" /> : <Zap size={24} color="#F87171" />}
                        </View>
                        <Text className="text-white font-bold text-lg">
                            {strategy === 'avalanche' ? 'Highest Interest First' : 'Smallest Balance First'}
                        </Text>
                    </View>
                    <Text className="text-gray-300 leading-6">
                        {strategy === 'avalanche'
                            ? "Mathematically superior. You pay off loans with the highest interest rate first, saving the most money over time."
                            : "Psychologically satisfying. You clear small debts quickly to build momentum and motivation."
                        }
                    </Text>
                </View>

                <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Your Loans</Text>

                {/* Loan Card 1 */}
                <View className="bg-surface-lighter p-6 rounded-3xl mb-4 border border-white/5 relative overflow-hidden">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-white font-bold text-xl">HDFC Personal</Text>
                        <View className="bg-red-500/10 px-3 py-1 rounded-full">
                            <Text className="text-red-400 font-bold text-xs">13.5%</Text>
                        </View>
                    </View>
                    <View className="h-2 bg-black rounded-full mb-2">
                        <View className="h-full w-[40%] bg-red-400 rounded-full" />
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500 text-xs">Paid: ₹2L</Text>
                        <Text className="text-white font-bold text-xs">Balance: ₹3L</Text>
                    </View>
                </View>

                {/* Loan Card 2 */}
                <View className="bg-surface-lighter p-6 rounded-3xl mb-4 border border-white/5 relative overflow-hidden">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-white font-bold text-xl">SBI Home Loan</Text>
                        <View className="bg-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-primary font-bold text-xs">8.5%</Text>
                        </View>
                    </View>
                    <View className="h-2 bg-black rounded-full mb-2">
                        <View className="h-full w-[10%] bg-primary rounded-full" />
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500 text-xs">Paid: ₹5L</Text>
                        <Text className="text-white font-bold text-xs">Balance: ₹45L</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default DebtScreen;
