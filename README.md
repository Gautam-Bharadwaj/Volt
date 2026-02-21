# Volt: The Sport Universe 

Volt is a next-generation, sport-centric gear discovery platform. Unlike generic marketplaces, it creates an immersive experience dedicated to the athlete's specific game.

##  Key Features
1. **Dynamic Theme Engine**: The entire app (UI, sounds, vibration) transforms based on the selected sport.
2. **Body-Map Discovery**: Navigate gear using a 3D Athlete model. Click body parts to see relevant equipment.
3. **AI Recommendation**: Predicts the best gear based on player profile (e.g., Shooter vs Dunker).
4. **FastAPI Backend**: Real-time gear management and AI-guided suggestions.

---

## Project Structure
- **/frontend**: High-fidelity React (Vite) web prototype.
- **/mobile**: React Native (Expo) source code for Android/iOS.
- **/backend**: FastAPI (Python) server logic.

##  Getting Started

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*API will run at http://localhost:8000*

### 2. Frontend (Web Prototype)
```bash
cd frontend
npm install
npm run dev
```

### 3. Mobile (React Native)
Copy the `mobile/src` files into your Expo or React Native project.
Required dependencies:
- `react-native-reanimated`
- `react-native-svg`
- `lucide-react-native`

---

## AI Recommendation Logic
The backend includes a specialized endpoint `/api/ai-recommendation` that analyzes player styles. For example:
- **Shooters** are recommended high-stability, low-profile shoes for perimeter movement.
- **Dunkers** are recommended high-impact protection shoes for vertical explosiveness.

---

## Visual Preview
![Body Map Discovery](https://placeholder.com/volt_preview_image)
*(See generated art in assets)*

Developed for athletes who live for the game. 🏀⚽️🎾
