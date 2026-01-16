import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, Calculator, FileText, TrendingDown } from 'lucide-react-native';
import NetWorthCard from '../components/common/NetWorthCard';
import QuickToolCard from '../components/common/QuickToolCard';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="px-5">
                {/* Header */}
                <View className="flex-row justify-between items-center py-4 mb-6">
                    <View>
                        <Text className="text-gray-400 text-sm font-medium">Good Evening</Text>
                        <Text className="text-white text-2xl font-bold">Mohit Kourav</Text>
                    </View>
                    <TouchableOpacity className="bg-surface-lighter p-3 rounded-full border border-white/10">
                        <Bell size={20} color="#FFD700" />
                    </TouchableOpacity>
                </View>

                {/* Net Worth Card */}
                {/* NetWorth Card */}
                <NetWorthCard />

                {/* Quick Actions / Grid */}
                <Text className="text-white text-lg font-bold mb-4">Quick Tools</Text>
                <View className="flex-row flex-wrap gap-4">
                    <TouchableOpacity onPress={() => navigation.navigate('ExpenseCalculator')} className="w-[47%]">
                        <QuickToolCard
                            icon={FileText}
                            title="Expense Planner"
                            subtitle="Track monthly"
                            color="#FFD700"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('EmiOptimization')} className="w-[47%]">
                        <QuickToolCard
                            icon={Calculator}
                            title="EMI Calculator"
                            subtitle="Optimize loans"
                            color="#10B981"
                        />
                    </TouchableOpacity>
                </View>

                {/* Daily Insight */}
                <View className="mt-8 bg-surface-lighter p-5 rounded-3xl border border-white/5 mb-24">
                    <Text className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Gullak Wisdom</Text>
                    <Text className="text-gray-300 italic">"Do not save what is left after spending, but spend what is left after saving." - Warren Buffet</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
