import { User, Post, Notification, Category } from "./types";

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Raj Patel",
    username: "rajpatel",
    email: "raj@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=raj",
    bio: "Rajkot born & raised. Love exploring local food stalls!",
    role: "user",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "u2",
    name: "Priya Shah",
    username: "priyashah",
    email: "priya@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    bio: "Event organizer & culture enthusiast from Rajkot.",
    role: "user",
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "u3",
    name: "Kiran Joshi",
    username: "kiranjoshi",
    email: "kiran@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kiran",
    bio: "Sports lover. Cricket is life. 🏏",
    role: "user",
    createdAt: "2024-03-05T10:00:00Z",
  },
  {
    id: "u4",
    name: "Meera Desai",
    username: "meeradesai",
    email: "meera@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
    bio: "Dayro fan & folk music collector.",
    role: "user",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "u5",
    name: "Amit Mehta",
    username: "amitmehta",
    email: "amit@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
    bio: "Rajkot foodie. Always hunting for the best dabeli.",
    role: "user",
    createdAt: "2024-04-01T10:00:00Z",
  },
  {
    id: "u-admin",
    name: "Admin",
    username: "admin",
    email: "admin@rajkotlive.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    bio: "RajkotLive Platform Administrator",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export const mockPosts: Post[] = [
  {
    id: "p1",
    title: "Grand Navratri Garba at Racecourse Ground 2024",
    content:
      "The biggest Navratri celebration in Rajkot is back! This year's garba at Racecourse Ground will feature live orchestra, celebrity singers, and amazing food stalls. Entry passes available at the gate. Don't miss the spectacular dandiya raas on Day 5! Gates open at 8 PM every night. Parking available at the adjacent ground. Bring your best chaniya choli and kurta!",
    category: "events",
    image:
      "https://thumbs.dreamstime.com/b/group-women-dancing-festive-celebration-under-string-lights-traditional-indian-dance-culture-party-religious-group-428858391.jpg?w=992",
    author: mockUsers[1],
    location: {
      name: "Racecourse Ground",
      address: "Racecourse Ring Road, Rajkot, Gujarat 360001",
      lat: 22.2985,
      lng: 70.7905,
    },
    likes: 245,
    views: 1820,
    likedByCurrentUser: false,
    comments: [
      {
        id: "c1",
        postId: "p1",
        author: mockUsers[0],
        content: "Can't wait! Best garba in the city every year! 🎉",
        createdAt: "2024-10-01T18:30:00Z",
      },
      {
        id: "c2",
        postId: "p1",
        author: mockUsers[4],
        content: "What's the entry fee this year?",
        createdAt: "2024-10-01T19:15:00Z",
      },
    ],
    createdAt: "2024-10-01T12:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p2",
    title: "Best Pani Puri Spots on Kalavad Road",
    content:
      "After trying almost every pani puri stall on Kalavad Road, here's my definitive ranking:\n\n1. Shreenath Pani Puri — the OG, spicy water is unmatched\n2. Jay Ambe Chaat — great ragda and sweet chutney\n3. New stall near SBI Bank — surprisingly good!\n\nPrices range from ₹20-40 per plate. Best time to visit is 5-7 PM when everything is freshly prepared. The area gets crowded on weekends so go on weekdays if possible.",
    category: "food",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    author: mockUsers[4],
    location: {
      name: "Kalavad Road",
      address: "Kalavad Road, Near University, Rajkot, Gujarat",
      lat: 22.3156,
      lng: 70.8312,
    },
    likes: 189,
    views: 1340,
    likedByCurrentUser: true,
    comments: [
      {
        id: "c3",
        postId: "p2",
        author: mockUsers[0],
        content: "Shreenath is the GOAT! No debate. 🔥",
        createdAt: "2024-09-28T17:00:00Z",
      },
    ],
    createdAt: "2024-09-28T14:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p3",
    title: "Saurashtra Premier League — Cricket Matches This Weekend",
    content:
      "SPL is back with exciting T20 matches at 150 Feet Ring Road ground! This weekend features:\n\nSaturday: Rajkot Royals vs Junagadh Lions (4 PM)\nSunday: Rajkot Warriors vs Bhavnagar Bulls (4 PM)\n\nFree entry for all. Bring your own snacks or enjoy the food stalls outside. Great opportunity to watch local talent. Some of these players might make it to IPL trials!",
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    author: mockUsers[2],
    location: {
      name: "150 Feet Ring Road Ground",
      address: "150 Feet Ring Road, Rajkot, Gujarat 360005",
      lat: 22.273,
      lng: 70.776,
    },
    likes: 156,
    views: 980,
    likedByCurrentUser: false,
    comments: [
      {
        id: "c4",
        postId: "p3",
        author: mockUsers[1],
        content: "Rajkot Royals are going to crush it! 🏏",
        createdAt: "2024-10-03T10:00:00Z",
      },
    ],
    createdAt: "2024-10-03T08:00:00Z",
    reported: true,
    reportCount: 2,
    reportedBy: ["u3", "u5"],
  },
  {
    id: "p4",
    title: "Dayro Night with Kirtidan Gadhvi at Aji Dam",
    content:
      "Mark your calendars! The legendary Kirtidan Gadhvi is performing a Dayro night at the Aji Dam amphitheater. This is going to be an unforgettable evening of Gujarati folk music, bhajans, and storytelling.\n\nDate: October 15, 2024\nTime: 7:30 PM onwards\nTickets: ₹200 (General), ₹500 (VIP with seating)\n\nLimited seats available. Book early to avoid disappointment!",
    category: "dayro",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    author: mockUsers[3],
    location: {
      name: "Aji Dam Amphitheater",
      address: "Aji Dam Road, Rajkot, Gujarat 360003",
      lat: 22.3401,
      lng: 70.7562,
    },
    likes: 312,
    views: 2100,
    likedByCurrentUser: true,
    comments: [
      {
        id: "c5",
        postId: "p4",
        author: mockUsers[0],
        content:
          "Kirtidan ni dayro to must attend! Already booked VIP tickets! 🎵",
        createdAt: "2024-10-05T20:00:00Z",
      },
      {
        id: "c6",
        postId: "p4",
        author: mockUsers[2],
        content: "Where to book tickets? Online or offline?",
        createdAt: "2024-10-05T21:00:00Z",
      },
    ],
    createdAt: "2024-10-05T15:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p5",
    title: "New Food Truck Park Opens Near Khedut Ground",
    content:
      "Exciting news for foodies! A brand new food truck park has opened near Khedut Ground with 12 different food trucks. You'll find everything from gourmet burgers and wood-fired pizza to traditional Gujarati street food.\n\nHighlights:\n- The Burger Barn — smash burgers\n- Desi Tadka — live dosa counter\n- Sweet Tooth — Belgian waffles & shakes\n\nOpen daily from 5 PM to midnight. Plenty of seating and a great vibe!",
    category: "food",
    image:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80",
    author: mockUsers[0],
    location: {
      name: "Khedut Ground Food Park",
      address: "Near Khedut Ground, Rajkot, Gujarat 360002",
      lat: 22.2892,
      lng: 70.8198,
    },
    likes: 198,
    views: 1560,
    likedByCurrentUser: false,
    comments: [
      {
        id: "c7",
        postId: "p5",
        author: mockUsers[4],
        content:
          "Went yesterday! The Burger Barn is amazing. Must try the cheese smash! 🍔",
        createdAt: "2024-10-06T22:00:00Z",
      },
    ],
    createdAt: "2024-10-06T16:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p6",
    title: "Marathon Run for Charity on Gondal Road",
    content:
      "Join us for the annual Rajkot Marathon! This year we're running for charity — all proceeds go to local orphanages.\n\nRoute: Starting from Gondal Road Chowk, through Jubilee Garden, ending at Racecourse\nCategories: 5K (₹200), 10K (₹350), Half Marathon (₹500)\nDate: October 20, 2024, 6 AM sharp\n\nRegistration open at rajkotmarathon.in. T-shirt and medal for all finishers!",
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
    author: mockUsers[2],
    location: {
      name: "Gondal Road Chowk",
      address: "Gondal Road, Rajkot, Gujarat 360004",
      lat: 22.2612,
      lng: 70.7844,
    },
    likes: 134,
    views: 890,
    likedByCurrentUser: false,
    comments: [],
    createdAt: "2024-10-07T09:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p7",
    title: "Diwali Mela at Tagore Road — Shop & Celebrate!",
    content:
      "The annual Diwali Mela on Tagore Road is here! Over 200 stalls selling:\n- Handmade diyas & rangoli colors\n- Traditional sweets & farsan\n- Fireworks (eco-friendly options available)\n- Clothing & jewelry\n\nSpecial kids zone with rides and games. Live music every evening. The mela runs from October 25 to November 5. Don't miss the grand fireworks show on Diwali night!",
    category: "events",
    image:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80",
    author: mockUsers[1],
    location: {
      name: "Tagore Road Market",
      address: "Tagore Road, Rajkot, Gujarat 360001",
      lat: 22.3021,
      lng: 70.7948,
    },
    likes: 276,
    views: 1950,
    likedByCurrentUser: true,
    comments: [
      {
        id: "c8",
        postId: "p7",
        author: mockUsers[3],
        content:
          "Best Diwali shopping in Rajkot! The sweets section is to die for! 🪔",
        createdAt: "2024-10-08T18:30:00Z",
      },
    ],
    createdAt: "2024-10-08T12:00:00Z",
    reported: true,
    reportCount: 3,
    reportedBy: ["u1", "u2", "u4"],
  },
  {
    id: "p8",
    title: "Famous Locho & Dabeli at Dr. Yagnik Road",
    content:
      "If you haven't tried the locho at Patel's stall on Dr. Yagnik Road, you're missing out on life! This 40-year-old stall serves the most authentic Surti Locho in Rajkot.\n\nMust try:\n- Locho with sev & chutney (₹30)\n- Dabeli with extra masala (₹25)\n- Khaman with tadka (₹35)\n\nOpen from 7 AM to 9 PM. Closed on Mondays. There's usually a queue during evening hours so patience is key!",
    category: "food",
    image:
      "https://images.unsplash.com/photo-1633669771791-fcda43b7d455?q=80&w=2340",
    author: mockUsers[4],
    location: {
      name: "Patel's Stall, Dr. Yagnik Road",
      address: "Dr. Yagnik Road, Rajkot, Gujarat 360001",
      lat: 22.3089,
      lng: 70.8011,
    },
    likes: 167,
    views: 1120,
    likedByCurrentUser: false,
    comments: [
      {
        id: "c9",
        postId: "p8",
        author: mockUsers[0],
        content: "Best dabeli in Rajkot, hands down! 😋",
        createdAt: "2024-10-09T13:00:00Z",
      },
    ],
    createdAt: "2024-10-09T10:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p9",
    title: "Lok Dayro — Village Folk Night at Mavdi",
    content:
      "Experience the rustic charm of traditional Saurashtra folk music at Mavdi's open-air venue. This Lok Dayro features:\n\n- Traditional doha & chhanda recitation\n- Maniyaro raas performance\n- Local folk singers from nearby villages\n- Authentic village-style dinner (dal-bati-churma)\n\nDate: October 22, 2024\nTime: 6 PM onwards\nFree entry! Just come and enjoy the culture of our land.",
    category: "dayro",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    author: mockUsers[3],
    location: {
      name: "Mavdi Open Air Venue",
      address: "Mavdi Main Road, Rajkot, Gujarat 360004",
      lat: 22.321,
      lng: 70.7698,
    },
    likes: 198,
    views: 1340,
    likedByCurrentUser: false,
    comments: [
      {
        id: "c10",
        postId: "p9",
        author: mockUsers[1],
        content: "The dal-bati-churma alone is worth the trip! 🥘",
        createdAt: "2024-10-10T19:00:00Z",
      },
    ],
    createdAt: "2024-10-10T14:00:00Z",
    reported: false,
    reportCount: 0,
    reportedBy: [],
  },
  {
    id: "p10",
    title: "University Road Night Market — Every Saturday!",
    content:
      "The popular Saturday Night Market on University Road is bigger than ever this season! From 6 PM to 11 PM every Saturday, enjoy:\n\n- Street food from 30+ stalls\n- Live music performances\n- Handicraft shopping\n- Fun games & activities for kids\n- Free parking at University campus\n\nThis week's special: Rajkot's Got Talent — open mic for singers and comedians! Come early for the best food options.",
    category: "events",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    author: mockUsers[0],
    location: {
      name: "University Road Night Market",
      address: "University Road, Rajkot, Gujarat 360005",
      lat: 22.2941,
      lng: 70.8155,
    },
    likes: 223,
    views: 1680,
    likedByCurrentUser: false,
    comments: [
      {
        id: "c11",
        postId: "p10",
        author: mockUsers[4],
        content:
          "Saturday night market is the best thing to happen to Rajkot! 🌙",
        createdAt: "2024-10-11T21:00:00Z",
      },
      {
        id: "c12",
        postId: "p10",
        author: mockUsers[2],
        content: "Is the parking really free? Last time they charged ₹20.",
        createdAt: "2024-10-11T21:30:00Z",
      },
    ],
    createdAt: "2024-10-11T15:00:00Z",
    reported: true,
    reportCount: 1,
    reportedBy: ["u3"],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "comment",
    message:
      'Raj Patel commented on your post "Grand Navratri Garba at Racecourse Ground 2024"',
    postId: "p1",
    read: false,
    createdAt: "2024-10-01T18:30:00Z",
  },
  {
    id: "n2",
    type: "like",
    message: 'Kiran Joshi liked your post "Diwali Mela at Tagore Road"',
    postId: "p7",
    read: false,
    createdAt: "2024-10-08T20:00:00Z",
  },
  {
    id: "n3",
    type: "comment",
    message: 'Meera Desai commented on your post "Diwali Mela at Tagore Road"',
    postId: "p7",
    read: true,
    createdAt: "2024-10-08T18:30:00Z",
  },
  {
    id: "n4",
    type: "like",
    message: 'Amit Mehta liked your post "University Road Night Market"',
    postId: "p10",
    read: false,
    createdAt: "2024-10-11T22:00:00Z",
  },
];

export const categoryLabels: Record<Category, string> = {
  events: "Events",
  food: "Food & Stalls",
  sports: "Sports",
  dayro: "Dayro",
  general: "General",
};

export const categoryColors: Record<Category, string> = {
  events: "bg-amber-100 text-amber-800 border-amber-300",
  food: "bg-red-100 text-red-800 border-red-300",
  sports: "bg-green-100 text-green-800 border-green-300",
  dayro: "bg-purple-100 text-purple-800 border-purple-300",
  general: "bg-blue-100 text-blue-800 border-blue-300",
};

export const categoryMapColors: Record<Category, string> = {
  events: "#f59e0b",
  food: "#ef4444",
  sports: "#22c55e",
  dayro: "#a855f7",
  general: "#3b82f6",
};
