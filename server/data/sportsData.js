const sports = [
    { name: 'Football', icon: '⚽', color: '#1a472a' },
    { name: 'Cricket', icon: '🏏', color: '#2e4d2a' },
    { name: 'Basketball', icon: '🏀', color: '#5c3a21' },
    { name: 'Tennis', icon: '🎾', color: '#1e3a5f' },
    { name: 'Badminton', icon: '🏸', color: '#4a1e5f' },
];

const brands = ['Nike', 'Adidas', 'Puma', 'Volt', 'New Balance', 'Kookaburra', 'DSC', 'Wilson', 'Babolat', 'Yonex'];

const categoryData = {
    'Football': [
        {
            type: 'Elite Cleats',
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400',
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400',
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400',
                'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400',
                'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=400',
                'https://images.unsplash.com/photo-1620138546344-7b2c38516dee?q=80&w=400',
                'https://images.unsplash.com/photo-1511886929837-399a8a111ada?q=80&w=400'
            ]
        },
        {
            type: 'Official Ball',
            images: [
                'https://images.unsplash.com/photo-1552318975-2758c97ec767?q=80&w=400',
                'https://images.unsplash.com/photo-1614632537190-23e4141777db?q=80&w=400',
                'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400',
                'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400'
            ]
        },
        { type: 'Pro GK Gloves', images: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=400'] }
    ],
    'Cricket': [
        {
            type: 'Elite Willow Bat',
            images: [
                'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400',
                'https://images.unsplash.com/photo-1593341604935-03ba0203f6f1?q=80&w=400',
                'https://images.unsplash.com/photo-1624526261102-421712a23075?q=80&w=400'
            ]
        },
        { type: 'Batting Pads', images: ['https://images.unsplash.com/photo-1508344928928-7165167de0c2?q=80&w=400'] },
        { type: 'Leather Ball', images: ['https://images.unsplash.com/photo-1624526261102-421712a23075?q=80&w=400'] }
    ],
    'Basketball': [
        {
            type: 'High Top Shoes',
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400',
                'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=400',
                'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=400'
            ]
        },
        {
            type: 'Game Ball',
            images: [
                'https://images.unsplash.com/photo-1546519638-68e1084f708a?q=80&w=400',
                'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400'
            ]
        }
    ],
    'Tennis': [
        {
            type: 'Performance Racket',
            images: [
                'https://images.unsplash.com/photo-1617083275226-622016489100?q=80&w=400',
                'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=400'
            ]
        },
        { type: 'Match Ball', images: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400'] }
    ],
    'Badminton': [
        {
            type: 'Elite Racket',
            images: [
                'https://images.unsplash.com/photo-1613913077104-d33a721d2074?q=80&w=400',
                'https://images.unsplash.com/photo-1626225967041-96424b94f41f?q=80&w=400'
            ]
        },
        { type: 'Pro Shoes', images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400'] }
    ]
};

const generateSmartProducts = (sportName, count) => {
    const cats = categoryData[sportName];
    const sportBrands = brands.filter(b => {
        if (sportName === 'Cricket') return ['Kookaburra', 'DSC', 'SS', 'SG', 'MRF', 'Volt'].includes(b);
        if (sportName === 'Football') return ['Nike', 'Adidas', 'Puma', 'Volt'].includes(b);
        if (sportName === 'Tennis') return ['Wilson', 'Babolat', 'Head', 'Yonex'].includes(b);
        if (sportName === 'Badminton') return ['Yonex', 'Li-Ning', 'Volt'].includes(b);
        return true;
    });

    return Array.from({ length: count }, (_, i) => {
        const cat = cats[i % cats.length];
        const brand = sportBrands[i % sportBrands.length];
        const imageId = i % cat.images.length;
        const image = cat.images[imageId];

        const basePrice = 1000;
        const priceSpread = (44000 / count) * i;
        const price = Math.floor(basePrice + priceSpread + (Math.random() * 500));

        const uniqueImage = `https://picsum.photos/seed/${sportName.replace(/\s/g, '')}${i}/400/400`;

        return {
            id: `${sportName.toLowerCase()}_${i}`,
            name: `${brand} ${cat.type} ${Math.floor(i / cats.length) + 1}`,
            price: `₹${price.toLocaleString('en-IN')}`,
            priceValue: price,
            image: uniqueImage,
            brand: brand
        };
    });
};

const sportProducts = {
    'Football': generateSmartProducts('Football', 40),
    'Cricket': generateSmartProducts('Cricket', 40),
    'Basketball': generateSmartProducts('Basketball', 40),
    'Tennis': generateSmartProducts('Tennis', 40),
    'Badminton': generateSmartProducts('Badminton', 40)
};

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
        { id: 'f_st1', name: 'Elite Speed Boot', price: '₹24,995', priceValue: 24995, image: 'https://picsum.photos/seed/fst1/400/400', tag: 'Pure Speed' },
        { id: 'f_st2', name: 'Flyknit Match Ball', price: '₹13,995', priceValue: 13995, image: 'https://picsum.photos/seed/fst2/400/400', tag: 'Top Flight' },
    ],
    'Midfielder': [
        { id: 'f_mid1', name: 'Maestro Control Shoes', price: '₹22,995', priceValue: 22995, image: 'https://picsum.photos/seed/fmid1/400/400', tag: 'Control' },
    ],
    'Defender': [
        { id: 'f_def1', name: 'Iron Wall Cleats', price: '₹19,995', priceValue: 19995, image: 'https://picsum.photos/seed/fdef1/400/400', tag: 'Stability' },
    ],
    'Goalkeeper': [
        { id: 'f_gk1', name: 'Titan Grip Gloves', price: '₹8,995', priceValue: 8995, image: 'https://picsum.photos/seed/fgk1/400/400', tag: 'High Grip' },
    ],
    'Point Guard': [
        { id: 'b_pg1', name: 'Aero Step Court', price: '₹16,499', priceValue: 16499, image: 'https://picsum.photos/seed/bpg1/400/400', tag: 'Quick Cut' },
    ],
    'Batsman': [
        { id: 'c_bat1', name: 'Willow Pro Alpha', price: '₹42,000', priceValue: 42000, image: 'https://picsum.photos/seed/cbat1/400/400', tag: 'Grade 1' },
    ],
};

module.exports = { sports, sportProducts, sportPositions, positionGear };
