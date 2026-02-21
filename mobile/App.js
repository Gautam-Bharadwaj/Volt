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
            { id: 'wk', label: 'WK', top: '30%', left: '46%', name: 'Wicket Keeper' },
        ],
    };

    const positionGear = {
        'Striker': [
            { id: 'pg1', name: 'Mercurial Air Zoom', price: '₹24,495', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', tag: 'Elite Speed' },
            { id: 'pg2', name: 'Flight Match Ball', price: '₹3,999', image: 'https://images.unsplash.com/photo-1552318975-2758c97ec767?q=80&w=400', tag: 'Certified' },
        ],
        'Midfielder': [
            { id: 'pg3', name: 'Phantom Luna II', price: '₹22,995', image: 'https://images.unsplash.com/photo-1511886929837-399a8a111ada?q=80&w=400', tag: '360 Traction' },
        ],
        'Goalkeeper': [
            { id: 'pg4', name: 'Vapor Grip 3 Pro', price: '₹8,999', image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=400', tag: 'Hybrid Cut' },
        ],
    };

    const BeginnerUI = () => (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.heroBanner}>
                <LinearGradient colors={['#FF4B2B', '#FF416C']} style={styles.heroGradient}>
                    <View>
                        <Text style={styles.heroTag}>SEASON 2024</Text>
                        <Text style={styles.heroTitle}>ELITE PERFORMANCE</Text>
                        <TouchableOpacity style={styles.heroBtn}>
                            <Text style={styles.heroBtnText}>SHOP NOW</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.categoryHeadingRow}>
                <View>
                    <Text style={styles.catSubTitle}>CHOOSE</Text>
                    <Text style={styles.catTitle}>SPORT</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {sports.map((sport, i) => (
                        <TouchableOpacity key={i} style={styles.catItem} onPress={() => setSelectedSport(sport.name)}>
                            <View style={[styles.catIconContainer, selectedSport === sport.name && styles.catIconActive]}>
                                <Text style={styles.catIcon}>{sport.icon}</Text>
                            </View>
                            <Text style={[styles.catLabel, selectedSport === sport.name && styles.catLabelActive]}>{sport.name.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>CURATED FOR YOU</Text>
            {beginnerGear.map((item, idx) => (
                <Animated.View key={item.id} entering={FadeInUp.delay(idx * 200)} style={styles.bigCardB}>
                    <TouchableOpacity activeOpacity={0.95}>
                        <View style={styles.imageWrapperB}>
                            <Image source={{ uri: item.image }} style={styles.fullImageB} />
                            <TouchableOpacity style={styles.saveBtnB}>
                                <Bookmark size={22} color="#111" />
                            </TouchableOpacity>
                            <View style={styles.brandBadge}>
                                <Text style={styles.brandText}>{item.brand}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.cardInfoB}>
                        <View style={styles.cardTextRow}>
                            <Text style={styles.pNameB}>{item.name}</Text>
                            <Text style={styles.pPriceB}>{item.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.quickAdd}>
                            <ShoppingBag size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            ))}
        </Animated.View>
    );

    const AdvancedUI = () => (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>01</Text>
                <Text style={styles.stepLabel}>SELECT DISCIPLINE</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
                {sports.map((sport, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.sportCard, selectedSport === sport.name && styles.sportCardActive]}
                        onPress={() => {
                            setSelectedSport(sport.name);
                            const firstPos = sportPositions[sport.name]?.[0]?.name;
                            if (firstPos) setSelectedPosition(firstPos);
                        }}
                    >
                        <Text style={styles.sportIconP}>{sport.icon}</Text>
                        <Text style={[styles.sportNameP, selectedSport === sport.name && styles.sportNamePActive]}>{sport.name.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>02</Text>
                <Text style={styles.stepLabel}>POSITION ANALYSIS</Text>
            </View>
            <View style={styles.groundContainer}>
                <View style={[styles.pitch, { backgroundColor: sports.find(s => s.name === selectedSport)?.color || '#1a1a1a' }]}>
                    <View style={styles.pitchLines} />
                    <View style={styles.pitchCircle} />
                    {(sportPositions[selectedSport] || []).map((pos) => (
                        <TouchableOpacity
                            key={pos.id}
                            onPress={() => setSelectedPosition(pos.name)}
                            style={[styles.posNode, { top: pos.top, left: pos.left }]}
                        >
                            <View style={[styles.nodePoint, selectedPosition === pos.name && styles.nodePointActive]} />
                            <Text style={[styles.nodeLabel, selectedPosition === pos.name && styles.nodeLabelActive]}>{pos.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <LinearGradient colors={['rgba(255,69,0,0.1)', 'transparent']} style={styles.posInfoOverlay}>
                    <MapPin size={14} color="#FF4500" />
