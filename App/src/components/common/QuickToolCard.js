import React from 'react';
import { View, Text } from 'react-native';

const QuickToolCard = ({ icon: Icon, title, subtitle, color }) => {
    return (
        <View className="w-[47%] bg-surface-lighter p-4 rounded-3xl border border-white/5">
            <View
                className="w-10 h-10 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon size={20} color={color} />
            </View>
            <Text className="text-white font-bold text-lg">{title}</Text>
            <Text className="text-gray-400 text-xs">{subtitle}</Text>
        </View>
    );
};

export default QuickToolCard;
