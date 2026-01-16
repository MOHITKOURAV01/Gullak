import React from 'react';
import { View, Text } from 'react-native';

const SectionHeader = ({ title, value }) => {
    return (
        <View className="mb-8">
            <Text className="text-3xl font-black text-white mb-2">{title}</Text>
            {value && <Text className="text-gray-400">{value}</Text>}
        </View>
    );
};

export default SectionHeader;
