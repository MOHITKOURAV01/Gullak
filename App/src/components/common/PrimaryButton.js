import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

const PrimaryButton = ({ title, onPress, icon: Icon, disabled = false }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`bg-primary py-4 px-6 rounded-2xl flex-row justify-center items-center shadow-lg shadow-amber-500/20 ${disabled ? 'opacity-50' : ''
                }`}
        >
            {Icon && <Icon size={20} color="#000" style={{ marginRight: 8 }} />}
            <Text className="text-background font-black text-lg">{title}</Text>
        </TouchableOpacity>
    );
};

export default PrimaryButton;
