const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./db');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'volt_secret_key_123'; // In production, move to .env

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static Database for sports & gear
const { sports, sportProducts, sportPositions, positionGear } = require('./data/sportsData');

// Ensure DB is in sync and optionally seed
sequelize.sync().then(async () => {
    console.log('SQLite Database Connected & Synced.');
}).catch(err => {
    console.error('Database connection failed:', err);
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided!' });

    jwt.verify(token, JWT_SECRET, async (err, authData) => {
        if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });

        try {
            const user = await User.findByPk(authData.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: 'Server error during auth verification' });
        }
    });
};

// --- ENDPOINTS ---

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Volt Server is running with SQLite & JWT!' });
});

// Auth
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        // Exclude password from response
        const profile = user.toJSON();
        delete profile.password;

        res.status(200).json({ message: 'Login successful', token, profile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        const profile = newUser.toJSON();
        delete profile.password;

        res.status(201).json({ message: 'Registration successful', token, profile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Users
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const profile = req.user.toJSON();
    delete profile.password;
    res.status(200).json(profile);
});

app.post('/api/user/workout', authenticateToken, async (req, res) => {
    try {
        const { level } = req.body;
        const user = req.user;

        let addedScore = 0;
        let addedCalories = 0;
        let addedSteps = 0;

        if (level === 'LIGHT') {
            addedScore = 1; addedCalories = 150; addedSteps = 1500;
        } else if (level === 'MODERATE') {
            addedScore = 3; addedCalories = 350; addedSteps = 4000;
        } else if (level === 'BEAST MODE') {
            addedScore = 5; addedCalories = 750; addedSteps = 8000;
        }

        user.fitnessScore = Math.min(100, user.fitnessScore + addedScore);
        user.calories += addedCalories;
        user.steps += addedSteps;
        user.xp += (addedScore * 10);

        // Level up logic
        if (user.xp >= user.maxXp) {
            user.level += 1;
            user.xp -= user.maxXp;
            user.maxXp = Math.floor(user.maxXp * 1.5);
        }

        await user.save();

        const profile = user.toJSON();
        delete profile.password;

        res.status(200).json({
            message: 'Workout logged successfully!',
            profile,
            added: { calories: addedCalories, score: addedScore }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process workout' });
    }
});

// Sports & Gear Data
app.get('/api/sports', (req, res) => {
    res.status(200).json(sports);
});

app.get('/api/products/:sport', (req, res) => {
    const sportStr = req.params.sport;
    const products = sportProducts[sportStr] || [];
    res.status(200).json(products);
});

app.get('/api/positions/:sport', (req, res) => {
    const sportStr = req.params.sport;
    const positions = sportPositions[sportStr] || [];
    res.status(200).json(positions);
});

app.get('/api/gear/:position', (req, res) => {
    const pos = req.params.position;
    const gear = positionGear[pos] || positionGear['Striker'];
    res.status(200).json(gear);
});

// Fetch all data for initial app load
app.get('/api/data/all', (req, res) => {
    res.status(200).json({ sports, sportProducts, sportPositions, positionGear });
});

// Dynamic Arena Data (WebSockets)
let tournaments = [
    { id: 1, name: 'Elite Champions League', prize: '₹2,50,000', players: '4.2k', tag: 'LIVE', viewers: 12800 },
    { id: 2, name: 'Volt Summer Splashdown', prize: '₹50,000', players: '1.8k', tag: 'LIVE', viewers: 5400 },
    { id: 3, name: 'Warrior Street Series', prize: '₹80,000', players: '890', tag: 'STARTING', viewers: 0 },
    { id: 4, name: 'Winter Showdown', prize: '₹1,00,000', players: '1.2k', tag: 'UPCOMING', viewers: 0 }
];

io.on('connection', (socket) => {
    socket.emit('arenaUpdate', tournaments);
});

// Simulate Live Audience Fluctuation
setInterval(() => {
    tournaments[0].viewers += Math.floor(Math.random() * 21) - 5;
    tournaments[1].viewers += Math.floor(Math.random() * 11) - 2;
    io.emit('arenaUpdate', tournaments);
}, 3000);

app.get('/api/arena/tournaments', (req, res) => {
    res.status(200).json(tournaments);
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Volt Backend Server running on http://0.0.0.0:${PORT} with WebSockets ⚡`);
});
