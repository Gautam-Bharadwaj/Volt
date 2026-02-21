import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const Node = ({ position, label, isActive, onPress, theme }) => {
    const glowStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.4, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        ),
        transform: [{ scale: withTiming(isActive ? 1.5 : 1) }]
    }));

    return (
        <View style={[styles.nodeContainer, { top: position.top, left: position.left }]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Animated.View style={[
                    styles.node,
                    { backgroundColor: theme.primary, shadowColor: theme.primary },
                    glowStyle
                ]} />
            </TouchableOpacity>
            {isActive && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: theme.primary }]}>{label}</Text>
                </View>
            )}
        </View>
    );
};

const BodyMap = ({ theme, activePart, onPartPress }) => {
    const nodes = [
        { id: 'head', label: 'VISION', position: { top: '15%', left: '50%' } },
        { id: 'chest', label: 'CORE', position: { top: '35%', left: '50%' } },
        { id: 'wrist', label: 'PERFORMANCE', position: { top: '45%', left: '70%' } },
        { id: 'feet', label: 'POWER', position: { top: '85%', left: '50%' } },
    ];

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://placeholder.com/athlete_silhouette' }}
                style={styles.athleteImage}
                resizeMode="contain"
            />
            {nodes.map(node => (
                <Node
                    key={node.id}
                    position={node.position}
                    label={node.label}
                    isActive={activePart === node.id}
                    onPress={() => onPartPress(node.id)}
                    theme={theme}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    athleteImage: {
        width: '80%',
        height: '80%',
        opacity: 0.3,
    },
    nodeContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    node: {
        width: 20,
        height: 20,
        borderRadius: 10,
        elevation: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    labelContainer: {
        position: 'absolute',
        top: -25,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
    }
});

export default BodyMap;
