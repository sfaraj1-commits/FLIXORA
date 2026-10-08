/* ==========================================================================
   FLIXORA — Mock Database Layer
   ========================================================================== */

const FLIXORA_DATABASE = {
    movies: [
        {
            id: "m1",
            title: "Interstellar",
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600",
            backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200",
            rating: "8.7",
            year: "2014",
            duration: "2h 49m",
            genres: ["مغامرة", "دراما", "خيال علمي"],
            description: "يقود فريق من المستكشفين مهمة خرقاء عبر ثقب دودي في الفضاء لمسافة أبعد مما ذهب إليه أي إنسان من قبل، وذلك بحثاً عن كوكب جديد يصلح لعيش البشرية بعد تدهور الأرض.",
            stats: {
                boxOffice: "$773.8M",
                director: "Christopher Nolan",
                awards: "جائزة أوسكار لأفضل مؤثرات",
                audience: "92%"
            },
            cast: [
                { name: "Matthew McConaughey", role: "Cooper", img: "https://i.pravatar.cc/150?img=68" },
                { name: "Anne Hathaway", role: "Brand", img: "https://i.pravatar.cc/150?img=49" },
                { name: "Jessica Chastain", role: "Murph", img: "https://i.pravatar.cc/150?img=45" },
                { name: "Michael Caine", role: "Professor Brand", img: "https://i.pravatar.cc/150?img=13" }
            ],
            scenes: [
                { title: "مشهد الثقب الدودي (Wormhole)", img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600" },
                { title: "الهبوط على كوكب ميلر", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600" },
                { title: "داخل البعد الخامس", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" }
            ],
            bts: "تم الاستعانة بالفيزيائي كيب ثورن لضمان دقة دالة النسبية والمؤثرات البصرية للثقب الأسود Gargantua."
        }
    ]
};