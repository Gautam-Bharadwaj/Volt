import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
    Animated as RNAnimated,
    Platform
} from 'react-native';

const getApiUrl = () => {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
    return 'http://10.254.202.49:5000'; // LAN IP for physical device connection
};
const API_URL = getApiUrl();
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
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
    TrendingUp,
    Plus,
    X,
    Dumbbell,
    Play,
    CheckCircle,
    Clock,
    ChevronRight
} from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeInUp,
    FadeIn,
    SlideInRight
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const DataContext = React.createContext(null);

const { width } = Dimensions.get('window');

export default function App() {
    const [globalData, setGlobalData] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/data/all`)
            .then(res => res.json())
            .then(data => setGlobalData(data))
            .catch(err => {
                console.error("Failed to load global data", err);
                Alert.alert("Server Error", "Could not fetch inventory from backend.");
            });
    }, []);

    if (!globalData) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Activity size={40} color="#FF4500" style={{ marginBottom: 20 }} />
                <Text style={{ color: '#FF4500', fontWeight: '900', letterSpacing: 2 }}>CONNECTING TO APERTURE SERVER...</Text>
            </View>
        );
    }

    return (
        <DataContext.Provider value={globalData}>
            <SafeAreaProvider>
                <MainApp />
            </SafeAreaProvider>
        </DataContext.Provider>
    );
}

/**
 * Main application component handling the state and navigation flow.
 * Supports dual UI modes: Explore (Beginner) and Pro Flow (Advanced).
 */
const BeginnerUI = ({ selectedSport, setSelectedSport }) => {
    const { sports, sportProducts } = React.useContext(DataContext);

    const banners = [
        {
            tag: 'SEASON 2026',
            title: 'ELITE PERFORMANCE',
            btn: 'SHOP NOW',
            colors: ['#FF4B2B', '#FF416C']
        },
        {
            tag: 'LIMITED TIME',
            title: 'SUMMER SALES 50% OFF',
            btn: 'CLAIM OFFER',
            colors: ['#FF8C00', '#FF4500']
        },
        {
            tag: 'MEMBERS ONLY',
            title: 'USE CODE: VOLTPRO26',
            btn: 'APPLY COUPON',
            colors: ['#4169E1', '#0000CD']
        }
    ];
    const scrollRef = useRef(null);
    const [currentBanner, setCurrentBanner] = useState(0);
    const bannerWidth = width - 48; // Full width minus mainContent padding

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => {
                const next = (prev + 1) % banners.length;
                scrollRef.current?.scrollTo({ x: next * bannerWidth, animated: true });
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [bannerWidth, banners.length]);

    const handleScroll = (event) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / bannerWidth);
        if (index !== currentBanner) {
            setCurrentBanner(index);
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.heroBannerContainer}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.heroBanner}
                >
                    {banners.map((banner, index) => (
                        <View key={index} style={{ width: bannerWidth, height: 180 }}>
                            <LinearGradient colors={banner.colors} style={styles.heroGradient}>
                                <View>
                                    <Text style={styles.heroTag}>{banner.tag}</Text>
                                    <Text style={styles.heroTitle}>{banner.title}</Text>
                                    <TouchableOpacity style={styles.heroBtn} onPress={() => Alert.alert('Offer', banner.title)}>
                                        <Text style={styles.heroBtnText}>{banner.btn}</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.dotsContainer}>
                    {banners.map((_, idx) => (
                        <View key={idx} style={[styles.dot, currentBanner === idx && styles.activeDot]} />
                    ))}
                </View>
            </View>

            <View style={styles.categoryHeadingRow}>
                <View>
                    <Text style={styles.catSubTitle}>CHOOSE</Text>
                    <Text style={styles.catSubTitle}>YOUR</Text>
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
                        <TouchableOpacity activeOpacity={0.95} style={styles.miniImageWrapperB} onPress={() => Alert.alert('Product View', item.name)}>
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
};

const AdvancedUI = ({ selectedSport, setSelectedSport, selectedPosition, setSelectedPosition }) => {
    const { sports, sportPositions, positionGear } = React.useContext(DataContext);

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
                        <TouchableOpacity activeOpacity={0.9} onPress={() => Alert.alert('View Gear', item.name)}>
                            <View style={styles.imgWrapper}>
                                <Image source={{ uri: item.image }} style={styles.productImg} />
                                <View style={styles.tagBadge}>
                                    <Text style={styles.tagText}>{item.tag.toUpperCase()}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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

const HomeUI = ({ stats, setStats }) => {
    const [lastIntensity, setLastIntensity] = useState('--');
    const [lastSessionTime, setLastSessionTime] = useState('--');

    const logFeedback = async (level) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_URL}/api/user/workout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ level })
            });
            if (res.ok) {
                const data = await res.json();

                // Update local stats from backend response
                setStats(prev => ({
                    ...prev,
                    score: data.profile.fitnessScore,
                    steps: data.profile.steps,
                    calories: data.profile.calories,
                    level: data.profile.level,
                    xp: data.profile.xp,
                    maxXp: data.profile.maxXp
                }));

                let intensityText = level === 'LIGHT' ? '+2%' : level === 'MODERATE' ? '+10%' : '+24%';
                setLastIntensity(intensityText);
                setLastSessionTime('JUST NOW');

                Alert.alert('Session Logged! ⚡', `Feedback: ${level}\n+${data.added.calories} kcal\n+${data.added.score} Fitness Score`);
            }
        } catch (error) {
            console.error("Failed to log workout: ", error);
            Alert.alert("Network Error", "Could not connect to backend server.");
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.homeTopRow}>
                <View>
                    <Text style={styles.homeGreeting}>WELCOME BACK,</Text>
                    <Text style={styles.homeUser}>{stats.name.toUpperCase()}</Text>
                </View>
                <View style={styles.streakBadge}>
                    <Flame size={18} color="#FF4500" fill="#FF4500" />
                    <Text style={styles.streakText}>{stats.streak} DAY STREAK</Text>
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

            <TouchableOpacity style={styles.upgradeBanner} onPress={() => Alert.alert('Upgrade', 'Volt Pro Access unlocking soon!')}>
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

const ArenaUI = () => {
    const [activeArenaTab, setActiveArenaTab] = useState('ACTIVE');
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        // Fallback fetch
        fetch(`${API_URL}/api/arena/tournaments`)
            .then(res => res.json())
            .then(data => setTournaments(data))
            .catch(console.error);

        // Real-time Socket.io Connection
        const socket = io(API_URL);
        socket.on('arenaUpdate', (liveData) => {
            setTournaments(liveData);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.arenaHeader}>
                <View>
                    <Text style={styles.arenaTag}>THE COLLISEUM</Text>
                    <Text style={styles.arenaTitle}>GLOBAL ARENA</Text>
                </View>
                <TouchableOpacity style={styles.leaderboardBtn} onPress={() => Alert.alert('Leaderboard', 'Global rankings opening soon!')}>
                    <Trophy size={18} color="#FFD700" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.arenaTabs}>
                {['ACTIVE', 'UPCOMING', 'RESULTS', 'CLUBS'].map((tab, idx) => (
                    <TouchableOpacity key={tab} style={[styles.arenaTab, activeArenaTab === tab && styles.arenaTabActive]} onPress={() => setActiveArenaTab(tab)}>
                        <Text style={[styles.arenaTabText, activeArenaTab === tab && styles.arenaTabTextActive]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {tournaments.length === 0 && (
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <Activity size={24} color="#FF4500" />
                    <Text style={{ color: '#666', marginTop: 15, fontWeight: '800' }}>LOADING ARENA EVENTS...</Text>
                </View>
            )}

            {tournaments.map((item, i) => (
                <View key={item.id || i} style={styles.tournCardEnhanced}>
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
};

const ProfileUI = ({ stats, onLogout }) => {
    const xpPercentage = Math.min(100, Math.max(0, (stats.xp / stats.maxXp) * 100));

    return (
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
                <Text style={styles.pName}>{stats.name}</Text>
                <View style={styles.lvlBadge}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.lvlText}>GOLD ATHLETE • LEVEL {stats.level}</Text>
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressTextRow}>
                        <Text style={styles.progressLabel}>NEXT RANK: MASTER</Text>
                        <Text style={styles.progressPercent}>{stats.xp}/{stats.maxXp} XP</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={['#FF4500', '#FF8C00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${xpPercentage}%` }]}
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
                    <TouchableOpacity key={i} style={styles.menuRow} onPress={() => Alert.alert(item.label, 'Opening ' + item.label + '...')}>
                        <View style={styles.menuIconBox}>{item.icon}</View>
                        <Text style={styles.menuRowText}>{item.label}</Text>
                        <Zap size={14} color="#333" />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={[styles.menuRow, { borderColor: '#FF450040', marginTop: 20 }]} onPress={onLogout}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#FF450015' }]}>
                        <User size={18} color="#FF4500" />
                    </View>
                    <Text style={[styles.menuRowText, { color: '#FF4500' }]}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const AuthUI = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const body = isLogin ? { email, password } : { name, email, password };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                onLogin(data.profile);
            } else {
                Alert.alert("Authentication Failed", data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(800)} style={styles.authContainer}>
            <View style={styles.authHeaderBox}>
                <Image source={require('./assets/vlogo.webp')} style={styles.authLogoImg} resizeMode="contain" />
                <Text style={styles.authSubtitle}>THE SPORT UNIVERSE AWAITS</Text>
            </View>

            <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.authFormBox}>
                <Text style={styles.authTabTitle}>{isLogin ? 'LOGIN TO YOUR ACCOUNT' : 'CREATE NEW ATHLETE PROFILE'}</Text>

                {!isLogin && (
                    <RNTextInput
                        style={styles.authInputLine}
                        placeholder="Full Name (e.g., Gautam)"
                        placeholderTextColor="#666"
                        autoCapitalize="words"
                        value={name}
                        onChangeText={setName}
                    />
                )}

                <RNTextInput
                    style={styles.authInputLine}
                    placeholder="Email Address"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <RNTextInput
                    style={styles.authInputLine}
                    placeholder="Secure Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={[styles.authSubmitBtnWrap, isLoading && { opacity: 0.5 }]} onPress={handleAuth} disabled={isLoading}>
                    <LinearGradient colors={['#FF4500', '#FF2E00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.authSubmitGradBar}>
                        <Text style={styles.authSubmitTextStr}>{isLoading ? 'LOADING...' : (isLogin ? 'ENTER ARENA' : 'JOIN THE ELITE')}</Text>
                        <Zap size={16} color="white" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.authToggleClick}>
                    <Text style={styles.authToggleLabel}>
                        {isLogin ? "DON'T HAVE AN ACCOUNT? SIGN UP" : "ALREADY AN ATHLETE? LOG IN"}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const SearchResultsUI = ({ query }) => {
    const { sportProducts, positionGear } = React.useContext(DataContext);

    const allProducts = useMemo(() => {
        let products = [];
        Object.values(sportProducts).forEach(arr => {
            products = [...products, ...arr];
        });
        Object.values(positionGear).forEach(arr => {
            products = [...products, ...arr];
        });

        // Remove duplicates based on ID
        const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());
        return uniqueProducts;
    }, []);

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
        (p.tag && p.tag.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.mainContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>SEARCH RESULTS: {filtered.length}</Text>
            </View>

            <View style={styles.gridContainerB}>
                {filtered.map((item, idx) => (
                    <Animated.View key={item.id} entering={FadeInUp.delay((idx % 10) * 50)} style={styles.miniCardB}>
                        <TouchableOpacity activeOpacity={0.95} style={styles.miniImageWrapperB} onPress={() => Alert.alert('Product View', item.name)}>
                            <Image source={{ uri: item.image }} style={styles.miniImageB} resizeMethod="scale" />
                            {item.brand && (
                                <View style={styles.miniBrandBadge}>
                                    <Text style={styles.miniBrandText}>{item.brand}</Text>
                                </View>
                            )}
                            {item.tag && (
                                <View style={styles.tagBadge}>
                                    <Text style={styles.tagText}>{item.tag.toUpperCase()}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <View style={styles.miniInfoB}>
                            <Text numberOfLines={1} style={styles.miniNameB}>{item.name}</Text>
                            <Text style={styles.miniPriceB}>{item.price}</Text>
                        </View>
                    </Animated.View>
                ))}
                {filtered.length === 0 && (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 50, width: '100%' }}>
                        <Search size={40} color="#333" />
                        <Text style={{ color: '#666', marginTop: 15, fontWeight: '800' }}>NO PRODUCTS FOUND</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const TrainingUI = () => {
    const [activeZone, setActiveZone] = useState('FULL BODY');

    const zones = ['FULL BODY', 'CORE', 'UPPER', 'LOWER', 'HIIT'];

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.arenaHeader}>
                <View>
                    <Text style={styles.arenaTag}>PERFORMANCE LAB</Text>
                    <Text style={styles.arenaTitle}>TRAINING HUB</Text>
                </View>
                <TouchableOpacity style={styles.leaderboardBtn} onPress={() => Alert.alert('My Plan', 'Opening Custom Plan...')}>
                    <Calendar size={18} color="#FFD700" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.arenaTabs}>
                {zones.map((zone, idx) => (
                    <TouchableOpacity key={zone} style={[styles.arenaTab, activeZone === zone && styles.arenaTabActive]} onPress={() => setActiveZone(zone)}>
                        <Text style={[styles.arenaTabText, activeZone === zone && styles.arenaTabTextActive]}>{zone}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </Animated.View>
    );
};

function MainApp() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [activeMode, setActiveMode] = useState('Beginner');
    const [selectedSport, setSelectedSport] = useState('Football');
    const [selectedPosition, setSelectedPosition] = useState('Striker');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPlusMenu, setShowPlusMenu] = useState(false);

    const [stats, setStats] = useState({
        score: 0,
        steps: 0,
        calories: 0,
        streak: 0,
        name: 'LOADING...',
        level: 1,
        xp: 0,
        maxXp: 1000
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;

                const response = await fetch(`${API_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        score: data.fitnessScore,
                        steps: data.steps,
                        calories: data.calories,
                        streak: data.streak,
                        name: data.name,
                        level: data.level,
                        xp: data.xp,
                        maxXp: data.maxXp
                    });
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Failed to fetch profile: ", error);
            }
        };
        fetchProfile();
    }, []);

    const handleLoginSuccess = (profile) => {
        setStats({
            score: profile.fitnessScore,
            steps: profile.steps,
            calories: profile.calories,
            streak: profile.streak,
            name: profile.name,
            level: profile.level,
            xp: profile.xp,
            maxXp: profile.maxXp
        });
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        setIsAuthenticated(false);
        setActiveTab('Home');
        setStats({
            score: 0, steps: 0, calories: 0, streak: 0, name: 'LOADING...', level: 1, xp: 0, maxXp: 1000
        });
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <AuthUI onLogin={handleLoginSuccess} />
            </View>
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
                        <TouchableOpacity style={styles.filterBtn} onPress={() => Alert.alert('Filter', 'Filter options opening soon!')}>
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
                {searchQuery.trim().length > 0 ? (
                    <SearchResultsUI query={searchQuery} />
                ) : (
                    <>
                        {activeTab === 'Home' && <HomeUI stats={stats} setStats={setStats} />}
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
                        {activeTab === 'Training' && <TrainingUI />}
                        {activeTab === 'Profile' && <ProfileUI stats={stats} onLogout={handleLogout} />}
                    </>
                )}
            </ScrollView>

            {showPlusMenu && (
                <TouchableOpacity
                    style={styles.plusMenuOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPlusMenu(false)}
                >
                    <Animated.View entering={FadeInUp.duration(300)} style={styles.plusMenuPopup}>
                        <TouchableOpacity style={styles.plusMenuItem} onPress={() => { setActiveTab('Arena'); setShowPlusMenu(false); }}>
                            <View style={styles.plusMenuIconArea}><Trophy size={20} color="#FFD700" /></View>
                            <Text style={styles.plusMenuLabel}>ARENA</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.plusMenuItem} onPress={() => { setActiveTab('Training'); setShowPlusMenu(false); }}>
                            <View style={styles.plusMenuIconArea}><Dumbbell size={20} color="#4169E1" /></View>
                            <Text style={styles.plusMenuLabel}>TRAINING</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.95)', 'black']} style={styles.bottomNavContainer}>
                <View style={styles.bottomNav}>
                    <NavTab icon={<Home size={24} />} label="HOME" active={activeTab === 'Home'} onPress={() => { setActiveTab('Home'); setShowPlusMenu(false); }} />
                    <NavTab icon={<ShoppingBag size={24} />} label="SHOP" active={activeTab === 'Shop'} onPress={() => { setActiveTab('Shop'); setShowPlusMenu(false); }} />

                    <View style={styles.fabWrapper}>
                        <TouchableOpacity
                            style={styles.fabBtn}
                            onPress={() => setShowPlusMenu(!showPlusMenu)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient colors={showPlusMenu ? ['#333', '#111'] : ['#FF4500', '#FF2E00']} style={styles.fabGrad}>
                                {showPlusMenu ? <X size={24} color="white" /> : <Plus size={24} color="white" />}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <NavTab icon={<User size={24} />} label="PROFILE" active={activeTab === 'Profile'} onPress={() => { setActiveTab('Profile'); setShowPlusMenu(false); }} />
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
    modeTabActive: { backgroundColor: '#4169E1' },
    modeTabActivePro: { backgroundColor: '#FF4500' },
    modeTabText: { color: '#666', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    modeTabTextActive: { color: 'white' },

    scrollContainer: { flex: 1, backgroundColor: '#0a0a0a', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 4 },
    mainContent: { padding: 24, paddingTop: 10 },

    heroBannerContainer: { marginBottom: 20 },
    heroBanner: { height: 180, borderRadius: 30, overflow: 'hidden', marginBottom: 12 },
    dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
    activeDot: { width: 16, backgroundColor: 'white' },
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
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 30, paddingHorizontal: 20 },
    navTab: { alignItems: 'center', width: 60 },
    navText: { fontSize: 9, fontWeight: '900', marginTop: 6, letterSpacing: 1 },

    fabWrapper: { alignItems: 'center', justifyContent: 'center', width: 60 },
    fabBtn: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', marginTop: -35, borderWidth: 3, borderColor: '#0a0a0a' },
    fabGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    plusMenuOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 },
    plusMenuPopup: { width: 140, backgroundColor: '#111', borderRadius: 20, padding: 10, marginBottom: 110, borderWidth: 1, borderColor: '#222', alignItems: 'center' },
    plusMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, width: '100%', borderRadius: 12 },
    plusMenuIconArea: { marginRight: 10 },
    plusMenuLabel: { color: 'white', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

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
    menuRowText: { flex: 1, color: 'white', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

    authContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', padding: 24 },
    authHeaderBox: { alignItems: 'center', marginBottom: 60, marginTop: -40 },
    authLogoImg: { width: 300, height: 100 },
    authSubtitle: { color: '#FF4500', fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: -20 },
    authFormBox: { backgroundColor: '#111', padding: 30, borderRadius: 30, borderWidth: 1, borderColor: '#222' },
    authTabTitle: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1.5, marginBottom: 30, textAlign: 'center' },
    authInputLine: { backgroundColor: '#1a1a1a', color: 'white', fontSize: 14, fontWeight: '700', padding: 18, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    authSubmitBtnWrap: { marginTop: 10, borderRadius: 20, overflow: 'hidden' },
    authSubmitGradBar: { flexDirection: 'row', paddingVertical: 18, justifyContent: 'center', alignItems: 'center' },
    authSubmitTextStr: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
    authToggleClick: { marginTop: 25, alignItems: 'center' },
    authToggleLabel: { color: '#888', fontSize: 9, fontWeight: '900', letterSpacing: 1 }
});
