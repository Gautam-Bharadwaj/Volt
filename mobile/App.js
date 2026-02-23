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
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

const getApiUrl = () => {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
    return 'http://10.254.202.49:5000';
};
const API_URL = getApiUrl();
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
    Play,
    CheckCircle,
    Clock,
    ChevronRight,
    ShoppingCart,
    Dumbbell,
    LogOut
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
    const [cart, setCart] = useState([]);
    const [activeProduct, setActiveProduct] = useState(null);
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

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        Alert.alert('Added to Cart', `${product.name} added to your bag.`);
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, qty: p.qty + delta };
            }
            return p;
        }).filter(p => p.qty > 0));
    };

    const clearCart = () => setCart([]);

    return (
        <DataContext.Provider value={{ ...globalData, cart, addToCart, updateQty, clearCart, activeProduct, setActiveProduct }}>
            <SafeAreaProvider>
                <MainApp />
            </SafeAreaProvider>
        </DataContext.Provider>
    );
}

const BeginnerUI = ({ selectedSport, setSelectedSport }) => {
    const { sports, sportProducts, setActiveProduct } = React.useContext(DataContext);
    const [sortOrder, setSortOrder] = useState('default');

    const sortedProducts = useMemo(() => {
        let products = [...(sportProducts[selectedSport] || [])];
        const getPValue = (item) => {
            if (item.priceValue !== undefined) return item.priceValue;
            if (typeof item.price === 'string') {
                const val = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                return isNaN(val) ? 0 : val;
            }
            return 0;
        };
        if (sortOrder === 'low') {
            products.sort((a, b) => getPValue(a) - getPValue(b));
        } else if (sortOrder === 'high') {
            products.sort((a, b) => getPValue(b) - getPValue(a));
        }
        return products;
    }, [sportProducts, selectedSport, sortOrder]);

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
    const bannerWidth = width - 48;

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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <Text style={styles.sectionTitle}>CURATED FOR {selectedSport.toUpperCase()}</Text>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder === 'low' && styles.sortBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'low' ? 'default' : 'low')}
                    >
                        <Text style={[styles.sortBtnText, sortOrder === 'low' && styles.sortBtnTextActive]}>$ Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder === 'high' && styles.sortBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'high' ? 'default' : 'high')}
                    >
                        <Text style={[styles.sortBtnText, sortOrder === 'high' && styles.sortBtnTextActive]}>$ High</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.gridContainerB}>
                {sortedProducts.map((item, idx) => (
                    <Animated.View key={item.id} entering={FadeInUp.delay((idx % 10) * 50)} style={styles.miniCardB}>
                        <TouchableOpacity activeOpacity={0.95} style={styles.miniImageWrapperB} onPress={() => setActiveProduct(item)}>
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
    const { sports, sportPositions, positionGear, setActiveProduct } = React.useContext(DataContext);
    const [sortOrder, setSortOrder] = useState('default');

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

    const sortedGear = useMemo(() => {
        let items = [...(positionGear[selectedPosition] || positionGear['Striker'] || [])];
        const getPValue = (item) => {
            if (item.priceValue !== undefined) return item.priceValue;
            if (typeof item.price === 'string') {
                const val = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                return isNaN(val) ? 0 : val;
            }
            return 0;
        };
        if (sortOrder === 'low') {
            items.sort((a, b) => getPValue(a) - getPValue(b));
        } else if (sortOrder === 'high') {
            items.sort((a, b) => getPValue(b) - getPValue(a));
        }
        return items;
    }, [positionGear, selectedPosition, sortOrder]);

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

            <View style={[styles.stepHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.stepNumber}>03</Text>
                    <Text style={styles.stepLabel}>PRO RECOMMENDATIONS</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder === 'low' && styles.sortBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'low' ? 'default' : 'low')}
                    >
                        <Text style={[styles.sortBtnText, sortOrder === 'low' && styles.sortBtnTextActive]}>$ Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder === 'high' && styles.sortBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'high' ? 'default' : 'high')}
                    >
                        <Text style={[styles.sortBtnText, sortOrder === 'high' && styles.sortBtnTextActive]}>$ High</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.gearGrid}>
                {sortedGear.map((item, idx) => (
                    <Animated.View key={item.id} entering={SlideInRight.delay((idx % 10) * 150)} style={styles.productCard}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setActiveProduct(item)}>
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
        fetch(`${API_URL}/api/arena/tournaments`)
            .then(res => res.json())
            .then(data => setTournaments(data))
            .catch(console.error);

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

            {activeArenaTab === 'ACTIVE' && (
                <>
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
                                    <LinearGradient colors={['#FF4500', '#FF2E00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.arenaJoinGrad}>
                                        <Text style={styles.arenaJoinText}>ENTER ARENA</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    ))}
                </>
            )}

            {activeArenaTab === 'UPCOMING' && (
                <View style={{ marginTop: 10 }}>
                    {[
                        { title: 'WINTER CHAMPIONSHIP', date: 'STARTS IN 2 DAYS', prize: '$100K' },
                        { title: 'ELITE PRO LEAGUE', date: 'NEXT WEEKEND', prize: '$250K' },
                    ].map((item, i) => (
                        <View key={i} style={styles.tournCardEnhanced}>
                            <LinearGradient colors={['#111', '#050505']} style={styles.tournInnerEnhanced}>
                                <View style={styles.tournMetaRow}>
                                    <View style={[styles.tournBadgeAbs, { backgroundColor: '#FFD700' }]}>
                                        <Text style={styles.tournBadgeText}>{item.date}</Text>
                                    </View>
                                </View>
                                <Text style={styles.tournNameEnhanced}>{item.title}</Text>
                                <Text style={{ color: '#FF4500', fontSize: 16, fontWeight: '900', marginTop: 10 }}>{item.prize} POOL</Text>
                                <TouchableOpacity style={[styles.arenaJoinBtn, { backgroundColor: '#333' }]} onPress={() => Alert.alert('Reminder Set', 'We will notify you!')}>
                                    <View style={styles.arenaJoinGrad}>
                                        <Text style={styles.arenaJoinText}>SET REMINDER</Text>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    ))}
                </View>
            )}

            {activeArenaTab === 'RESULTS' && (
                <View style={{ marginTop: 10 }}>
                    {[
                        { title: 'SUMMER SHOWDOWN', winner: 'TEAM ALPHA', prize: '$50K' },
                        { title: 'STREET MASTERS', winner: 'GAUTAM B. (MVP)', prize: '$10K' },
                    ].map((item, i) => (
                        <View key={i} style={styles.tournCardEnhanced}>
                            <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.tournInnerEnhanced}>
                                <View style={styles.tournMetaRow}>
                                    <View style={[styles.tournBadgeAbs, { backgroundColor: '#4169E1' }]}>
                                        <Text style={styles.tournBadgeText}>COMPLETED</Text>
                                    </View>
                                </View>
                                <Text style={styles.tournNameEnhanced}>{item.title}</Text>
                                <Text style={{ color: '#00FF7F', fontSize: 14, fontWeight: '900', marginTop: 10 }}>WINNER: {item.winner}</Text>
                            </LinearGradient>
                        </View>
                    ))}
                </View>
            )}

            {activeArenaTab === 'CLUBS' && (
                <View style={{ marginTop: 60, alignItems: 'center' }}>
                    <Shield size={60} color="#4169E1" />
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: '900', marginTop: 20 }}>CLUB HOUSES</Text>
                    <Text style={{ color: '#666', marginTop: 10, fontWeight: '800' }}>Form your squad and dominate.</Text>
                    <TouchableOpacity style={[styles.arenaJoinBtn, { width: 200, marginTop: 40 }]} onPress={() => Alert.alert('Clubs', 'Coming in v1.2')}>
                        <LinearGradient colors={['#4169E1', '#00008B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.arenaJoinGrad}>
                            <Text style={styles.arenaJoinText}>FORM A CLUB</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

/**
 * ProfileUI: Restored with original feature set
 */
const ProfileUI = ({ stats, handleLogout }) => {
    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.profileHeaderAlt}>
                <View style={styles.profileInfoAlt}>
                    <View style={styles.profilePicBox}>
                        <User size={30} color="white" />
                        <View style={styles.onlineStatus} />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.profileNameAlt}>{stats.name.toUpperCase()}</Text>
                        <View style={styles.levelRow}>
                            <Zap size={12} color="#FFD700" />
                            <Text style={styles.levelLabelAlt}>LEVEL {stats.level} ELITE</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.settingsBtn} onPress={handleLogout}>
                    <Text style={styles.settingsBtnText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.xpBoxAlt}>
                <View style={styles.xpTextRow}>
                    <Text style={styles.xpLabelAlt}>GLOBAL RANK XP</Text>
                    <Text style={styles.xpValAlt}>{stats.xp} / {stats.maxXp}</Text>
                </View>
                <View style={styles.xpBarBgAlt}>
                    <LinearGradient
                        colors={['#FF4500', '#FF8C00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.xpBarFillAlt, { width: `${(stats.xp / stats.maxXp) * 100}%` }]}
                    />
                </View>
            </View>

            <View style={styles.statGridAlt}>
                {[
                    { label: 'CALORIES', val: stats.calories, icon: <Activity size={16} color="#FF4500" /> },
                    { label: 'SQUAD', val: 'ALPHA', icon: <Shield size={16} color="#4169E1" /> },
                    { label: 'TROPHIES', val: '12', icon: <Trophy size={16} color="#FFD700" /> },
                    { label: 'STREAK', val: `${stats.streak}D`, icon: <Flame size={16} color="#FF8C00" /> }
                ].map((item, i) => (
                    <View key={i} style={styles.statCardAlt}>
                        {item.icon}
                        <Text style={styles.statValAlt}>{item.val}</Text>
                        <Text style={styles.statLabAlt}>{item.label}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>MY ACHIEVEMENTS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {[
                    { title: 'EARLY BIRD', color: '#FFD700' },
                    { title: 'STREAK MASTER', color: '#FF4500' },
                    { title: 'VOLT ELITE', color: '#4169E1' },
                    { title: 'GEAR HEAD', color: '#00FF7F' }
                ].map((ach, i) => (
                    <View key={i} style={styles.achieveCard}>
                        <Award size={24} color={ach.color} />
                        <Text style={styles.achieveTitle}>{ach.title}</Text>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.vaultEntry} onPress={() => Alert.alert('Vault', 'Access encrypted Gear Vault?')}>
                <Shield size={20} color="#666" />
                <Text style={styles.vaultText}>ACCESS SECURE GEAR VAULT</Text>
                <ChevronRight size={18} color="#666" />
            </TouchableOpacity>
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
    const { sportProducts, positionGear, setActiveProduct } = React.useContext(DataContext);
    const [sortOrder, setSortOrder] = useState('default');

    const allProducts = useMemo(() => {
        let products = [];
        Object.values(sportProducts).forEach(arr => {
            products = [...products, ...arr];
        });
        Object.values(positionGear).forEach(arr => {
            products = [...products, ...arr];
        });

        const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());
        return uniqueProducts;
    }, [sportProducts, positionGear]);

    const sorted = useMemo(() => {
        let products = allProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
            (p.tag && p.tag.toLowerCase().includes(query.toLowerCase()))
        );
        const getPValue = (item) => {
            if (item.priceValue !== undefined) return item.priceValue;
            if (typeof item.price === 'string') {
                const val = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                return isNaN(val) ? 0 : val;
            }
            return 0;
        };
        if (sortOrder === 'low') {
            products.sort((a, b) => getPValue(a) - getPValue(b));
        } else if (sortOrder === 'high') {
            products.sort((a, b) => getPValue(b) - getPValue(a));
        }
        return products;
    }, [allProducts, query, sortOrder]);

    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.mainContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>SEARCH RESULTS: {sorted.length}</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder === 'low' && styles.sortBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'low' ? 'default' : 'low')}
                    >
                        <Text style={[styles.sortBtnText, sortOrder === 'low' && styles.sortBtnTextActive]}>$ Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder === 'high' && styles.sortBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'high' ? 'default' : 'high')}
                    >
                        <Text style={[styles.sortBtnText, sortOrder === 'high' && styles.sortBtnTextActive]}>$ High</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.gridContainerB}>
                {sorted.map((item, idx) => (
                    <Animated.View key={item.id} entering={FadeInUp.delay((idx % 10) * 50)} style={styles.miniCardB}>
                        <TouchableOpacity activeOpacity={0.95} style={styles.miniImageWrapperB} onPress={() => setActiveProduct(item)}>
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
                {sorted.length === 0 && (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 50, width: '100%' }}>
                        <Search size={40} color="#333" />
                        <Text style={{ color: '#666', marginTop: 15, fontWeight: '800' }}>NO PRODUCTS FOUND</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const TrainingUI = ({ streak }) => {
    const [activeZone, setActiveZone] = useState('FULL BODY');
    const [activeDrill, setActiveDrill] = useState(null);
    const [timerState, setTimerState] = useState('IDLE');
    const [elapsed, setElapsed] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);

    const zones = ['FULL BODY', 'CORE', 'UPPER', 'LOWER', 'HIIT'];

    useEffect(() => {
        let interval;
        if (timerState === 'RUNNING') {
            interval = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerState]);

    useEffect(() => {
        setTimerState('IDLE');
        setElapsed(0);
    }, [activeDrill]);

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const trainingData = {
        'FULL BODY': {
            hero: { title: 'TOTAL BODY ANNIHILATOR', duration: '55 MINS', sub: 'Compound Movements', tag: 'INTENSE' },
            drills: [
                { title: 'Explosive Pushups', desc: '3 Sets • 12 Reps', icon: <Flame size={16} color="#FF4500" /> },
                { title: 'Jump Squats', desc: '4 Sets • 15 Reps', icon: <Activity size={16} color="#00FF7F" /> },
                { title: 'Burpee Broad Jumps', desc: '3 Sets • 10 Reps', icon: <TrendingUp size={16} color="#FFD700" /> },
            ]
        },
        'CORE': {
            hero: { title: 'CORE SHREDDER', duration: '20 MINS', sub: 'Abs & Obliques', tag: 'FOCUSED' },
            drills: [
                { title: 'Core Stabilizer Plank', desc: '3 Sets • 60 Secs', icon: <Shield size={16} color="#4169E1" /> },
                { title: 'Russian Twists', desc: '4 Sets • 20 Reps', icon: <CheckCircle size={16} color="#00FF7F" /> },
                { title: 'Hanging Leg Raises', desc: '3 Sets • 12 Reps', icon: <Flame size={16} color="#FF4500" /> },
            ]
        },
        'UPPER': {
            hero: { title: 'UPPER BODY BLAST', duration: '45 MINS', sub: 'Chest, Shoulders & Triceps', tag: 'POWER' },
            drills: [
                { title: 'Incline Dumbbell Press', desc: '4 Sets • 10 Reps', icon: <Dumbbell size={16} color="#FF4500" /> },
                { title: 'Overhead Press', desc: '4 Sets • 8 Reps', icon: <TrendingUp size={16} color="#FFD700" /> },
                { title: 'Tricep Dips', desc: '3 Sets • 15 Reps', icon: <Activity size={16} color="#00FF7F" /> },
            ]
        },
        'LOWER': {
            hero: { title: 'LOWER BODY CRUSH', duration: '50 MINS', sub: 'Quads, Glutes & Hamstrings', tag: 'HEAVY' },
            drills: [
                { title: 'Barbell Squats', desc: '4 Sets • 8 Reps', icon: <Shield size={16} color="#4169E1" /> },
                { title: 'Romanian Deadlifts', desc: '4 Sets • 10 Reps', icon: <Flame size={16} color="#FF4500" /> },
                { title: 'Walking Lunges', desc: '3 Sets • 20 Steps', icon: <Activity size={16} color="#00FF7F" /> },
            ]
        },
        'HIIT': {
            hero: { title: 'CARDIO BURNER', duration: '30 MINS', sub: 'High Intensity Intervals', tag: 'EXTREME' },
            drills: [
                { title: 'Mountain Climbers', desc: '4 Sets • 45 Secs', icon: <Activity size={16} color="#00FF7F" /> },
                { title: 'Kettlebell Swings', desc: '4 Sets • 20 Reps', icon: <Flame size={16} color="#FF4500" /> },
                { title: 'Battle Ropes', desc: '3 Sets • 30 Secs', icon: <TrendingUp size={16} color="#FFD700" /> },
            ]
        }
    };

    const currentData = trainingData[activeZone];

    if (activeDrill) {
        return (
            <Animated.View entering={FadeIn.duration(400)} style={styles.drillActiveWrapper}>
                <TouchableOpacity style={styles.drillBackWrap} onPress={() => setActiveDrill(null)}>
                    <ChevronRight size={24} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
                    <Text style={styles.drillBackText}>BACK TO LAB</Text>
                </TouchableOpacity>

                <View style={styles.drillPlayingCenter}>
                    <View style={styles.drillBigIconContainer}>
                        {React.cloneElement(activeDrill.icon, { size: 60, color: '#FF4500' })}
                    </View>
                    <Text style={styles.drillActiveTitle}>{activeDrill.title.toUpperCase()}</Text>
                    <Text style={styles.drillActiveTarget}>{activeDrill.desc}</Text>

                    <View style={styles.timerMockBox}>
                        <Clock size={20} color={timerState === 'IDLE' ? '#888' : '#FFD700'} />
                        <Text style={[styles.timerMockText, timerState === 'RUNNING' && { color: '#FFD700' }]}>
                            {formatTime(elapsed)}
                        </Text>
                    </View>

                    <View style={styles.drillControlsRow}>
                        {timerState !== 'RUNNING' ? (
                            <TouchableOpacity style={[styles.drillCtrlBtn, { backgroundColor: '#FF4500' }]} onPress={() => setTimerState('RUNNING')}>
                                <Play size={20} color="white" fill="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.drillCtrlBtn, { backgroundColor: '#FF8C00' }]} onPress={() => setTimerState('PAUSED')}>
                                <Text style={styles.drillPauseIcon}>||</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.drillCtrlBtn, { backgroundColor: '#cc0000' }]} onPress={() => { setTimerState('IDLE'); setElapsed(0); }}>
                            <View style={styles.drillStopIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.drillCompleteBtn}
                    onPress={() => {
                        Alert.alert('Session Complete! 🏆', `+10 XP added. Duration: ${formatTime(elapsed)}`);
                        setActiveDrill(null);
                    }}
                >
                    <LinearGradient colors={['#00FF7F', '#00b359']} style={styles.drillCompleteGrad}>
                        <Text style={styles.drillCompleteText}>FINISH DRILL</Text>
                        <CheckCircle size={20} color="white" style={{ marginLeft: 10 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    }



    if (showCalendar) {
        return (
            <Animated.View entering={FadeIn.duration(400)} style={styles.drillActiveWrapper}>
                <TouchableOpacity style={styles.drillBackWrap} onPress={() => setShowCalendar(false)}>
                    <ChevronRight size={24} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
                    <Text style={styles.drillBackText}>BACK TO LAB</Text>
                </TouchableOpacity>

                <View style={styles.drillPlayingCenter}>
                    <View style={styles.drillBigIconContainer}>
                        <Calendar size={60} color="#FFD700" />
                    </View>
                    <Text style={styles.drillActiveTitle}>DAILY STREAK</Text>

                    <View style={[styles.timerMockBox, { flexDirection: 'column', paddingVertical: 20 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Flame size={40} color="#FF4500" fill="#FF4500" />
                            <Text style={{ color: 'white', fontSize: 40, fontWeight: '900', marginLeft: 15, letterSpacing: 2 }}>{streak}</Text>
                        </View>
                        <Text style={{ color: '#FFD700', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 }}>DAYS IN A ROW</Text>
                    </View>

                    <Text style={{ color: '#888', marginTop: 25, fontSize: 13, fontWeight: '700', textAlign: 'center', width: '80%', lineHeight: 20 }}>
                        Keep training every day to increase your streak and unlock exclusive gear & XP multipliers!
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.drillCompleteBtn}
                    onPress={() => setShowCalendar(false)}
                >
                    <LinearGradient colors={['#FF4500', '#FF2E00']} style={styles.drillCompleteGrad}>
                        <Text style={styles.drillCompleteText}>RETURN TO TRAINING</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.mainContent}>
            <View style={styles.arenaHeader}>
                <View>
                    <Text style={styles.arenaTag}>PERFORMANCE LAB</Text>
                    <Text style={styles.arenaTitle}>TRAINING HUB</Text>
                </View>
                <TouchableOpacity style={styles.leaderboardBtn} onPress={() => setShowCalendar(true)}>
                    <Calendar size={18} color="#FFD700" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.arenaTabs}>
                {zones.map((zone) => (
                    <TouchableOpacity key={zone} style={[styles.arenaTab, activeZone === zone && styles.arenaTabActive]} onPress={() => setActiveZone(zone)}>
                        <Text style={[styles.arenaTabText, activeZone === zone && styles.arenaTabTextActive]}>{zone}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>SESSION OF THE DAY</Text>
            <TouchableOpacity style={styles.trainHeroCard} onPress={() => Alert.alert('Start Session', `Loading ${currentData.hero.title}...`)}>
                <LinearGradient colors={['#FF450020', '#111']} style={styles.trainHeroGrad}>
                    <View style={styles.trainHeroHeader}>
                        <View style={styles.trainTagBadge}>
                            <Text style={styles.trainTagText}>{currentData.hero.tag}</Text>
                        </View>
                        <Text style={styles.trainDuration}>{currentData.hero.duration}</Text>
                    </View>
                    <Text style={styles.trainHeroTitle}>{currentData.hero.title}</Text>
                    <View style={styles.trainHeroFooter}>
                        <Text style={styles.trainHeroSub}>{currentData.hero.sub}</Text>
                        <View style={styles.playBtnCirc}>
                            <Play size={16} color="black" fill="black" />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>PRO DRILLS</Text>
            {currentData.drills.map((drill, idx) => (
                <View key={idx} style={styles.drillRow}>
                    <View style={styles.drillIconArea}>{drill.icon}</View>
                    <View style={styles.drillInfo}>
                        <Text style={styles.drillTitle}>{drill.title}</Text>
                        <Text style={styles.drillDesc}>{drill.desc}</Text>
                    </View>
                    <TouchableOpacity style={styles.drillActionBtn} onPress={() => setActiveDrill(drill)}>
                        <ChevronRight size={18} color="#FF4500" />
                    </TouchableOpacity>
                </View>
            ))}

        </Animated.View>
    );
};

const CartUI = ({ onClose }) => {
    const { cart, updateQty, clearCart } = React.useContext(DataContext);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const subtotal = cart.reduce((acc, item) => {
        const p = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        return acc + p * item.qty;
    }, 0);

    const total = discount > 0 ? subtotal * (1 - discount) : subtotal;

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'VOLTPRO26') {
            setDiscount(0.20);
            Alert.alert('Coupon Applied!', '20% OFF Volt Pro 26 discount added!');
        } else {
            Alert.alert('Invalid Coupon', 'That coupon code does not exist.');
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.cartPremiumOverlay}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.cartPremiumHeader}>
                    <TouchableOpacity style={styles.cartPremiumBack} onPress={onClose}>
                        <ChevronRight size={28} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text style={styles.cartPremiumTitle}>YOUR GEAR BAG</Text>
                    <View style={{ width: 28 }} />
                </View>

                {cart.length === 0 ? (
                    <View style={styles.cartEmptyContainer}>
                        <ShoppingCart size={80} color="#333" />
                        <Text style={styles.cartEmptyText}>YOUR BAG IS EMPTY</Text>
                        <Text style={styles.cartEmptySub}>Time to load up on elite equipment.</Text>
                        <TouchableOpacity style={styles.cartContinueBtn} onPress={onClose}>
                            <Text style={styles.cartContinueText}>BROWSE SHOP</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <ScrollView style={styles.cartPremiumList} showsVerticalScrollIndicator={false}>
                            {cart.map((item, idx) => (
                                <Animated.View entering={FadeInUp.delay(idx * 100)} key={item.id} style={styles.cartPremiumCard}>
                                    <View style={styles.cartPremiumImgBox}>
                                        <Image source={{ uri: item.image }} style={styles.cartPremiumImg} resizeMode="cover" />
                                    </View>
                                    <View style={styles.cartPremiumInfo}>
                                        {item.brand && <Text style={styles.cartPremiumBrand}>{item.brand.toUpperCase()}</Text>}
                                        <Text style={styles.cartPremiumName} numberOfLines={2}>{item.name}</Text>
                                        <Text style={styles.cartPremiumPrice}>{item.price}</Text>

                                        <View style={styles.cartPremiumQtyRow}>
                                            <TouchableOpacity onPress={() => updateQty(item.id, -1)} style={styles.qtyPremiumBtn}>
                                                <Text style={styles.qtyPremiumBtnText}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.qtyPremiumVal}>{item.qty}</Text>
                                            <TouchableOpacity onPress={() => updateQty(item.id, 1)} style={styles.qtyPremiumBtn}>
                                                <Text style={styles.qtyPremiumBtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Animated.View>
                            ))}
                        </ScrollView>

                        <View style={styles.cartPremiumFooter}>
                            <View style={styles.couponRow}>
                                <RNTextInput
                                    style={styles.couponInput}
                                    placeholder="Enter Coupon Code"
                                    placeholderTextColor="#666"
                                    value={couponCode}
                                    onChangeText={setCouponCode}
                                />
                                <TouchableOpacity style={styles.couponBtn} onPress={handleApplyCoupon}>
                                    <Text style={styles.couponBtnText}>APPLY</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cartSummaryRow}>
                                <Text style={styles.cartSummaryLabel}>SUBTOTAL</Text>
                                <Text style={styles.cartSummaryVal}>${subtotal.toFixed(2)}</Text>
                            </View>
                            {discount > 0 && (
                                <View style={styles.cartSummaryRow}>
                                    <Text style={styles.cartSummaryLabel}>DISCOUNT (20%)</Text>
                                    <Text style={[styles.cartSummaryVal, { color: '#00FF7F' }]}>-${(subtotal * discount).toFixed(2)}</Text>
                                </View>
                            )}
                            <View style={styles.cartSummaryRow}>
                                <Text style={styles.cartSummaryLabel}>SHIPPING (ELITE)</Text>
                                <Text style={styles.cartSummaryVal}>FREE</Text>
                            </View>
                            <View style={[styles.cartSummaryRow, { marginTop: 15, borderTopWidth: 1, borderColor: '#333', paddingTop: 15 }]}>
                                <Text style={styles.cartSummaryTotalLabel}>TOTAL</Text>
                                <Text style={styles.cartSummaryTotalVal}>${total.toFixed(2)}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.cartPremiumCheckoutBtn}
                                onPress={() => {
                                    Alert.alert('Checkout Complete', 'Your gear will arrive in 2 days!');
                                    clearCart();
                                    onClose();
                                }}
                            >
                                <LinearGradient colors={['#FF4500', '#FF2E00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cartPremiumCheckGrad}>
                                    <Text style={styles.cartPremiumCheckText}>SECURE CHECKOUT</Text>
                                    <Shield size={18} color="white" style={{ marginLeft: 8 }} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </Animated.View>
    );
};

const ProductDetailUI = ({ product, onClose }) => {
    const { addToCart } = React.useContext(DataContext);

    return (
        <Animated.View entering={FadeIn.duration(300)} style={styles.prodDetailOverlay}>
            <View style={styles.prodDetailHeader}>
                <TouchableOpacity style={styles.prodDetailBack} onPress={onClose}>
                    <ChevronRight size={28} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.prodDetailImgArea}>
                    <Image source={{ uri: product.image }} style={styles.prodDetailImg} resizeMode="cover" />
                </View>
                <View style={styles.prodDetailInfoArea}>
                    {product.brand && <Text style={styles.prodDetailBrand}>{product.brand.toUpperCase()}</Text>}
                    <Text style={styles.prodDetailName}>{product.name}</Text>
                    <Text style={styles.prodDetailPrice}>{product.price}</Text>

                    <Text style={styles.prodDetailDesc}>
                        Engineered for elite performance. Experience unprecedented stability and comfort with latest breakthrough material tech. Designed to outlast and outperform on every level.
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.prodDetailBottomNav}>
                <TouchableOpacity style={styles.prodDetailAddCartBtn} onPress={() => addToCart(product)}>
                    <Text style={styles.prodDetailAddCartText}>ADD TO CART</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.prodDetailBuyBtn} onPress={() => {
                    addToCart(product);
                    Alert.alert('Checkout Navigation', 'Assuming you want to buy immediate, added to cart and taking to checkout!');
                    onClose();
                }}>
                    <LinearGradient colors={['#FF4500', '#FF2E00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.prodDetailBuyGrad}>
                        <Text style={styles.prodDetailBuyText}>BUY NOW</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const OnboardingUI = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const slides = [
        {
            subtitle: "INTRODUCING VOLT",
            title: "Performance Tracking",
            desc: "Monitor your athletic progress with real-time biometric analysis and milestone tracking to reach peak performance.",
            colors: ['#FF4500', '#FF8C00']
        },
        {
            subtitle: "ELITE EQUIPMENT",
            title: "Pro Tier Gear",
            desc: "Access exclusive elite equipment curated by pro athletes to enhance your discipline and results.",
            colors: ['#4169E1', '#0000CD']
        },
        {
            subtitle: "GLOBAL ARENA",
            title: "Compete Digitally",
            desc: "Join tournaments, form squads, and dominate the leaderboard in the most advanced sports ecosystem.",
            colors: ['#FFD700', '#FFA500']
        }
    ];

    const current = slides[step];

    return (
        <View style={styles.obContainer}>
            <StatusBar style="light" />
            <View style={styles.obAppMockArea}>
                <Animated.View
                    key={step}
                    entering={FadeIn.duration(600)}
                    style={[styles.obPhoneFrame, { borderColor: current.colors[0] + '30' }]}
                >
                    <View style={styles.obPhoneScreen}>
                        <View style={styles.mockInnerHeader}>
                            <View style={{ width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 15 }} />
                        </View>

                        {step === 0 && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mockSub}>ACTIVITY</Text>
                                <View style={styles.mockCard}>
                                    <Activity size={16} color="#FF4500" />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.mockCardTitle}>Heart Rate</Text>
                                        <Text style={styles.mockCardSub}>142 BPM • PEAK</Text>
                                    </View>
                                </View>
                                <View style={[styles.mockCard, { marginTop: 10 }]}>
                                    <Zap size={16} color="#FFD700" />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.mockCardTitle}>Energy Level</Text>
                                        <Text style={styles.mockCardSub}>85% • RECHARGING</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20, height: 100, backgroundColor: '#111', borderRadius: 15, padding: 15 }}>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'flex-end', height: '100%' }}>
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <View key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 3 ? '#FF4500' : '#333', borderRadius: 4 }} />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}

                        {step === 1 && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mockSub}>SHOP ELITE</Text>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1, height: 120, backgroundColor: '#111', borderRadius: 15, padding: 10 }}>
                                        <View style={{ width: '100%', height: '60%', backgroundColor: '#1a1a1a', borderRadius: 10 }} />
                                        <View style={{ width: '80%', height: 8, backgroundColor: '#333', marginTop: 10, borderRadius: 4 }} />
                                        <View style={{ width: '40%', height: 8, backgroundColor: '#FF4500', marginTop: 5, borderRadius: 4 }} />
                                    </View>
                                    <View style={{ flex: 1, height: 120, backgroundColor: '#111', borderRadius: 15, padding: 10 }}>
                                        <View style={{ width: '100%', height: '60%', backgroundColor: '#1a1a1a', borderRadius: 10 }} />
                                        <View style={{ width: '80%', height: 8, backgroundColor: '#333', marginTop: 10, borderRadius: 4 }} />
                                        <View style={{ width: '40%', height: 8, backgroundColor: '#FF4500', marginTop: 5, borderRadius: 4 }} />
                                    </View>
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mockSub}>ARENA RANKING</Text>
                                {[1, 2, 3].map((item) => (
                                    <View key={item} style={[styles.mockCard, { marginBottom: 10 }]}>
                                        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: item === 1 ? '#FFD700' : '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: item === 1 ? 'black' : 'white', fontWeight: '900' }}>{item}</Text>
                                        </View>
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={styles.mockCardTitle}>{item === 1 ? 'Gautam B.' : 'User_' + item}</Text>
                                            <Text style={styles.mockCardSub}>{12000 - item * 500} pts</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </Animated.View>
            </View>

            <View style={styles.obContentArea}>
                <Text style={[styles.obSubtitle, { color: current.colors[0] }]}>{current.subtitle}</Text>
                <Text style={styles.obTitle}>{current.title}</Text>
                <Text style={styles.obDesc}>{current.desc}</Text>

                <View style={styles.obDotsRow}>
                    {slides.map((_, i) => (
                        <View key={i} style={[styles.obDot, step === i && styles.obDotActive]} />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.obMainBtn}
                    onPress={() => {
                        if (step < slides.length - 1) setStep(step + 1);
                        else onComplete();
                    }}
                >
                    <LinearGradient
                        colors={['#FF4500', '#FF2E00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.obMainBtn, { shadowColor: '#FF4500' }]}
                    >
                        <Text style={styles.obMainBtnText}>{step === slides.length - 1 ? 'GET STARTED' : 'CONTINUE'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- AUTH & MAIN APP ---
function MainApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [activeMode, setActiveMode] = useState('Beginner');
    const [selectedSport, setSelectedSport] = useState('Football');
    const [selectedPosition, setSelectedPosition] = useState('Striker');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPlusMenu, setShowPlusMenu] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showCart, setShowCart] = useState(false);

    // Onboarding Persistence
    const completeOnboarding = async () => {
        await AsyncStorage.setItem('hasBoarded', 'true');
        setShowOnboarding(false);
    };

    const { cart, activeProduct, setActiveProduct } = React.useContext(DataContext);
    const totalQty = cart ? cart.reduce((acc, item) => acc + item.qty, 0) : 0;

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

    useEffect(() => {
        const checkBoarding = async () => {
            const hasBoarded = await AsyncStorage.getItem('hasBoarded');
            if (hasBoarded !== 'true') {
                setShowOnboarding(true);
            }
        };
        checkBoarding();
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
                        <TouchableOpacity style={[styles.topIconBtn, styles.streakHeaderBadge]} onPress={() => Alert.alert('Daily Streak', `You are on a ${stats.streak} day streak!`)}>
                            <Flame size={16} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.streakHeaderText}>{stats.streak}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topIconBtn} onPress={() => setShowCart(true)}>
                            <View>
                                <ShoppingCart size={24} color="white" />
                                {totalQty > 0 && (
                                    <View style={styles.cartBadgeNumWrap}>
                                        <Text style={styles.cartBadgeNumText}>{totalQty}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topIconBtn} onPress={() => Alert.alert('Notifications', 'Your gear is on its way!')}>
                            <Bell size={24} color="white" />
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
                        {activeTab === 'Training' && <TrainingUI streak={stats.streak} />}
                        {activeTab === 'Profile' && <ProfileUI stats={stats} handleLogout={handleLogout} />}
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

            {showOnboarding && <OnboardingUI onComplete={completeOnboarding} />}
            {activeProduct && <ProductDetailUI product={activeProduct} onClose={() => setActiveProduct(null)} />}
            {showCart && <CartUI onClose={() => setShowCart(false)} />}

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

            {showCart && <CartUI onClose={() => setShowCart(false)} />}
        </View>
    );
}

const NavTab = ({ icon, label, active, onPress }) => (
    <TouchableOpacity style={styles.navTab} onPress={onPress}>
        {React.cloneElement(icon, { color: active ? '#FF4500' : '#888', strokeWidth: active ? 2.5 : 2 })}
        <Text style={[styles.navText, { color: active ? 'white' : '#888' }]}>{label}</Text>
    </TouchableOpacity>
);

// --- STYLESHEET ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },

    headerArea: { backgroundColor: 'black', paddingBottom: 5 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 4 },
    logoGroup: { height: 90, width: 240, justifyContent: 'center', marginLeft: -35 },
    logoImage: { width: '100%', height: '100%' },
    topIcons: { flexDirection: 'row', alignItems: 'center' },
    topIconBtn: { marginLeft: 15 },
    streakHeaderBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD70020', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: '#FFD70050' },
    streakHeaderText: { color: '#FFD700', fontSize: 13, fontWeight: '900', marginLeft: 6 },

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
    navTab: { alignItems: 'center', width: 60, justifyContent: 'center' },
    navText: { fontSize: 9, fontWeight: '900', marginTop: 6, letterSpacing: 1 },

    obContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', paddingHorizontal: 24, paddingTop: 60, zIndex: 1000 },
    obAppMockArea: { flex: 0.6, justifyContent: 'center', alignItems: 'center' },
    obPhoneFrame: {
        width: width * 0.7,
        height: width * 1.3,
        backgroundColor: '#0a0a0a',
        borderRadius: 40,
        borderWidth: 8,
        borderColor: '#1a1a1a',
        padding: 16,
        shadowColor: '#FF4500',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20
    },
    obPhoneScreen: { flex: 1, backgroundColor: '#000', borderRadius: 24, padding: 12 },
    mockInnerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    mockHeaderText: { color: 'white', fontSize: 18, fontWeight: '800' },
    mockHeaderUser: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
    mockSub: { color: '#666', fontSize: 10, fontWeight: '700', marginBottom: 8, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
    mockCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        padding: 10,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#111'
    },
    mockCardIcon: { width: 28, height: 28, backgroundColor: '#111', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    mockCardTitle: { color: 'white', fontSize: 12, fontWeight: '700' },
    mockCardSub: { color: '#444', fontSize: 9 },

    obContentArea: { flex: 0.4, alignItems: 'center', paddingBottom: 40, width: '100%' },
    obSubtitle: { color: '#888', fontSize: 12, fontWeight: '900', marginBottom: 10, letterSpacing: 2 },
    obTitle: { color: 'white', fontSize: 34, fontWeight: '900', textAlign: 'center', marginBottom: 15, letterSpacing: -1 },
    obDesc: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20, marginBottom: 35, fontWeight: '600' },
    obDotsRow: { flexDirection: 'row', marginBottom: 35 },
    obDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#222', marginHorizontal: 5 },
    obDotActive: { backgroundColor: 'white', width: 24 },
    obMainBtn: {
        width: '100%',
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10
    },
    obMainBtnText: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
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

    trainHeroCard: { borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: '#FF450050', marginBottom: 35 },
    trainHeroGrad: { padding: 24, minHeight: 180, justifyContent: 'space-between' },
    trainHeroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    trainTagBadge: { backgroundColor: '#FF4500', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    trainTagText: { color: 'white', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    trainDuration: { color: '#FF4500', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    trainHeroTitle: { color: 'white', fontSize: 26, fontWeight: '900', width: '70%', marginTop: 20 },
    trainHeroFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15 },
    trainHeroSub: { color: '#888', fontSize: 11, fontWeight: '700' },
    playBtnCirc: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF4500', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

    drillRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 18, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1a1a1a' },
    drillIconArea: { width: 44, height: 44, borderRadius: 18, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    drillInfo: { flex: 1 },
    drillTitle: { color: 'white', fontSize: 13, fontWeight: '800', marginBottom: 4 },
    drillDesc: { color: '#666', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    drillActionBtn: { padding: 10, backgroundColor: '#FF450015', borderRadius: 12 },

    drillActiveWrapper: { flex: 1, padding: 24, paddingTop: 40, justifyContent: 'space-between', minHeight: Dimensions.get('window').height * 0.75 },
    drillBackWrap: { flexDirection: 'row', alignItems: 'center' },
    drillBackText: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1.5, marginLeft: 10 },
    drillPlayingCenter: { alignItems: 'center', marginTop: 40 },
    drillBigIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF450015', justifyContent: 'center', alignItems: 'center', marginBottom: 30, borderWidth: 2, borderColor: '#FF450040' },
    drillActiveTitle: { color: 'white', fontSize: 28, fontWeight: '900', textAlign: 'center', width: '80%' },
    drillActiveTarget: { color: '#FF4500', fontSize: 14, fontWeight: '900', marginTop: 10, letterSpacing: 1 },
    timerMockBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 40, borderWidth: 1, borderColor: '#222' },
    timerMockText: { color: 'white', fontSize: 24, fontWeight: '900', marginLeft: 10, letterSpacing: 2 },

    drillControlsRow: { flexDirection: 'row', marginTop: 30, gap: 20 },
    drillCtrlBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    drillPauseIcon: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
    drillStopIcon: { width: 16, height: 16, backgroundColor: 'white', borderRadius: 2 },

    drillCompleteBtn: { width: '100%', borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
    drillCompleteGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18 },
    drillCompleteText: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },

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
    authToggleLabel: { color: '#888', fontSize: 9, fontWeight: '900', letterSpacing: 1 },

    cartBadgeNumWrap: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF4500', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    cartBadgeNumText: { color: 'white', fontSize: 9, fontWeight: '900' },
    cartPremiumOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', zIndex: 100 },
    cartPremiumHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
    cartPremiumBack: { padding: 5 },
    cartPremiumTitle: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
    cartEmptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    cartEmptyText: { color: 'white', fontSize: 20, fontWeight: '900', letterSpacing: 1.5, marginTop: 25 },
    cartEmptySub: { color: '#666', fontSize: 12, fontWeight: '700', marginTop: 10, textAlign: 'center' },
    cartContinueBtn: { marginTop: 30, backgroundColor: '#FF4500', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
    cartContinueText: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    cartPremiumList: { padding: 20, paddingTop: 10 },
    cartPremiumCard: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 24, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#222' },
    cartPremiumImgBox: { width: 90, height: 90, borderRadius: 16, backgroundColor: '#1a1a1a', overflow: 'hidden', marginRight: 15 },
    cartPremiumImg: { width: '100%', height: '100%' },
    cartPremiumInfo: { flex: 1, justifyContent: 'center' },
    cartPremiumBrand: { color: '#FF4500', fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
    cartPremiumName: { color: 'white', fontSize: 14, fontWeight: '800', marginBottom: 8, lineHeight: 20 },
    cartPremiumPrice: { color: '#FFD700', fontSize: 15, fontWeight: '900' },
    cartPremiumQtyRow: { flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1a1a1a', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
    qtyPremiumBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222', borderRadius: 8 },
    qtyPremiumBtnText: { color: 'white', fontSize: 14, fontWeight: '900' },
    qtyPremiumVal: { color: 'white', fontSize: 14, fontWeight: '900', marginHorizontal: 12 },
    cartPremiumFooter: { backgroundColor: '#111', padding: 25, borderTopLeftRadius: 35, borderTopRightRadius: 35, borderWidth: 1, borderColor: '#222' },
    cartSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cartSummaryLabel: { color: '#888', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    cartSummaryVal: { color: 'white', fontSize: 14, fontWeight: '900' },
    cartSummaryTotalLabel: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },
    cartSummaryTotalVal: { color: '#FF4500', fontSize: 24, fontWeight: '900' },
    cartPremiumCheckoutBtn: { width: '100%', borderRadius: 25, overflow: 'hidden', marginTop: 25 },
    cartPremiumCheckGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18 },
    cartPremiumCheckText: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },

    sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
    sortBtnActive: { borderColor: '#FF4500', backgroundColor: '#FF450020' },
    sortBtnText: { color: '#888', fontSize: 10, fontWeight: '900' },
    sortBtnTextActive: { color: '#FF4500' },

    couponRow: { flexDirection: 'row', marginBottom: 20 },
    couponInput: { flex: 1, backgroundColor: '#1a1a1a', color: 'white', padding: 12, borderRadius: 12, fontSize: 12, fontWeight: '700', borderWidth: 1, borderColor: '#333' },
    couponBtn: { backgroundColor: '#FF4500', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 12, marginLeft: 10 },
    couponBtnText: { color: 'white', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    prodDetailOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', zIndex: 120 },
    prodDetailHeader: { position: 'absolute', top: 50, left: 20, zIndex: 130 },
    prodDetailBack: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    prodDetailImgArea: { width: '100%', height: 450, backgroundColor: '#111' },
    prodDetailImg: { width: '100%', height: '100%' },
    prodDetailInfoArea: { padding: 24 },
    prodDetailBrand: { color: '#FF4500', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
    prodDetailName: { color: 'white', fontSize: 26, fontWeight: '900', marginBottom: 15 },
    prodDetailPrice: { color: '#FFD700', fontSize: 22, fontWeight: '900', marginBottom: 20 },
    prodDetailDesc: { color: '#888', fontSize: 14, fontWeight: '600', lineHeight: 22 },
    prodDetailBottomNav: { flexDirection: 'row', padding: 20, paddingBottom: 40, borderTopWidth: 1, borderColor: '#222', backgroundColor: '#0a0a0a' },
    prodDetailAddCartBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333', borderRadius: 20, marginRight: 15 },
    prodDetailAddCartText: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    prodDetailBuyBtn: { flex: 1.5, borderRadius: 20, overflow: 'hidden' },
    prodDetailBuyGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18 },
    prodDetailBuyText: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 2 },

    profileHeaderAlt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, backgroundColor: '#111', padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#1a1a1a' },
    profileInfoAlt: { flexDirection: 'row', alignItems: 'center' },
    profilePicBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    onlineStatus: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#00FF7F', borderWidth: 2, borderColor: '#111' },
    profileNameAlt: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    levelRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    levelLabelAlt: { color: '#FFD700', fontSize: 10, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
    settingsBtn: { backgroundColor: '#1a1a1a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
    settingsBtnText: { color: '#888', fontSize: 10, fontWeight: '900' },
    xpBoxAlt: { backgroundColor: '#111', padding: 24, borderRadius: 30, marginBottom: 24, borderWidth: 1, borderColor: '#1a1a1a' },
    xpTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    xpLabelAlt: { color: '#666', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    xpValAlt: { color: 'white', fontSize: 11, fontWeight: '900' },
    xpBarBgAlt: { height: 8, backgroundColor: '#000', borderRadius: 4, overflow: 'hidden' },
    xpBarFillAlt: { height: '100%', borderRadius: 4 },
    statGridAlt: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
    statCardAlt: { width: '48%', backgroundColor: '#111', padding: 20, borderRadius: 25, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
    statValAlt: { color: 'white', fontSize: 20, fontWeight: '900', marginTop: 10 },
    statLabAlt: { color: '#666', fontSize: 9, fontWeight: '900', marginTop: 4, letterSpacing: 1 },
    achieveCard: { width: 120, height: 120, backgroundColor: '#111', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#1a1a1a' },
    achieveTitle: { color: 'white', fontSize: 9, fontWeight: '900', marginTop: 12, textAlign: 'center', paddingHorizontal: 10 },
    vaultEntry: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 30 },
    vaultText: { flex: 1, color: '#888', fontSize: 11, fontWeight: '900', marginLeft: 15, letterSpacing: 1 }
});
