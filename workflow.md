# Volt - App Architecture & Workflow ⚡

Welcome to the internal documentation for **Volt: The Sport Universe**. This document outlines the user journey, state management flow, and the component architecture of the React Native mobile application.

---

## 🧭 High-Level User Journey

The Volt mobile app is divided into four primary hubs, each catering to a different aspect of an elite athlete's journey:

1. **HOME**: The command center. Displays quick analytics, daily streak, and allows for quick qualitative workout logging.
2. **SHOP (Explore / Pro Flow)**: The commerce hub. Users can browse gear normally or switch to "Pro Flow" for a highly customized, position-based sport selection experience.
3. **ARENA**: The competitive social layer. Features live spectating numbers, active/upcoming tournaments, and club features.
4. **PROFILE**: The prestige dashboard. Shows rank progression towards "Master" rank, verified badges, awards, and an activity timeline.

---

## 🧬 Component State & Data Flow (Mermaid)

The following Mermaid diagram maps out how the central state in `MainApp` passes data down to the different UI views, specifically within the complex **Shop** section.

```mermaid
graph TD
    %% Main Application State
    subgraph App_State_Management [MainApp.js State Hooks]
        A1(activeTab: 'Home' | 'Shop' | 'Arena' | 'Profile')
        A2(activeMode: 'Beginner' | 'Advanced')
        A3(selectedSport: 'Football' | 'Basketball' | 'Track')
        A4(selectedPosition: e.g., 'Striker')
    end

    %% Navigation Bar
    Nav[Bottom Navigation Bar] -- Updates --> A1

    %% Top Level Routing based on Active Tab
    A1 -- "Tab: Home" --> H[HomeUI]
    A1 -- "Tab: Arena" --> Ar[ArenaUI]
    A1 -- "Tab: Profile" --> P[ProfileUI]
    A1 -- "Tab: Shop" --> S{Active Mode?}

    %% Shop Routing
    S -- "Explore (Beginner)" --> B[BeginnerUI]
    S -- "Pro Flow (Advanced)" --> Adv[AdvancedUI]

    %% Advanced UI Data Flow
    subgraph Shop_Pro_Flow [AdvancedUI (Pro Flow View)]
        A3 --> D1[Select Discipline Banner]
        D1 -- "OnChange: Update State" --> A3
        
        A3 --> D2[Position Analysis Pitch]
        A4 --> D2
        D2 -- "OnChange: Update Node" --> A4
        
        A4 --> D3[Positional Metrics Dash]
        D3 -- "Maps Agi, Pow, Sta, Vis" --> D3
        
        A4 --> D4[Pro Gear Recommendations]
    end

    %% Home Logging Flow
    subgraph Home_Analytics [HomeUI local state]
        H_Stats(stats: score, steps, calories)
        H_Log[Quick Log Buttons: Light, Moderate, Beast]
        H_Log -- "Mutates" --> H_Stats
        H_Stats -- "Re-renders" --> H_Display[Dashboard UI]
    end
```

---

## ⚙️ Core Technical Workflows

### 1. Dynamic Quick Logging (Home UI)
- The Home view uses its own `useState` to track `stats`, `lastIntensity`, and `lastSessionTime`.
- When a user taps a feedback level (`LIGHT`, `MODERATE`, `BEAST MODE`), the `logFeedback()` function dynamically scales the metrics up.
- Using `Alert.alert`, we provide immediate haptic-like UI feedback, then trigger a state re-render to update the Analytics cards instantly.

### 2. The "Pro Flow" Switch (Shop UI)
- The `MainApp` header implements a conditional toggle restricted *only* to when `activeTab === 'Shop'`.
- Toggling to "PRO FLOW" switches the view from `BeginnerUI` to `AdvancedUI`.
- **AdvancedUI Requirements**: It needs `selectedSport` and `selectedPosition` props to function. When the user changes their sport (e.g., Football to Basketball), an `onPress` event safely defaults their `selectedPosition` to the first available node of the new sport to prevent data crashes.

### 3. Position Metrics Dashboard
- Driven by the `getPositionStats(pos)` utility function.
- Whenever `selectedPosition` changes, this function is re-evaluated to load a new stat block (Agility, Power, Stamina, Vision).
- It binds these numbers directly to dynamic `<LinearGradient>` widths (e.g., `width: \`\${metric.val}%\``), rendering the real-time glassmorphic bar charts under the animated sports pitch.
