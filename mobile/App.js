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
                    <Text style={styles.posInfoDesc}>CURRENT FOCUS: <Text style={styles.posBright}>{selectedPosition.toUpperCase()}</Text></Text>
                </LinearGradient>
            </View>

            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>03</Text>
                <Text style={styles.stepLabel}>PRO RECOMMENDATIONS</Text>
            </View>
            <View style={styles.gearGrid}>
                {(positionGear[selectedPosition] || positionGear['Striker']).map((item, idx) => (
                    <Animated.View key={item.id} entering={SlideInRight.delay(idx * 150)} style={styles.productCard}>
                        <View style={styles.imgWrapper}>
                            <Image source={{ uri: item.image }} style={styles.productImg} />
                            <View style={styles.tagBadge}>
                                <Text style={styles.tagText}>{item.tag.toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={styles.proInfo}>
                            <Text style={styles.productNameP}>{item.name}</Text>
                            <Text style={styles.productPriceP}>{item.price}</Text>
                        </View>
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.headerArea}>
                <View style={styles.topBar}>
                    <View style={styles.logoGroup}>
                        <Image
                            source={require('./assets/vlogo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.topIcons}>
                        <TouchableOpacity style={styles.topIconBtn}>
                            <Bell size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topIconBtn}>
                            <User size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- Search Bar --- */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color="#666" style={styles.searchIcon} />
                        <RNTextInput
                            placeholder="Search gear, pro athletes..."
                            placeholderTextColor="#666"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity style={styles.filterBtn}>
                            <Grid size={18} color="#FF4500" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.modeContainer}>
                    <View style={styles.modeTrack}>
                        <TouchableOpacity
                            onPress={() => setActiveMode('Beginner')}
                            style={[styles.modeTab, activeMode === 'Beginner' && styles.modeTabActive]}
                        >
                            <Text style={[styles.modeTabText, activeMode === 'Beginner' && styles.modeTabTextActive]}>EXPLORE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveMode('Advanced')}
                            style={[styles.modeTab, activeMode === 'Advanced' && styles.modeTabActivePro]}
                        >
                            <Text style={[styles.modeTabText, activeMode === 'Advanced' && styles.modeTabTextActive]}>PRO FLOW</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {activeMode === 'Beginner' ? <BeginnerUI /> : <AdvancedUI />}
            </ScrollView>

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.95)', 'black']} style={styles.bottomNavContainer}>
                <View style={styles.bottomNav}>
                    <NavTab icon={<ShoppingBag size={24} />} label="SHOP" active={activeTab === 'Shop'} onPress={() => setActiveTab('Shop')} />
                    <NavTab icon={<Activity size={24} />} label="PERFORM" active={activeTab === 'Stats'} onPress={() => setActiveTab('Stats')} />
                    <NavTab icon={<Trophy size={24} />} label="ARENA" active={activeTab === 'Arena'} onPress={() => setActiveTab('Arena')} />
                    <NavTab icon={<User size={24} />} label="PROFILE" active={activeTab === 'Pro'} onPress={() => setActiveTab('Pro')} />
                </View>
            </LinearGradient>
        </View>
    );
}

const NavTab = ({ icon, label, active, onPress }) => (
    <TouchableOpacity style={styles.navTab} onPress={onPress}>
        {React.cloneElement(icon, { color: active ? '#FF4500' : '#888', strokeWidth: active ? 2.5 : 2 })}
        <Text style={[styles.navText, { color: active ? 'white' : '#888' }]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    headerArea: { backgroundColor: 'black', paddingBottom: 5 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 4 },
    logoGroup: { height: 90, width: 240, justifyContent: 'center', marginLeft: -35 },
    logoImage: { width: '100%', height: '100%' },
    topIcons: { flexDirection: 'row' },
    topIconBtn: { marginLeft: 15 },

    searchContainer: { paddingHorizontal: 24, marginTop: 0 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 20, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#222' },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, color: 'white', fontSize: 14, fontWeight: '600' },
    filterBtn: { backgroundColor: '#1a1a1a', padding: 10, borderRadius: 12 },

    modeContainer: { alignItems: 'center', marginTop: 12 },
    modeTrack: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 30, padding: 4, width: '85%' },
    modeTab: { flex: 1, paddingVertical: 12, borderRadius: 26, alignItems: 'center' },
    modeTabActive: { backgroundColor: '#222' },
    modeTabActivePro: { backgroundColor: '#FF4500' },
    modeTabText: { color: '#666', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    modeTabTextActive: { color: 'white' },

    scrollContainer: { flex: 1, backgroundColor: '#0a0a0a', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 4 },
    mainContent: { padding: 24, paddingTop: 10 },

    heroBanner: { marginBottom: 20, height: 180, borderRadius: 30, overflow: 'hidden' },
    heroGradient: { flex: 1, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    heroTag: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    heroTitle: { color: 'white', fontSize: 24, fontWeight: '900', marginTop: 8, width: '80%', lineHeight: 28 },
    heroBtn: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 15, alignSelf: 'flex-start' },
    heroBtnText: { color: 'black', fontSize: 11, fontWeight: '900' },
    heroZap: { position: 'absolute', right: -10, top: 20 },

    categoryHeadingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 35 },
    catSubTitle: { color: '#FF4500', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    catTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
    categoryScroll: { flex: 1, marginLeft: 20 },
    catItem: { alignItems: 'center', marginRight: 24 },
    catIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#151515', justifyContent: 'center', alignItems: 'center' },
    catIconActive: { backgroundColor: '#FF450033', borderColor: '#FF4500', borderWidth: 1.5 },
    catIcon: { fontSize: 22 },
    catLabel: { color: '#666', fontSize: 9, fontWeight: '900', marginTop: 8, letterSpacing: 0.5 },
    catLabelActive: { color: 'white' },

    sectionTitle: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 2, marginBottom: 20, opacity: 0.6 },

    bigCardB: { backgroundColor: '#111', borderRadius: 35, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: '#1a1a1a' },
    imageWrapperB: { aspectRatio: 1.2, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', position: 'relative' },
