import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Coffee, ShoppingBag, Home } from 'lucide-react-native';
import { formatCurrency } from '../utils';

const TransactionItem = ({ item }) => (
    <View className="bg-surface-lighter p-4 rounded-2xl mb-3 flex-row items-center border border-white/5">
        <View className="w-12 h-12 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${item.color}20` }}>
            <item.icon size={20} color={item.color} />
        </View>
        <View className="flex-1">
            <Text className="text-white font-bold text-base">{item.title}</Text>
            <Text className="text-gray-500 text-xs">Today, 2:30 PM</Text>
        </View>
        <Text className="text-white font-black text-base">-{formatCurrency(item.amount)}</Text>
    </View>
);

const EXPENSES = [
    { id: 1, title: 'Starbucks Coffee', amount: 350, icon: Coffee, color: '#10B981' },
    { id: 2, title: 'Grocery Shopping', amount: 2400, icon: ShoppingBag, color: '#FFD700' },
    { id: 3, title: 'House Rent', amount: 12000, icon: Home, color: '#3B82F6' },
];

const ExpensesScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-5 pt-4">
                <Text className="text-3xl font-black text-white mb-6">Expense <Text className="text-secondary">Munshi</Text></Text>

                {/* Visual Header */}
                <View className="bg-surface p-6 rounded-3xl border border-white/5 mb-8 flex-row justify-between items-center">
                    <View>
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Monthly Budget</Text>
                        <Text className="text-2xl font-black text-white">{formatCurrency(50000)}</Text>
                    </View>
                    <View className="w-16 h-16 rounded-full border-4 border-secondary items-center justify-center">
                        <Text className="text-secondary font-bold text-xs">75%</Text>
                    </View>
                </View>

                {/* List */}
                <ScrollView className="mb-24">
                    <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Recent Transactions</Text>
                    {EXPENSES.map((item) => (
                        <TransactionItem key={item.id} item={item} />
                    ))}
                </ScrollView>
            </View>

            {/* FAB */}
            <TouchableOpacity className="absolute bottom-24 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-amber-500/30">
                <Plus size={32} color="#000" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ExpensesScreen;
