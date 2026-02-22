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
    Grid,
    Home,
    Calendar,
    Award,
    Flame,
    Star,
    Shield,
    TrendingUp
} from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeInUp,
    FadeIn,
    SlideInRight
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import {
    sports,
    sportProducts,
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
const BeginnerUI = ({ selectedSport, setSelectedSport }) => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
        <View style={styles.heroBanner}>
            <LinearGradient colors={['#FF4B2B', '#FF416C']} style={styles.heroGradient}>
                <View>
                    <Text style={styles.heroTag}>SEASON 2026</Text>
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

        <Text style={styles.sectionTitle}>CURATED FOR {selectedSport.toUpperCase()}</Text>
        <View style={styles.gridContainerB}>
            {(sportProducts[selectedSport] || []).map((item, idx) => (
                <Animated.View key={item.id} entering={FadeInUp.delay(idx * 50)} style={styles.miniCardB}>
                    <TouchableOpacity activeOpacity={0.95} style={styles.miniImageWrapperB}>
                        <Image source={{ uri: item.image }} style={styles.miniImageB} resizeMethod="scale" />
                        <View style={styles.miniBrandBadge}>
                            <Text style={styles.miniBrandText}>{item.brand}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.miniInfoB}>
                        <Text numberOfLines={1} style={styles.miniNameB}>{item.name}</Text>
                        <Text style={styles.miniPriceB}>{item.price}</Text>
                    </View>
                </Animated.View>
            ))}
        </View>
    </Animated.View>
);

const AdvancedUI = ({ selectedSport, setSelectedSport, selectedPosition, setSelectedPosition }) => {
    const getPositionStats = (pos) => {
        const statsMap = {
            'Striker': { agi: 85, pow: 92, sta: 78, vis: 75, focus: 'Explosive acceleration and precision finishing.' },
            'Midfielder': { agi: 88, pow: 75, sta: 95, vis: 90, focus: 'High endurance and unparalleled field vision.' },
            'Defender': { agi: 72, pow: 95, sta: 85, vis: 65, focus: 'Raw strength, tackling, and aerial dominance.' },
            'Goalkeeper': { agi: 95, pow: 80, sta: 60, vis: 85, focus: 'Lightning reflexes and absolute box control.' },
            'Point Guard': { agi: 95, pow: 60, sta: 88, vis: 92, focus: 'Elite ball handling and court orchestration.' },
            'Forward': { agi: 82, pow: 88, sta: 85, vis: 70, focus: 'Versatile scoring and aggressive rebounding.' },
            'Center': { agi: 60, pow: 98, sta: 75, vis: 50, focus: 'Paint domination and defensive anchoring.' },
            'Sprinter': { agi: 95, pow: 98, sta: 50, vis: 40, focus: 'Maximal velocity and explosive block starts.' },
            'Marathon': { agi: 60, pow: 55, sta: 99, vis: 50, focus: 'Extreme endurance and pacing optimization.' },
        };
        return statsMap[pos] || { agi: 80, pow: 80, sta: 80, vis: 80, focus: 'Balanced athletic execution.' };
    };

    const currentStats = getPositionStats(selectedPosition);

    const infiniteSports = Array(20).fill(sports).flat();

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
                {infiniteSports.map((sport, i) => (
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

                {/* --- Intricate Position Dashboard --- */}
                <View style={styles.posDashboard}>
                    <View style={styles.posDashHeader}>
                        <Zap size={18} color="#FFD700" />
                        <Text style={styles.posDashTitle}>{selectedPosition.toUpperCase()} METRICS</Text>
                    </View>

                    <View style={styles.posMetrics}>
                        {[
                            { label: 'AGILITY', val: currentStats.agi, color: '#00FF7F' },
                            { label: 'POWER', val: currentStats.pow, color: '#FF4500' },
                            { label: 'STAMINA', val: currentStats.sta, color: '#4169E1' },
                            { label: 'VISION', val: currentStats.vis, color: '#FFD700' }
                        ].map((metric, i) => (
                            <View key={i} style={styles.metricItem}>
                                <View style={styles.metricTextRow}>
                                    <Text style={styles.metricLabel}>{metric.label}</Text>
                                    <Text style={styles.metricVal}>{metric.val}</Text>
                                </View>
                                <View style={styles.metricBarBg}>
                                    <LinearGradient
                                        colors={[metric.color, metric.color + '80']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.metricBarFill, { width: `${metric.val}%` }]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.posFocusBox}>
                        <Shield size={14} color="#666" style={{ marginRight: 8 }} />
                        <Text style={styles.posRoleText}>{currentStats.focus}</Text>
                    </View>
                </View>
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
};

const HomeUI = () => {
    const [stats, setStats] = useState({
        score: 84,
        steps: 12400,
        calories: 480
    });
    const [lastIntensity, setLastIntensity] = useState('+12%');
    const [lastSessionTime, setLastSessionTime] = useState('2H AGO');

    const logFeedback = (level) => {
        let addedScore = 0;
        let addedCalories = 0;
        let addedSteps = 0;
        let intensityText = '';

        if (level === 'LIGHT') {
            addedScore = 1;
            addedCalories = 150;
            addedSteps = 1500;
            intensityText = '+2%';
        } else if (level === 'MODERATE') {
            addedScore = 3;
            addedCalories = 350;
            addedSteps = 4000;
            intensityText = '+10%';
        } else if (level === 'BEAST MODE') {
            addedScore = 5;
            addedCalories = 750;
            addedSteps = 8000;
            intensityText = '+24%';
        }

        setStats(prev => ({
            score: Math.min(100, prev.score + addedScore),
            steps: prev.steps + addedSteps,
            calories: prev.calories + addedCalories
        }));
        setLastIntensity(intensityText);
        setLastSessionTime('JUST NOW');

        Alert.alert('Session Logged! ⚡', `Feedback: ${level}\n+${addedCalories} kcal\n+${addedScore} Fitness Score`);
    };

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.homeTopRow}>
                <View>
                    <Text style={styles.homeGreeting}>WELCOME BACK,</Text>
                    <Text style={styles.homeUser}>GAUTAM BHARADWAJ</Text>
                </View>
                <View style={styles.streakBadge}>
                    <Flame size={18} color="#FF4500" fill="#FF4500" />
                    <Text style={styles.streakText}>12 DAY STREAK</Text>
                </View>
            </View>

            <View style={styles.homeHero}>
                <LinearGradient colors={['#1a1a1a', '#050505']} style={styles.homeHeroInner}>
                    <View style={styles.heroTextSection}>
                        <Text style={styles.heroSub}>TRAINING LOG</Text>
                        <Text style={styles.heroMain}>LAST SESSION: {lastSessionTime}</Text>
                        <View style={styles.heroStats}>
                            <View style={styles.hStatItem}>
                                <Zap size={14} color="#FFD700" />
                                <Text style={styles.hStatVal}>{stats.calories} kcal</Text>
                            </View>
                            <View style={styles.hStatItem}>
                                <Activity size={14} color="#00FF7F" />
                                <Text style={styles.hStatVal}>{lastIntensity} Intensity</Text>
                            </View>
                        </View>
                    </View>
                    <TrendingUp size={40} color="#FF4500" opacity={0.3} style={styles.heroIconAbs} />
                </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>QUICK ANALYTICS</Text>
            <View style={styles.statGrid}>
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>{stats.score}</Text>
                    <Text style={styles.statLab}>FITNESS SCORE</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>{(stats.steps / 1000).toFixed(1)}k</Text>
                    <Text style={styles.statLab}>STEPS TODAY</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>HOW WAS YOUR WORKOUT?</Text>
            <View style={styles.feedbackGrid}>
                <TouchableOpacity style={styles.feedbackBtn} onPress={() => logFeedback('LIGHT')}>
                    <Text style={styles.fbEmoji}>😌</Text>
                    <Text style={styles.fbText}>LIGHT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackBtnMid} onPress={() => logFeedback('MODERATE')}>
                    <Text style={styles.fbEmoji}>🔥</Text>
                    <Text style={styles.fbText}>MODERATE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackBtnPro} onPress={() => logFeedback('BEAST MODE')}>
                    <Text style={styles.fbEmoji}>🦾</Text>
                    <Text style={styles.fbText}>BEAST MODE</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.upgradeBanner}>
                <LinearGradient colors={['#FF4500', '#FF8C00']} horizontal style={styles.upgradeGrad}>
                    <Shield size={24} color="white" />
                    <View style={styles.upgradeTextCont}>
                        <Text style={styles.upgradeTitle}>VOLT PRO ACCESS</Text>
                        <Text style={styles.upgradeDesc}>Unlock Advanced AI Analytics</Text>
                    </View>
                    <Zap size={16} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const ArenaUI = () => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
        <View style={styles.arenaHeader}>
            <View>
                <Text style={styles.arenaTag}>THE COLLISEUM</Text>
                <Text style={styles.arenaTitle}>GLOBAL ARENA</Text>
            </View>
            <TouchableOpacity style={styles.leaderboardBtn}>
                <Trophy size={18} color="#FFD700" />
            </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.arenaTabs}>
            {['ACTIVE', 'UPCOMING', 'RESULTS', 'CLUBS'].map((tab, idx) => (
                <TouchableOpacity key={tab} style={[styles.arenaTab, idx === 0 && styles.arenaTabActive]}>
                    <Text style={[styles.arenaTabText, idx === 0 && styles.arenaTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {[
            { name: 'Elite Champions League', prize: '₹2,50,000', players: '4.2k', tag: 'LIVE', viewers: '12.8k' },
            { name: 'Volt Summer Splashdown', prize: '₹50,000', players: '1.8k', tag: 'LIVE', viewers: '5.4k' },
            { name: 'Warrior Street Series', prize: '₹80,000', players: '890', tag: 'STARTING', viewers: '0' }
        ].map((item, i) => (
            <View key={i} style={styles.tournCardEnhanced}>
                <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.tournInnerEnhanced}>
                    <View style={styles.tournTop}>
                        <View style={styles.tournMetaRow}>
                            <View style={styles.tournBadgeAbs}>
                                <Text style={styles.tournBadgeText}>{item.tag}</Text>
                            </View>
                            {item.viewers !== '0' && (
                                <View style={styles.viewerBadge}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.viewerText}>{item.viewers} WATCHING</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.tournNameEnhanced}>{item.name}</Text>
                    </View>
                    <View style={styles.tournMid}>
                        <View style={styles.tournStat}>
                            <Text style={styles.tournStatLab}>PRIZE POOL</Text>
                            <Text style={styles.tournStatValPrize}>{item.prize}</Text>
                        </View>
                        <View style={styles.tournStat}>
                            <Text style={styles.tournStatLab}>ATHLETES</Text>
                            <Text style={styles.tournStatVal}>{item.players}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.arenaJoinBtn}
                        onPress={() => Alert.alert('Arena Entry', `Joining ${item.name}...`)}
                    >
                        <LinearGradient
                            colors={['#FF4500', '#FF2E00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.arenaJoinGrad}
                        >
                            <Text style={styles.arenaJoinText}>ENTER ARENA</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        ))}
    </Animated.View>
);

const ProfileUI = () => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
        <View style={styles.profileHeroEnhanced}>
            <View style={styles.avatarWrapperAbs}>
                <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.avatarRing}>
                    <View style={styles.avatarInner}>
                        <User size={50} color="white" />
                    </View>
                </LinearGradient>
                <View style={styles.verifiedBadge}>
                    <Zap size={10} color="black" fill="black" />
                </View>
            </View>
            <Text style={styles.pName}>Gautam Bharadwaj</Text>
            <View style={styles.lvlBadge}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={styles.lvlText}>GOLD ATHLETE • LEVEL 42</Text>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressTextRow}>
                    <Text style={styles.progressLabel}>NEXT RANK: MASTER</Text>
                    <Text style={styles.progressPercent}>840/1000 XP</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={['#FF4500', '#FF8C00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: '84%' }]}
                    />
                </View>
            </View>
        </View>

        <Text style={styles.sectionTitle}>PRESTIGE AWARDS</Text>
        <View style={styles.achievementRow}>
            {[
                { icon: <Zap size={20} color="#FFD700" />, label: 'Fastest' },
                { icon: <Shield size={20} color="#4169E1" />, label: 'Defender' },
                { icon: <Award size={20} color="#FF4500" />, label: 'Champion' }
            ].map((item, i) => (
                <View key={i} style={styles.attainBox}>
                    <View style={styles.attainIconCirc}>{item.icon}</View>
                    <Text style={styles.attainLabel}>{item.label.toUpperCase()}</Text>
                </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <View style={styles.activityTimeline}>
            {[
                { title: 'Purchased Elite Cleats', date: 'Yesterday', icon: <ShoppingBag size={14} color="#FF4500" /> },
                { title: 'New Personal Record', date: '2 days ago', icon: <Activity size={14} color="#00FF7F" /> },
                { title: 'Joined Summer Cup', date: '3 days ago', icon: <Trophy size={14} color="#FFD700" /> }
            ].map((item, i) => (
                <View key={i} style={styles.timelineItem}>
                    <View style={styles.timelineIcon}>{item.icon}</View>
                    <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>{item.title}</Text>
                        <Text style={styles.timelineDate}>{item.date}</Text>
                    </View>
                </View>
            ))}
        </View>

        <View style={styles.profileMenu}>
            {[
                { label: 'MY GEAR COLLECTION', icon: <ShoppingBag size={18} color="#666" /> },
                { label: 'PERFORMANCE ARCHIVE', icon: <Activity size={18} color="#666" /> },
                { label: 'TEAM MANAGER', icon: <Grid size={18} color="#666" /> },
                { label: 'APP SETTINGS', icon: <Star size={18} color="#666" /> }
            ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.menuRow}>
                    <View style={styles.menuIconBox}>{item.icon}</View>
                    <Text style={styles.menuRowText}>{item.label}</Text>
                    <Zap size={14} color="#333" />
                </TouchableOpacity>
            ))}
        </View>
    </Animated.View>
);

function MainApp() {
    const [showIntro, setShowIntro] = useState(true);
    const [activeTab, setActiveTab] = useState('Shop');
    const [activeMode, setActiveMode] = useState('Beginner');
    const [selectedSport, setSelectedSport] = useState('Football');
    const [selectedPosition, setSelectedPosition] = useState('Striker');
    const [searchQuery, setSearchQuery] = useState('');

    const [fadeAnim] = useState(new Animated.Value(1));

    if (showIntro) {
        return (
            <Animated.View style={{ flex: 1, backgroundColor: 'black', opacity: fadeAnim }}>
                <StatusBar style="light" hidden />
                <Video
                    source={require('./assets/intro.mp4')}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    isLooping={false}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            Animated.timing(fadeAnim, {
                                toValue: 0,
                                duration: 800,
                                useNativeDriver: true,
                            }).start(() => setShowIntro(false));
                        }
                    }}
                />
            </Animated.View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.headerArea}>
                <View style={styles.topBar}>
                    <View style={styles.logoGroup}>
                        <Image
                            source={require('./assets/vlogo.webp')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.topIcons}>
                        <TouchableOpacity style={styles.topIconBtn} onPress={() => Alert.alert('Notifications', 'Your gear is on its way!')}>
                            <Bell size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topIconBtn} onPress={() => setActiveTab('Profile')}>
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

                {/* Only show Explore/Pro Flow toggle in the Shop section */}
                {activeTab === 'Shop' && (
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
                )}
            </SafeAreaView>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {activeTab === 'Home' && <HomeUI />}
                {activeTab === 'Shop' && (
                    activeMode === 'Beginner' ?
                        <BeginnerUI selectedSport={selectedSport} setSelectedSport={setSelectedSport} /> :
                        <AdvancedUI
                            selectedSport={selectedSport}
                            setSelectedSport={setSelectedSport}
                            selectedPosition={selectedPosition}
                            setSelectedPosition={setSelectedPosition}
                        />
                )}
                {activeTab === 'Arena' && <ArenaUI />}
                {activeTab === 'Profile' && <ProfileUI />}
            </ScrollView>

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.95)', 'black']} style={styles.bottomNavContainer}>
                <View style={styles.bottomNav}>
                    <NavTab icon={<Home size={24} />} label="HOME" active={activeTab === 'Home'} onPress={() => setActiveTab('Home')} />
                    <NavTab icon={<ShoppingBag size={24} />} label="SHOP" active={activeTab === 'Shop'} onPress={() => setActiveTab('Shop')} />
                    <NavTab icon={<Trophy size={24} />} label="ARENA" active={activeTab === 'Arena'} onPress={() => setActiveTab('Arena')} />
                    <NavTab icon={<User size={24} />} label="PROFILE" active={activeTab === 'Profile'} onPress={() => setActiveTab('Profile')} />
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

    gridContainerB: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    miniCardB: { width: (width - 48 - 16) / 2, marginBottom: 24 },
    miniImageWrapperB: { aspectRatio: 1, backgroundColor: '#111', borderRadius: 24, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a1a' },
    miniImageB: { width: '80%', height: '80%', resizeMode: 'contain' },
    miniBrandBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FF4500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    miniBrandText: { color: 'white', fontSize: 8, fontWeight: '900' },
    miniInfoB: { marginTop: 12, paddingHorizontal: 4 },
    miniNameB: { color: 'white', fontSize: 14, fontWeight: '700' },
    miniPriceB: { color: '#FF4500', fontSize: 16, fontWeight: '900', marginTop: 2 },

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
    nodeLabelActive: { color: 'white' },

    posDashboard: { marginTop: 20, backgroundColor: '#111', borderRadius: 30, padding: 24, borderWidth: 1, borderColor: '#1a1a1a' },
    posDashHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    posDashTitle: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1.5, marginLeft: 10 },
    posMetrics: { marginBottom: 15 },
    metricItem: { marginBottom: 12 },
    metricTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    metricLabel: { color: '#888', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    metricVal: { color: 'white', fontSize: 10, fontWeight: '900' },
    metricBarBg: { height: 6, backgroundColor: '#222', borderRadius: 3, overflow: 'hidden' },
    metricBarFill: { height: '100%', borderRadius: 3 },
    posFocusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff05', padding: 12, borderRadius: 15, marginTop: 5 },
    posRoleText: { color: '#ccc', fontSize: 10, fontWeight: '700', flex: 1, lineHeight: 14 },

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
    navText: { fontSize: 9, fontWeight: '900', marginTop: 6, letterSpacing: 1 },

    statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    statTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statBox: { width: '48%', backgroundColor: '#111', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#222' },
    statVal: { color: '#FF4500', fontSize: 24, fontWeight: '900' },
    statLab: { color: '#666', fontSize: 10, fontWeight: '800', marginTop: 5 },

    homeTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    homeGreeting: { color: '#666', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    homeUser: { color: 'white', fontSize: 20, fontWeight: '900', marginTop: 4 },
    streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, borderWidth: 1, borderColor: '#222' },
    streakText: { color: 'white', fontSize: 10, fontWeight: '900', marginLeft: 8 },
    homeHero: { marginBottom: 30 },
    homeHeroInner: { padding: 24, borderRadius: 30, borderWidth: 1, borderColor: '#1a1a1a', position: 'relative', overflow: 'hidden' },
    heroTextSection: { zIndex: 2 },
    heroSub: { color: '#FF4500', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
    heroMain: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 8 },
    heroStats: { flexDirection: 'row', marginTop: 15 },
    hStatItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, backgroundColor: '#ffffff08', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    hStatVal: { color: '#ccc', fontSize: 10, fontWeight: '700', marginLeft: 6 },
    heroIconAbs: { position: 'absolute', right: 20, bottom: 20 },
    upgradeBanner: { marginTop: 10 },
    upgradeGrad: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 25, justifyContent: 'space-between' },
    upgradeTextCont: { flex: 1, marginLeft: 15 },
    upgradeTitle: { color: 'white', fontSize: 14, fontWeight: '900' },
    upgradeDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', marginTop: 2 },

    feedbackGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    feedbackBtn: { flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a', marginRight: 10 },
    feedbackBtnMid: { flex: 1, backgroundColor: '#FF450015', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#FF450040', marginRight: 10 },
    feedbackBtnPro: { flex: 1, backgroundColor: '#FF4500', padding: 15, borderRadius: 20, alignItems: 'center' },
    fbEmoji: { fontSize: 20, marginBottom: 5 },
    fbText: { color: 'white', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

    arenaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    arenaTag: { color: '#FF4500', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    arenaTitle: { color: 'white', fontSize: 24, fontWeight: '900', marginTop: 4 },
    leaderboardBtn: { backgroundColor: '#111', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#222' },
    arenaTabs: { flexDirection: 'row', marginBottom: 25 },
    arenaTab: { marginRight: 20, paddingBottom: 8 },
    arenaTabActive: { borderBottomWidth: 2, borderBottomColor: '#FF4500' },
    arenaTabText: { color: '#444', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    arenaTabTextActive: { color: 'white' },
    tournCardEnhanced: { marginBottom: 20, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a1a' },
    tournInnerEnhanced: { padding: 24 },
    tournTop: { marginBottom: 20 },
    tournBadgeAbs: { backgroundColor: '#FF450020', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#FF450040' },
    tournBadgeText: { color: '#FF4500', fontSize: 9, fontWeight: '900' },
    tournNameEnhanced: { color: 'white', fontSize: 20, fontWeight: '900', width: '80%' },
    tournMid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#ffffff03', padding: 15, borderRadius: 20 },
    tournStat: {},
    tournStatLab: { color: '#666', fontSize: 9, fontWeight: '800', marginBottom: 5 },
    tournStatVal: { color: 'white', fontSize: 14, fontWeight: '900' },
    tournStatValPrize: { color: '#FFD700', fontSize: 14, fontWeight: '900' },
    arenaJoinBtn: { borderRadius: 18, overflow: 'hidden' },
    arenaJoinGrad: { paddingVertical: 16, alignItems: 'center' },
    arenaJoinText: { color: 'white', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    tournMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    viewerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00000080', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    liveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF0000', marginRight: 6 },
    viewerText: { color: '#888', fontSize: 8, fontWeight: '900' },

    profileHeroEnhanced: { alignItems: 'center', marginBottom: 35, backgroundColor: '#111', padding: 30, borderRadius: 40, borderWidth: 1, borderColor: '#1a1a1a' },
    avatarWrapperAbs: { marginBottom: 20, position: 'relative' },
    avatarRing: { width: 100, height: 100, borderRadius: 50, padding: 3, justifyContent: 'center', alignItems: 'center' },
    avatarInner: { width: '100%', height: '100%', borderRadius: 50, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111' },
    pName: { color: 'white', fontSize: 22, fontWeight: '900' },
    lvlBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#FFD70015', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    lvlText: { color: '#FFD700', fontSize: 9, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
    progressSection: { width: '100%', marginTop: 30 },
    progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    progressLabel: { color: '#666', fontSize: 9, fontWeight: '900' },
    progressPercent: { color: 'white', fontSize: 9, fontWeight: '900' },
    progressBarBg: { height: 6, backgroundColor: '#222', borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    achievementRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 35 },
    attainBox: { alignItems: 'center', width: '28%' },
    attainIconCirc: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#1a1a1a' },
    attainLabel: { color: '#666', fontSize: 8, fontWeight: '900', textAlign: 'center' },
    activityTimeline: { marginBottom: 35 },
    timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    timelineIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    timelineContent: { flex: 1 },
    timelineTitle: { color: 'white', fontSize: 13, fontWeight: '700' },
    timelineDate: { color: '#666', fontSize: 10, fontWeight: '600', marginTop: 2 },
    profileMenu: { marginTop: 10 },
    menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 20, borderRadius: 25, marginBottom: 15, borderWidth: 1, borderColor: '#1a1a1a' },
    menuIconBox: { width: 40, height: 40, borderRadius: 15, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuRowText: { flex: 1, color: 'white', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }
});
