import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';
import { formatCurrency } from '../../utils';

const NetWorthCard = () => {
    return (
        <LinearGradient
            colors={['#171717', '#252525']}
            className="rounded-[32px] p-6 border border-white/10 relative overflow-hidden mb-8"
        >
            {/* Background Glow */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />

            <View className="flex-row justify-between items-start mb-8">
                <View>
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Savings</Text>
                    <Text className="text-4xl font-black text-white">{formatCurrency(1245000)}</Text>
                </View>
                <View className="bg-green-500/20 px-3 py-1 rounded-full flex-row items-center gap-1">
                    <TrendingUp size={12} color="#10B981" />
                    <Text className="text-secondary text-xs font-bold">+12.5%</Text>
                </View>
            </View>

            <View className="flex-row gap-4">
                <TouchableOpacity className="flex-1 bg-primary px-4 py-3 rounded-xl flex-row justify-center items-center">
                    <Text className="text-background font-bold mr-2">Add Income</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-surface-lighter px-4 py-3 rounded-xl flex-row justify-center items-center border border-white/5">
                    <Text className="text-white font-bold">Analysis</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default NetWorthCard;
