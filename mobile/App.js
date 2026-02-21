import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
    Bell,
    Bookmark,
    ShoppingBag,
    User,
    Zap,
    Activity,
    MapPin,
    Trophy,
    Search,
    Grid
} from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeInUp,
    FadeIn,
    SlideInRight
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function App() {
    return (
        <SafeAreaProvider>
            <MainApp />
        </SafeAreaProvider>
    );
}

function MainApp() {
    const [activeTab, setActiveTab] = useState('Shop');
    const [activeMode, setActiveMode] = useState('Beginner');
    const [selectedSport, setSelectedSport] = useState('Football');
    const [selectedPosition, setSelectedPosition] = useState('Striker');
    const [searchQuery, setSearchQuery] = useState('');

    const sports = [
        { name: 'Football', icon: '⚽', color: '#1a472a' },
        { name: 'Cricket', icon: '🏏', color: '#2e4d2a' },
        { name: 'Basketball', icon: '🏀', color: '#5c3a21' },
        { name: 'Tennis', icon: '🎾', color: '#1e3a5f' },
        { name: 'Badminton', icon: '🏸', color: '#4a1e5f' },
    ];

    const beginnerGear = [
        { id: 'bg1', name: 'Phantom GX Elite', price: '₹19,995', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', brand: 'Nike' },
        { id: 'bg2', name: 'AeroSwift Match', price: '₹5,499', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400', brand: 'Nike' },
        { id: 'bg3', name: 'Predator Precision', price: '₹14,999', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400', brand: 'Adidas' },
    ];

    const sportPositions = {
        'Football': [
            { id: 'gk', label: 'GK', top: '82%', left: '46%', name: 'Goalkeeper' },
            { id: 'def', label: 'DEF', top: '65%', left: '46%', name: 'Defender' },
            { id: 'mid', label: 'MID', top: '45%', left: '46%', name: 'Midfielder' },
            { id: 'fwd', label: 'ST', top: '15%', left: '46%', name: 'Striker' },
        ],
        'Basketball': [
            { id: 'pg', label: 'PG', top: '75%', left: '46%', name: 'Point Guard' },
            { id: 'sg', label: 'SG', top: '55%', left: '20%', name: 'Shooting Guard' },
            { id: 'sf', label: 'SF', top: '55%', left: '72%', name: 'Small Forward' },
            { id: 'c', label: 'C', top: '25%', left: '46%', name: 'Center' },
        ],
        'Cricket': [
            { id: 'bat', label: 'BAT', top: '40%', left: '46%', name: 'Batsman' },
            { id: 'bowl', label: 'BOWL', top: '65%', left: '46%', name: 'Bowler' },
