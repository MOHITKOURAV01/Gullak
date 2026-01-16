import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Home, Wallet, TrendingDown, Calculator, FileText } from 'lucide-react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import DebtScreen from './src/screens/DebtScreen';
import EmiScreen from './src/screens/EmiScreen';
import ExpenseCalculatorScreen from './src/screens/ExpenseCalculatorScreen';
import EmiOptimizationScreen from './src/screens/EmiOptimizationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Tools
function ToolsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ToolsHome" component={HomeScreen} />
      <Stack.Screen name="ExpenseCalculator" component={ExpenseCalculatorScreen} />
      <Stack.Screen name="EmiOptimization" component={EmiOptimizationScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0A0A0A',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            height: 85,
            paddingTop: 10,
            paddingBottom: 30,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#525252',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={ToolsStack}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpensesScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Debt"
          component={DebtScreen}
          options={{
            tabBarIcon: ({ color, size }) => <TrendingDown color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="EMI"
          component={EmiScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
