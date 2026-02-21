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
import {
    sports,
    beginnerGear,
    sportPositions,
    positionGear
} from './src/constants/sportsData';

const { width } = Dimensions.get('window');

export default function App() {
    return (
        <SafeAreaProvider>
            <MainApp />
        </SafeAreaProvider>
    );
}

/**
 * Main application component handling the state and navigation flow.
 * Supports dual UI modes: Explore (Beginner) and Pro Flow (Advanced).
 */
function MainApp() {
    const [activeTab, setActiveTab] = useState('Shop');
    const [activeMode, setActiveMode] = useState('Beginner');
    const [selectedSport, setSelectedSport] = useState('Football');
    const [selectedPosition, setSelectedPosition] = useState('Striker');
    const [searchQuery, setSearchQuery] = useState('');

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
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 24, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#222' },
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
    fullImageB: { width: '80%', height: '80%', resizeMode: 'contain' },
    saveBtnB: { position: 'absolute', top: 20, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 15 },
    brandBadge: { position: 'absolute', top: 20, left: 20, backgroundColor: '#FF4500', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    brandText: { color: 'white', fontSize: 10, fontWeight: '900' },
    cardInfoB: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTextRow: { flex: 1 },
    pNameB: { color: 'white', fontSize: 18, fontWeight: '800' },
    pPriceB: { color: '#FF4500', fontSize: 18, fontWeight: '900', marginTop: 4 },
    quickAdd: { backgroundColor: '#222', padding: 14, borderRadius: 18 },

    stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    stepNumber: { color: '#FF4500', fontSize: 28, fontWeight: '900', opacity: 0.3 },
    stepLabel: { color: 'white', fontSize: 14, fontWeight: '900', marginLeft: 12, letterSpacing: 2 },
    sportsScroll: { marginBottom: 35 },
    sportCard: { width: 100, height: 110, backgroundColor: '#111', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#1a1a1a' },
    sportCardActive: { borderColor: '#FF4500', backgroundColor: '#FF450008' },
    sportIconP: { fontSize: 32 },
    sportNameP: { color: '#444', fontSize: 9, fontWeight: '900', marginTop: 10, letterSpacing: 1 },
    sportNamePActive: { color: 'white' },

    groundContainer: { marginBottom: 40, position: 'relative' },
    pitch: { height: 350, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    pitchLines: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
    pitchCircle: { position: 'absolute', top: '40%', left: '35%', width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    posNode: { position: 'absolute', alignItems: 'center', width: 60, height: 60, justifyContent: 'center' },
    nodePoint: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.2)' },
    nodePointActive: { backgroundColor: '#FF4500', transform: [{ scale: 1.5 }], shadowColor: '#FF4500', shadowRadius: 10, shadowOpacity: 0.8 },
    nodeLabel: { color: '#444', fontSize: 10, fontWeight: '900', marginTop: 6 },
    nodeLabelActive: { color: 'white' },
    posInfoOverlay: { position: 'absolute', bottom: -10, left: 30, right: 30, backgroundColor: '#151515', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
    posInfoDesc: { color: '#888', fontSize: 11, fontWeight: '700', marginLeft: 10, letterSpacing: 0.5 },
    posBright: { color: 'white', fontWeight: '900' },

    gearGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    productCard: { width: '48%', marginBottom: 25 },
    imgWrapper: { aspectRatio: 1, backgroundColor: '#111', borderRadius: 25, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    productImg: { width: '80%', height: '80%', resizeMode: 'contain' },
    tagBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FF450015', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#FF450033' },
    tagText: { color: '#FF4500', fontSize: 8, fontWeight: '900' },
    proInfo: { marginTop: 12 },
    productNameP: { color: 'white', fontSize: 14, fontWeight: '700' },
    productPriceP: { color: '#FF4500', fontSize: 14, fontWeight: '900', marginTop: 2 },

    bottomNavContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 30 },
    navTab: { alignItems: 'center' },
    navText: { fontSize: 9, fontWeight: '900', marginTop: 6, letterSpacing: 1 }
});
