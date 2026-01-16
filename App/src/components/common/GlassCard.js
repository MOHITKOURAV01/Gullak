import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const GlassCard = ({ children, className = '' }) => {
    return (
        <View className={`bg-surface-lighter rounded-3xl border border-white/5 ${className}`}>
            {children}
        </View>
    );
};

export default GlassCard;
