/* ==========================================================================
   FLIXORA — Central Mock Movie & Series Database
   ========================================================================== */

const FLIXORA_DATABASE = {
    movies: [
        {
            id: "m1",
            title: "Interstellar",
            type: "movie",
            rating: 8.7,
            audienceScore: "93%",
            year: 2014,
            duration: "2h 49m",
            genres: ["Sci-Fi", "Drama", "Adventure"],
            moods: ["mind-bending", "emotional", "exciting"],
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
            backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920",
            description: "عندما تُواجه الأرض مجاعة كوكبية، يسافر فريق من المستكشفين عبر ثقب دودي في الفضاء لمسافات شاسعة لضمان بقاء البشرية.",
            director: "Christopher Nolan",
            cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
            scenes: [
                { time: "00:43:12", title: "مغادرة الكوكب الأرضي", type: "Emotional" },
                { time: "01:24:32", title: "مشهد كوكب ميلر والموجة العملاقة", type: "Iconic" },
                { time: "02:11:05", title: "داخل المكتبة والبعد الخامس (Tesseract)", type: "Mind-Bending" }
            ],
            soundtracks: [
                { song: "Cornfield Chase", artist: "Hans Zimmer", scene: "مطاردة الطائرة بدون طيار" },
                { song: "No Time for Caution", artist: "Hans Zimmer", scene: "مشهد الالتحام بالمركبة (Docking Scene)" }
            ]
        },
        {
            id: "m2",
            title: "Inception",
            type: "movie",
            rating: 8.8,
            audienceScore: "91%",
            year: 2010,
            duration: "2h 28m",
            genres: ["Sci-Fi", "Action", "Mystery"],
            moods: ["mind-bending", "exciting"],
            poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
            backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920",
            description: "لص محترف يسرق الأسرار من خلال تقنية مشاركة الأحلام تُسند إليه مهمة معكوسة ومستحيلة: زرع فكرة داخل عقل رئيس تنفيذي.",
            director: "Christopher Nolan",
            cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]
        },
        {
            id: "m3",
            title: "Oppenheimer",
            type: "movie",
            rating: 8.9,
            audienceScore: "94%",
            year: 2023,
            duration: "3h 00m",
            genres: ["Biography", "Drama", "History"],
            moods: ["mind-bending", "emotional"],
            poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800",
            backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920",
            description: "قصة الفيزيائي الأمريكي جي. روبرت أوبنهايمر ودوره المحوري في تطوير القنبلة الذرية خلال مشروع مانهاتن.",
            director: "Christopher Nolan",
            cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"]
        }
    ],
    series: [
        {
            id: "s1",
            title: "Severance",
            type: "series",
            rating: 8.7,
            seasons: 1,
            episodes: 9,
            genres: ["Sci-Fi", "Thriller", "Mystery"],
            moods: ["mind-bending", "chill"],
            poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
            description: "شركة تقنية تستخدم إجراءً جراحياً لفصل ذكريات العمل عن ذكريات الحياة الشخصية لموظفيها."
        }
    ],
    moods: [
        { id: "chill", label: "🌙 هادئ & Chill", icon: "fa-moon" },
        { id: "mind-bending", label: "🧠 لحس دماغ (Mind Bending)", icon: "fa-brain" },
        { id: "exciting", label: "🔥 حماس وندرة", icon: "fa-fire" },
        { id: "feel-good", label: "😊 مبهج (Feel Good)", icon: "fa-smile" },
        { id: "romantic", label: "❤️ رومانسي", icon: "fa-heart" },
        { id: "emotional", label: "😢 مشاعر ودراما", icon: "fa-face-sad-tear" }
    ]
};