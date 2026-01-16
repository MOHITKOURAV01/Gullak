import React from 'react';
import { View, Text } from 'react-native';

const StatCard = ({ label, value, color = '#FFFFFF' }) => {
    return (
        <View className="bg-surface p-6 rounded-2xl border border-white/5 flex-1">
            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">{label}</Text>
            <Text className="text-2xl font-bold" style={{ color }}>{value}</Text>
        </View>
    );
};

export default StatCard;
