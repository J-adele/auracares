 (function() {
            // --- Start of Chatbot Logic ---

            // === Constants ===
            const DATASET_REF = "aura_cares_10k_dataset.json"; // 10,000+ verified community testimonials
            const WHATSAPP_BUSINESS_LINK = "https://wa.me/message/2349015092132";
            // Gemini API Key (leave empty for Canvas runtime - Canvas will inject it)
            const API_KEY = "";
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            const DATASET_REF = "aura_cares_10k_dataset.json"; // 10,000+ verified community testimonials
            const WHATSAPP_BUSINESS_LINK = "https://wa.me/message/2349015092132";
            // Gemini API Key (leave empty for Canvas runtime - Canvas will inject it)
            const API_KEY = "";
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            const BOT_AVATAR_URL = "avatar.png"; // Placeholder bot avatar
            // Updated CHAT_ICON_IMAGE_URL for a more generic and larger placeholder
            const CHAT_ICON_IMAGE_URL = "chatbot (2).png"; // Placeholder chat icon image

            // === Data Definitions ===
            // Products Data - Reordered for specific product matching first
             const products = [{
                id: "small-reishi",
                name: "Reishi (Small/30c)",
                keywords: /small reishi|small lingzhi|small ganoderma/i,
                image: "assets/img/product/Reishi.png",
                description: "Compact Ganoderma Lucidum protocol for immune baseline maintenance.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "",
                qna: [{
                    question: "How often should I take Small Reishi?",
                    answer: "Typically, Small Reishi is taken once or twice daily, but always refer to the product packaging for precise dosage instructions or consult a healthcare professional."
                }, {
                    question: "Is Small Reishi good for liver health?",
                    answer: "Yes, Small Reishi is well-known for its hepatoprotective properties and can support liver function."
                }]
            }, {
                id: "reishi",
                name: "Reishi (Big/90c)",
                keywords: /reishi|lingzhi|ganoderma|big reishi/i,
                image: "assets/img/product/Reishi.png",
                description: "Premium Ganoderma Lucidum extract for advanced immune modulation.",
                price: "₦37,800",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: [{
                    question: "How often should I take Reishi?",
                    answer: "Typically, Reishi is taken once or twice daily, but always refer to the product packaging for precise dosage instructions or consult a healthcare professional."
                }, {
                    question: "Is Reishi good for liver health?",
                    answer: "Yes, Reish  is well-known for its hepatoprotective properties and can support liver function. https://kedicare.netlify.app/shop-single.html?id=p1"
                }]
            }, {
                id: "packet-re-vive",
                name: "Re-Vive (Small/10c)",
                keywords: /packet re-vive|revive packet|small revive/i,
                image: "assets/img/product/Revive.png",
                description: "Fast-acting male performance support packet.",
                price: "₦17,400",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: [{
                    question: "What are the main benefits of Packet Re-Vive?",
                    answer: "Packet Re-Vive primarily enhances male sexual function, increases libido, and improves overall vitality."
                }, {
                    question: "Are there any side effects of Packet Re-Vive?",
                    answer: "Generally, Packet Re-Vive is well-tolerated. For specific concerns, it's best to consult your doctor."
                }]
            }, {
                id: "re-vive",
                name: "Re-Vive (Big/30c)",
                keywords: /re-vive|revive|sexual health male|big revive/i,
                image: "assets/img/product/Revive.png",
                description: "Premier libido and stamina recovery protocol.",
                price: "₦48,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: [{
                    question: "What are the main benefits of Re-Vive?",
                    answer: "Re-Vive primarily enhances male sexual function, increases libido, and improves overall vitality."
                }, {
                    question: "Are there any side effects?",
                    answer: "Generally, Re-Vive is well-tolerated. For specific concerns, it's best to consult your doctor."
                }]
            }, {
                id: "small-cordy-active",
                name: "Cordy Active (Small/30c)",
                keywords: /small cordy active|small cordy/i,
                image: "assets/img/product/Cordy Active.png",
                description: "Endurance and lung health in a compact clinical dose.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "cordy-active",
                name: "Cordy Active (Big/60c)",
                keywords: /cordy active|stamina|athletic performance|respiratory health|big cordy/i,
                image: "assets/img/product/Cordy Active.png",
                description: "Premium Cordyceps-based energy and respiratory support protocol.",
                price: "₦25,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-cordy-royal-jelly",
                name: "Cordy Royal Jelly (Small/30c)",
                keywords: /small cordy royal jelly|small cordyceps|small royal jelly|small cordy|small jelly/i,
                image: "assets/img/product/img_18.png",
                description: "Elite immunity and vitality support in a 30-day pack.",
                price: "₦14,400",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "cordy-royal-jelly",
                name: "Cordy Royal Jelly (Big/90c)",
                keywords: /cordy royal jelly|cordyceps|royal jelly|big cordy royal/i,
                image: "assets/img/product/img_18.png",
                description: "Premium immune booster and longevity elixir with high-potency Cordyceps.",
                price: "₦37,800",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-golden-hypha",
                name: "Golden Hypha (Small/30c)",
                keywords: /small golden hypha|golden hypha small/i,
                image: "assets/img/product/Golden-Hypha.png",
                description: "Intensive immune modulation and tumor defense in a smaller format.",
                price: "₦20,400",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "golden-hypha",
                name: "Golden Hypha (Big/90c)",
                keywords: /golden hypha|immune booster|anti-cancer|anti-tumor|big golden hypha/i,
                image: "assets/img/product/Golden-Hypha.png",
                description: "Advanced fungal polysaccharide protocol for maximum tumor defense.",
                price: "₦51,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "p13",
                name: "VIP Massage Chair",
                keywords: /vip massage chair|massage chair|medical chair/i,
                image: "assets/img/product/vip-massage_chair.jpg",
                description: "Full-body medical-grade clinical recovery system for homes, gyms, and offices. Features zero-gravity positioning and AI body scanning.",
                price: "₦6,500,000",
                type: "Medical Devices",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: [{
                    question: "What makes the VIP Massage Chair different from regular chairs?",
                    answer: "It is a clinical-grade device featuring zero-gravity positioning, therapeutic infrared heating, and AI body scanning to deliver precise, systemic recovery."
                }]
            }, {
                id: "small-diawell",
                name: "Diawell (Small/30c)",
                keywords: /small diawell|diawell small/i,
                image: "assets/img/product/Diawell.png",
                description: "Blood sugar management protocol in a travel-ready clinical pack.",
                price: "₦10,680",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "diawell",
                name: "Diawell (Big/90c)",
                keywords: /diawell|diabetes|blood sugar|big diawell/i,
                image: "assets/img/product/Diawell.png",
                description: "Advanced metabolic support for blood sugar optimization and pancreatic health.",
                price: "₦18,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: [{
                    question: "Can Diawell replace my diabetes medication?",
                    answer: "No, Diawell is a supplement and should not replace prescribed diabetes medication. Always consult your doctor before making any changes to your medication."
                }]
            }, {
                id: "small-golden-six",
                name: "Golden Six (Small/30c)",
                keywords: /small golden six|golden six small/i,
                image: "assets/img/product/Golden six.png",
                description: "Hormonal and kidney support in a compact 30-day dosage.",
                price: "₦10,680",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "golden-six",
                name: "Golden Six (Big/60c)",
                keywords: /golden six|hormonal balance|kidney liver|big golden six/i,
                image: "assets/img/product/Golden six.png",
                description: "Essential protocol for kidney health, hormonal baseline recovery, and anti-aging.",
                price: "₦16,800",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "cello-q10",
                name: "Cello Q10 (60s)",
                keywords: /cello q10|cardiovascular|heart health/i,
                image: "assets/img/product/img_05.png",
                description: "Supports cardiovascular health and energy production at cellular level.",
                price: "₦36,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "lycovite",
                name: "Lycovite (60s)",
                keywords: /lycovite|prostate health|antioxidant/i,
                image: "assets/img/product/LYCOVITE.jpg",
                description: "Beneficial for prostate health and antioxidant support.",
                price: "₦26,400",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-magilim",
                name: "Magilim (Small/30c)",
                keywords: /small magilim|magilim small/i,
                image: "assets/img/product/Magilim.png",
                description: "Metabolic optimization in a convenient 30-day clinical format.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "magilim",
                name: "Magilim (Big/90c)",
                keywords: /magilim|weight management|fat burning|big magilim/i,
                image: "assets/img/product/Magilim.png",
                description: "Aids in weight management by promoting satiety and fat burning.",
                price: "₦31,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-jointeez",
                name: "Jointeez (Small/40c)",
                keywords: /small jointeez|jointeez small/i,
                image: "assets/img/product/img_10.png",
                description: "Bone and joint comfort in a compact clinical format.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "jointeez",
                name: "Jointeez (Big/100c)",
                keywords: /jointeez|joint pain|arthritis|rheumatic|big jointeez/i,
                image: "assets/img/product/img_10.png",
                description: "Relieves muscular, joint, and waist pain; supports bone health.",
                price: "₦16,800",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-memory-24-7",
                name: "Memory 24/7 (Small/30c)",
                keywords: /small memory 24\/7|memory small/i,
                image: "assets/img/product/MEMORY-247.png",
                description: "Cognitive functionality support in a portable clinical dosage.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "memory-24-7-capsule",
                name: "Memory 24/7 (Big/60c)",
                keywords: /memory 24\/7|brain functionality|memory|concentration|big memory/i,
                image: "assets/img/product/MEMORY-247.png",
                description: "Enhances brain functionality, memory, and concentration.",
                price: "₦33,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-eye-beta",
                name: "Eye Beta (Small/10c)",
                keywords: /small eye beta|eye beta small/i,
                image: "assets/img/product/img_20.png",
                description: "Visual acuity support in a travel-ready clinical pack.",
                price: "₦10,680",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "eye-beta-capsule",
                name: "Eye Beta (Big/30c)",
                keywords: /eye beta|vision|eye fatigue|big eye beta/i,
                image: "assets/img/product/img_20.png",
                description: "Promotes healthy vision and relieves eye fatigue.",
                price: "₦27,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-gastrifort",
                name: "Gastrifort (Small/30c)",
                keywords: /small gastrifort|gastrifort small/i,
                image: "assets/img/product/Gastrifort.png",
                description: "Gastrointestinal comfort and mucosal defense in a compact 30-day dosage.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "gastrifort-capsule",
                name: "Gastrifort (Big/90c)",
                keywords: /gastrifort|stomach health|digestion|ulcers|big gastrifort/i,
                image: "assets/img/product/Gastrifort.png",
                description: "Premium high-potency tonic for stomach health, digestion, and ulcer defense.",
                price: "₦44,400",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-constilease",
                name: "Constilease (Small/30c)",
                keywords: /small constilease|constilease small/i,
                image: "assets/img/product/CONSTILEASE.png",
                description: "Digestive regularity support in a compact clinical dosage.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "constilease",
                name: "Constilease (Big/60c)",
                keywords: /constilease|constipation|digestive regularity|big constilease/i,
                image: "assets/img/product/CONSTILEASE.png",
                description: "Advanced herbal solution for chronic constipation and systemic detoxification.",
                price: "₦28,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-vigor-essential",
                name: "Vigor Essential (Small/30c)",
                keywords: /small vigor essential|vigor small/i,
                image: "assets/img/product/Vigor essential (1).jpg",
                description: "Male energy and vitality support in a convenient daily pack.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "vigor-essential",
                name: "Vigor Essential (Big/60c)",
                keywords: /vigor essential|energy|stamina|male vitality|big vigor/i,
                image: "https://placehold.co/150/FF4500/FFFFFF?text=VigorEssential",
                description: "Ultimate high-potency supplement for energy, stamina, and male vitality.",
                price: "₦25,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "small-gynapharm",
                name: "Gynapharm (Small/30c)",
                keywords: /small gynapharm|gynapharm small/i,
                image: "assets/img/product/img_22.png",
                description: "Infection defense and reproductive health optimization in a compact pack.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "gynapharm-capsule",
                name: "Gynapharm (Big/90c)",
                keywords: /gynapharm|female reproductive health|hormonal balance|pid|ovarian cysts|big gynapharm/i,
                image: "assets/img/product/img_22.png",
                description: "Advanced clinical support for female reproductive health and hormonal balance.",
                price: "₦39,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "qinghao",
                name: "Qinghao",
                keywords: /qinghao|artemisia|malaria support/i,
                image: "assets/img/product/Qinghao-pack.jpg",
                description: "Traditional herbal supplement for general well-being and fever support.",
                price: "₦10,680",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "reishi-blood-tonic",
                name: "Reishi (Blood Tonic)",
                keywords: /reishi blood tonic|blood health|anemia|iron deficiency/i,
                image: "assets/img/product/refresh-tea.png",
                description: "Supports blood health, liver function, and overall well-being.",
                price: "₦19,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "hydrogen-cup",
                name: "Hydrogen Cup",
                keywords: /hydrogen cup|alkaline water|antioxidant water|hydrogen rich water/i,
                image: "assets/img/product/img_26.png",
                description: "Generates hydrogen-rich alkaline water for enhanced hydration and antioxidant benefits.",
                price: "₦75,000",
                type: "Devices",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: [{
                    question: "What are the benefits of hydrogen water?",
                    answer: "Hydrogen water is believed to have antioxidant properties, reduce inflammation, and improve cellular health."
                }, {
                    question: "How often should I use the Hydrogen Cup?",
                    answer: "You can use the Hydrogen Cup daily to make hydrogen-rich water for regular consumption."
                }]
            }, {
                id: "sulphur-anti-acne-soap",
                name: "Sulphur Anti-Acne Soap",
                keywords: /sulphur anti-acne soap|acne soap|pimple soap|pimples|blackheads|Readness|Body odour|skin care|sulphur soap/i,
                image: "assets/img/product/sulphur anti-acne soap.jpeg",
                description: "A specialized soap formulated with sulfur to help treat acne, control oil, and cleanse pores.",
                price: "₦5,500",
                type: "Soaps",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app//blog/sulphur-anti-acne-soap",
                qna: [{
                    question: "How does Sulphur Anti-Acne Soap work?",
                    answer: "Sulfur helps to dry out the skin, remove dead skin cells, and has antibacterial properties that can reduce acne breakouts."
                }]
            }, {
                id: "pearl-whitening-soap",
                name: "Pearl Whitening Soap",
                keywords: /pearl whitening soap|whitening soap|brighten skin|lighten skin|pigmentation/i,
                image: "assets/img/product/img_02.png",
                description: "Reveals radiance, lightens dark spots, reduces pigmentation, and promotes healthy skin.",
                price: "₦5,500",
                type: "Soaps",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "nano-silver-antibacterial-soap",
                name: "Nano Silver Antibacterial Soap",
                keywords: /nano-silver antibacterial soap|antibacterial soap|germ shield|deep cleansing|skin hygiene/i,
                image: "assets/img/product/img_01.png",
                description: "Formulated with Nano Silver to eliminate harmful bacteria and maintain skin hygiene.",
                price: "₦5,500",
                type: "Soaps",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "gum-care-toothpaste",
                name: "Gum Care Toothpaste",
                keywords: /gum care toothpaste|oral hygiene|toothache|dental pain/i,
                image: "assets/img/product/tooth-paste.jpg",
                description: "Promotes oral hygiene, strengthens gums, and freshens breath.",
                price: "₦7,200",
                type: "Oral Care",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "colon-cleanse",
                name: "Colon Cleanse",
                keywords: /colon cleanse|detox|digestive health|constipation relief/i,
                image: "assets/img/product/CONSTILEASE.png",
                description: "Supports digestive health, promotes regularity, and aids in detoxification.",
                price: "₦19,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "kedi-coffee",
                name: "Kedi Coffee",
                keywords: /kedi coffee|healthy coffee|energy drink|ginseng coffee/i,
                image: "assets/img/product/kedi.jpg",
                description: "A unique blend of coffee with herbal extracts for energy and overall well-being.",
                price: "₦30,000",
                type: "Beverages",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "blood-circulatory-massager",
                name: "Blood Circulatory Massager",
                keywords: /blood circulatory massager|bcm|circulation machine|massager|blood flow/i,
                image: "assets/img/product/img_26.png",
                description: "Enhances blood circulation, relieves muscle tension, and promotes overall well-being.",
                price: "₦624,000",
                type: "Devices",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "haemocare",
                name: "Haemocare (Big/60c)",
                keywords: /haemocare|haemocare/i,
                image: "assets/img/product/refresh-tea.png",
                description: "Premium Kedicare clinical protocol: Haemocare.",
                price: "₦24,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/",
                qna: []
            }, {
                id: "cardibetter",
                name: "Cardibetter (Big/60c)",
                keywords: /cardibetter|cardibetter/i,
                image: "assets/img/product/Cardibetter.png",
                description: "Premium Kedicare clinical protocol: Cardibetter.",
                price: "₦34,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "v-ca",
                name: "V-Ca (Big/60c)",
                keywords: /v ca|v-ca/i,
                image: "assets/img/product/img_10.png",
                description: "Premium Kedicare clinical protocol: V-Ca.",
                price: "₦12,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "7-layer-sanitary-pad",
                name: "7 Layer Sanitary Pad",
                keywords: /7 layer sanitary pad|7 layer sanitary pad/i,
                image: "assets/img/product/img_01.png",
                description: "Premium Kedicare clinical protection for women.",
                price: "₦3,240",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "calmazine",
                name: "Calmazine (Big/60c)",
                keywords: /calmazine|calmazine/i,
                image: "assets/img/product/CALMAZINE.png",
                description: "Premium Kedicare clinical protocol: Calmazine.",
                price: "₦24,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "eve-comfort",
                name: "Eve Comfort (Big/60c)",
                keywords: /eve comfort|eve comfort/i,
                image: "assets/img/product/img_19.png",
                description: "Premium Kedicare clinical protocol: Eve Comfort.",
                price: "₦29,880",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "grapemin-e",
                name: "Grapemin-E (Big/60c)",
                keywords: /grapemin e|grapemin-e/i,
                image: "assets/img/product/img_21.png",
                description: "Premium Kedicare clinical protocol: Grapemin-E.",
                price: "₦33,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "lirich",
                name: "Lirich (Big/60c)",
                keywords: /lirich|lirich/i,
                image: "assets/img/product/LIRICH.png",
                description: "Premium Kedicare clinical protocol: Lirich.",
                price: "₦22,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "mv-women",
                name: "MV Women (Big/60c)",
                keywords: /mv women|mv women/i,
                image: "assets/img/product/MV-WOMEN.png",
                description: "Premium Kedicare clinical protocol: MV Women.",
                price: "₦31,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "multi-vitamin",
                name: "Multi-Vitamin (Big/60c)",
                keywords: /multi vitamin|multi-vitamin/i,
                image: "assets/img/product/Multi-vitamin.jpg",
                description: "Premium Kedicare clinical protocol: Multi-Vitamin.",
                price: "₦13,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "prosclick-prostate",
                name: "Prosclick Prostate (Big/60c)",
                keywords: /prosclick prostate|prosclick prostate/i,
                image: "assets/img/product/Prosclick prostate.jpg",
                description: "Premium Kedicare clinical protocol: Prosclick Prostate.",
                price: "₦35,500",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "revive-capsule",
                name: "Revive (Big/30c)",
                keywords: /revive|revive/i,
                image: "assets/img/product/Revive.png",
                description: "Premium Kedicare clinical protocol: Revive.",
                price: "₦48,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "salud-herbal",
                name: "Salud Herbal (Big/60c)",
                keywords: /salud herbal|salud herbal/i,
                image: "assets/img/product/Salud herbal.jpg",
                description: "Premium Kedicare clinical protocol: Salud Herbal.",
                price: "₦19,500",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "ultramega",
                name: "Ultramega (Big/60c)",
                keywords: /ultramega|ultramega/i,
                image: "assets/img/product/ULTRAMEGA.jpg",
                description: "Premium Kedicare clinical protocol: Ultramega.",
                price: "₦21,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "vitagent",
                name: "Vitagent (Big/60c)",
                keywords: /vitagent|vitagent/i,
                image: "assets/img/product/VITAGENT.png",
                description: "Premium Kedicare clinical protocol: Vitagent.",
                price: "₦31,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "vitaprego",
                name: "Vitaprego (Big/60c)",
                keywords: /vitaprego|vitaprego/i,
                image: "assets/img/product/VITAPREGO.jpg",
                description: "Premium Kedicare clinical protocol: Vitaprego.",
                price: "₦30,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "beauty-soap",
                name: "Beauty Soap",
                keywords: /beauty soap|beauty soap/i,
                image: "assets/img/product/img_02.png",
                description: "Premium Kedicare clinical protocol: Beauty Soap.",
                price: "₦5,400",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []
            }, {
                id: "men-coffee",
                name: "Men Coffee",
                keywords: /men coffee|men coffee/i,
                image: "assets/img/product/kedi.jpg",
                description: "Premium Kedicare clinical protocol: Men Coffee.",
                price: "₦13,500",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/2349015092132",
                blogLink: "https://kedicare.netlify.app/shop.html",
                qna: []


            // Health Conditions Data
            const healthConditions = [{
                name: "Hypertension",
                keywords: /hypertension|high blood pressure|headache|dizziness|shortness of breath/i,
                images: [ // Changed to images array
                    "https://placehold.co/150x150/FF0000/FFFFFF?text=High+BP+1",
                    "https://placehold.co/150x150/CC0000/FFFFFF?text=High+BP+2",
                    "https://placehold.co/150x150/990000/FFFFFF?text=High+BP+3"
                ],
                definition: "Hypertension is a condition in which the force of the blood against the artery walls is too high, often leading to serious health issues.",
                symptoms: "Often asymptomatic; may cause headaches, dizziness, shortness of breath, nosebleeds.",
                dosage: [
                    "Requires antihypertensive medications as prescribed by a doctor.",
                    "Regular monitoring of blood pressure.",
                    "Lifestyle changes such as reducing salt intake and regular exercise."
                ],
                recommendedProducts: ["Cello Q10", "Blood Circulatory Massager"],
                qna: [{
                    question: "What causes Hypertension?",
                    answer: "Causes include genetics, poor diet, lack of physical activity, and stress."
                }, {
                    question: "How can I lower my blood pressure naturally?",
                    answer: "Lifestyle changes like diet modification, regular exercise, and stress management can help lower blood pressure."
                }]
            }, {
                name: "Arthritis",
                keywords: /arthritis|joint pain|inflammation|stiffness/i,
                images: [
                    "https://placehold.co/150x150/008080/FFFFFF?text=Arthritis+Joint",
                    "https://placehold.co/150x150/005050/FFFFFF?text=Inflamed+Joint",
                    "https://placehold.co/150x150/003030/FFFFFF?text=Hand+Pain"
                ],
                definition: "Arthritis is an inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
                symptoms: "Joint pain, stiffness, swelling, redness, and decreased range of motion.",
                dosage: [
                    "Medical consultation for diagnosis and treatment plan.",
                    "Pain management, physical therapy, and anti-inflammatory medications.",
                    "Lifestyle adjustments, including exercise and diet."
                ],
                recommendedProducts: ["Jointeez"],
                qna: [{
                    question: "What are common types of arthritis?",
                    answer: "Common types include osteoarthritis, rheumatoid arthritis, and gout."
                }, {
                    question: "Can diet affect arthritis?",
                    answer: "Some diets, like the Mediterranean diet, may help reduce inflammation associated with certain types of arthritis."
                }]
            }, {
                name: "Anemia",
                keywords: /anemia|low iron|fatigue|weakness|pale skin/i,
                images: [
                    "https://placehold.co/150x150/800000/FFFFFF?text=Anemia+Blood",
                    "https://placehold.co/150x150/500000/FFFFFF?text=Fatigue+Sign",
                    "https://placehold.co/150x150/300000/FFFFFF?text=Pale+Skin"
                ],
                definition: "Anemia is a condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues.",
                symptoms: "Fatigue, weakness, pale skin, shortness of breath, dizziness, cold hands and feet.",
                dosage: [
                    "Diagnosis and treatment by a healthcare professional.",
                    "Iron supplements (if iron deficiency anemia), dietary changes to include iron-rich foods.",
                    "Addressing underlying causes."
                ],
                recommendedProducts: ["Reishi (Blood Tonic)"],
                qna: [{
                a: "You can place an order directly on our website, or through our mobile app. You can also click the 'Buy Now' links provided for each product."
            }, {
                q: /shipping information|delivery time/i,
                a: "Shipping usually takes 3-5 business days depending on your location within Nigeria. International shipping times vary."
            }, {
                q: /return policy|refunds/i,
                a: "We have a 30-day return policy for unopened products. Please see our website for more details or contact our support team."
            }, {
                q: /contact support|customer service|helpline/i,
                a: "You can contact our support team via email at support@kedihealthcare.com or call us at +234 800 123 4567. You can also reach us via WhatsApp using the link: <a href='https://wa.me/message/2349015092132' target='_blank' class='text-green-600 underline'>Chat on WhatsApp</a>."
            }, {
                q: /what is Kedicare|about Kedicare/i,
                a: "Kedicare is a leading traditional Chinese medicine (TCM) company in Nigeria, dedicated to providing high-quality herbal and nutritional supplements for various health needs. We focus on natural solutions for overall well-being."
            }, {
                q: /Kedicare products|what products do you offer/i,
                a: "Kedicare offers a wide range of natural health products, including supplements for immune support (Reishi), male sexual health (Re-Vive), kidney health (Golden Six), digestive health (Colon Cleanse), energy (Vigor Essential), respiratory health (Cordy Active), weight management (Magilim), and cardiovascular health (Blood Fat Reducing)."
            }, {
                q: /Kedicare products list|list all products/i,
                a: "Certainly! Here is a list of Kedicare products: Reishi, Re-Vive, Golden Six, Colon Cleanse, Vigor Essential, Cordy Active, Magilim, and Blood Fat Reducing. You can ask for details on any of these."
            }, {
                q: /Kedicare products details|tell me about your products/i,
                a: "To get details about a specific product, please ask me about it by name, e.g., 'Tell me about Reishi' or 'What is Re-Vive?'"
            }, {
                q: /Kedicare product prices|how much are your products/i,
                a: "Product prices vary. For example, Reishi is ₦35,000, and Re-Vive is ₦39,000. You can ask me about the price of a specific product."
            }, {
                q: /how to make money with kedi|kedi business model|become a kedi distributor|kedi income|kedi earnings|kedi opportunity/i,
                a: `
                    <p class="mb-2">Kedicare offers a unique opportunity to improve your health and wealth through its direct selling and multi-level marketing (MLM) business model. Here's how you can make money with Kedi:</p>
                    <ul class="list-disc list-inside mb-4 text-gray-700">
                        <li><strong>Become a Registered Distributor:</strong> The first step is to register as an independent Kedi distributor. This usually involves a small registration fee and purchasing a starter kit.</li>
                        <li><strong>Retail Profit:</strong> You buy Kedi products at a wholesale price and sell them to customers at the retail price. The difference is your immediate profit.</li>
                        <li><strong>Performance Bonuses:</b> As you sell more products and build a team, you earn performance bonuses based on your personal sales volume and the sales volume of your team (downline). Kedi has a structured compensation plan that rewards higher sales and team growth.</li>
                        <li><strong>Leadership Bonuses:</b> For those who build and mentor successful teams, Kedi offers leadership bonuses and incentives, which can include car awards, house funds, and international trips.</li>
                        <li><strong>Recruitment and Team Building:</strong> A significant part of the MLM model is recruiting new distributors into your team. You earn commissions and bonuses not just from your sales, but also from the sales generated by the people you recruit and their recruits.</li>
                    </ul>
                    <p class="mb-2"><strong>Benefits of the Kedi Business:</strong></p>
                    <ul class="list-disc list-inside mb-4 text-gray-700">
                        <li><strong>Flexibility:</strong> Work at your own pace and set your own hours.</li>
                        <li><strong>High-Quality Products:</strong> Promote natural health products that genuinely benefit people.</li>
                        <li><strong>Training and Support:</b> Kedi often provides training, seminars, and support materials to help distributors succeed.</li>
                        <li><strong>Community:</strong> Become part of a network of like-minded individuals.</li>
                    </ul>
                    <p class="font-semibold text-green-700">To get detailed information on the compensation plan, registration process, and to start your Kedi business, we recommend visiting the official Kedicare website or contacting their nearest office/distributor directly. You can also reach out to our customer service for general inquiries.</p>
                `
            }];


            // Chatbot Responses for general queries
            const chatbotResponses = [{
                keywords: /general health tips|health advice/i,
                answer: "Maintaining good health involves several key practices. Here are some general health tips:"
            }, ];

            // Health Tips
            const generalHealthTips = [
                "Using groundnut oil for frying more than 2 times a day can raise cholesterol levels? 🥜 It contains high levels of saturated fats that can be harmful to your heart!.",
                "Using groundnut oil for cooking can help lower cholesterol levels? 🥜 It contains healthy fats that are good for your heart!.",
                "Don't use groundnut oil for frying? 🥜 It has a low smoke point and can produce harmful compounds when overheated!.",
                "Using sunflower oil for cooking can help lower cholesterol levels? 🌻 It contains healthy fats that are good for your heart!.",
                "Better still, use olive oil for cooking? 🫒 It has a high smoke point and is rich in healthy monounsaturated fats!.",
                "Don't use too much of coconut oil for cooking? 🥥 It contains high levels of saturated fats that can raise cholesterol levels!.",
                "Don't use too much of palm oil for tropical cooking? 🌴 It contains high levels of saturated fats that can raise cholesterol levels!.",
                "🌿 Some herbs like Reishi, Moringa, and Ginseng support immunity and reduce fatigue? 🌱🛡️",
                "🍠 Sweet potatoes are rich in beta-carotene, which helps improve eye health and immunity? 👁️🍠",
                "🧠 Your brain is sometimes more active at night than during the day! 💤 It processes emotions and memories while you sleep.",
                "💧 Drinking water boosts your energy, mood, and focus? 🚰 Even mild dehydration can make you feel tired and foggy!.",
                "🏃‍♂️ Just 30 minutes of walking a day can reduce your risk of heart disease by up to 40%? ❤️.",
                "🍎 Eating an apple a day really can help keep the doctor away? 🍏 Apples are rich in fiber and antioxidants that support gut and heart health!.",
                "😄 Smiling can improve your immune system and lower stress? 😊 It releases endorphins, your body's natural feel-good chemicals..",
                "🌞 10-15 minutes of sunlight a day helps your body make Vitamin D for stronger bones and better mood? ☀️.",
                "🧘‍♀️ Practicing mindfulness and meditation can reduce anxiety and improve your overall well-being? 🧘‍♂️.",
                "🧠 Your brain is sometimes more active at night than during the day! 💤 It processes emotions and memories while you sleep.",
                "💤 Lack of sleep can make you gain weight? 😴 Sleep controls hunger hormones like ghrelin and leptin..",
                "Spend time outdoors for fresh air and sunlight (with sun protection).",
                "🧘‍♂️ Regular physical activity can improve your mood and reduce anxiety? 🏋️‍♀️ Aim for at least 150 minutes of moderate exercise each week.",
                "🧘‍♀️ Practicing yoga can improve flexibility and reduce stress? 🧘‍♂️ Even a few minutes a day can make a difference.",
                "🧄 Garlic is a natural antibiotic? 🧄 It boosts your immune system and fights bacteria and viruses!.",
                "🧘‍♀️ Regular meditation can reduce blood pressure and anxiety? 🧘‍♂️ Just 10 minutes a day can make a big difference.",
                "🧘‍♂️ Deep breathing exercises can help reduce stress and improve focus? 🧘‍♀️ Try taking a few deep breaths right now!",
                "🧘‍♀️ Practicing gratitude can improve your mental health and overall well-being? 🙏 Consider keeping a gratitude journal!",
                "🧘‍♂️ Engaging in creative activities can boost your mood and reduce stress? 🎨 Try drawing, painting, or crafting!",

            ];

            // === UI Element References (initialized on DOMContentLoaded) ===
            let openBtn, closeBtn, chatbotWindow, chatbotInput, chatbotMessages, sendBtn, scrollIndicator;

            // === State Variables ===
            let currentSuggestions = [];
            let waitingForSymptoms = false; // Flag to manage symptom checker state
            let waitingForHealthGoal = false; // Flag for personalized recommendations
            let currentHealthTipIndex = 0; // Index for "Did you know" health tips
            let hasGreeted = false; // New flag to ensure greeting only happens once

            // Variables for scroll indicator dragging
            let isDraggingIndicator = false;
            let startY = 0;
            let startScrollTop = 0;

            // --- DOM Content Loaded Event Listener ---
            document.addEventListener('DOMContentLoaded', async () => {
                // Get references to UI elements
                openBtn = document.getElementById('open-chatbot-btn');
                closeBtn = document.getElementById('close-chatbot-btn');
                chatbotWindow = document.getElementById('chatbot-window');
                chatbotInput = document.getElementById('chatbot-input');
                chatbotMessages = document.getElementById('chatbot-messages');
                sendBtn = document.getElementById('send-btn');
                scrollIndicator = document.getElementById('scroll-indicator');

                // Set the chat icon image source
                // First, remove any existing Font Awesome icon if present
                if (openBtn.querySelector('.fas')) {
                    openBtn.querySelector('.fas').remove();
                }
                // Then, add or update the image element
                let chatIconImg = openBtn.querySelector('img');
                if (!chatIconImg) {
                    chatIconImg = document.createElement('img');
                    openBtn.appendChild(chatIconImg);
                }
                chatIconImg.src = CHAT_ICON_IMAGE_URL;
                chatIconImg.alt = "Chatbot Icon - Replace This Image";


                // === Event Listeners ===
                openBtn.addEventListener('click', handleOpenChatbot);
                closeBtn.addEventListener('click', handleCloseChatbot);
                sendBtn.addEventListener('click', handleSendMessage);
                chatbotInput.addEventListener('keypress', handleInputKeyPress);

                // Event listener for dynamically added Q&A buttons inside product/condition cards
                chatbotMessages.addEventListener('click', (event) => {
                    if (event.target.classList.contains('qna-btn')) {
                        const type = event.target.dataset.type;
                        const name = event.target.dataset.name;
                        displayDetailedInfo(type, name);
                    }
                });

                // Scroll indicator logic
                let hideIndicatorTimeout;

                /**
                 * Updates the position and visibility of the custom scroll indicator.
                 */
                function updateScrollIndicator() {
                    const visibleHeight = chatbotMessages.clientHeight;
                    const scrollHeight = chatbotMessages.scrollHeight;
                    const scrollTop = chatbotMessages.scrollTop;

                    if (scrollHeight <= visibleHeight) {
                        // No scrollbar needed, hide indicator
                        scrollIndicator.style.opacity = '0';
                        return;
                    }

                    // Calculate indicator height proportional to visible content
                    let indicatorHeight = (visibleHeight / scrollHeight) * visibleHeight;
                    // Ensure a minimum height for usability, e.g., 20px
                    indicatorHeight = Math.max(indicatorHeight, 20);

                    // Calculate the maximum scrollable track height for the indicator
                    const maxIndicatorTop = visibleHeight - indicatorHeight;

                    // Calculate indicator top position
                    const scrollRatio = scrollTop / (scrollHeight - visibleHeight);
                    const indicatorTop = scrollRatio * maxIndicatorTop;

                    scrollIndicator.style.height = `${indicatorHeight}px`;
                    scrollIndicator.style.top = `${indicatorTop}px`;
                    scrollIndicator.style.opacity = '1'; // Make it visible

                    // Set a timeout to hide the indicator after a short delay if no further scrolling
                    clearTimeout(hideIndicatorTimeout);
                    hideIndicatorTimeout = setTimeout(() => {
                        if (!isDraggingIndicator) { // Only hide if not dragging
                            scrollIndicator.style.opacity = '0';
                        }
                    }, 1500); // Hide after 1.5 seconds of inactivity
                }

                chatbotMessages.addEventListener('scroll', updateScrollIndicator);
                chatbotMessages.addEventListener('mouseenter', () => {
                    if (chatbotMessages.scrollHeight > chatbotMessages.clientHeight) {
                        scrollIndicator.style.opacity = '1';
                        clearTimeout(hideIndicatorTimeout);
                    }
                });
                chatbotMessages.addEventListener('mouseleave', () => {
                    if (chatbotMessages.scrollHeight > chatbotMessages.clientHeight && !isDraggingIndicator) {
                        hideIndicatorTimeout = setTimeout(() => {
                            scrollIndicator.style.opacity = '0';
                        }, 500); // Fade out faster on mouse leave
                    }
                });

                // Initial update of the scroll indicator when the chatbot opens
                // This will be called when the chatbot is made visible.
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.attributeName === 'class' && chatbotWindow.classList.contains('open')) {
                            updateScrollIndicator();
                            observer.disconnect(); // Disconnect once opened for the first time
                            break;
                        }
                    }
                });
                observer.observe(chatbotWindow, {
                    attributes: true
                });

                // --- Scroll Indicator Draggability ---
                scrollIndicator.addEventListener('mousedown', handleIndicatorMouseDown);
                scrollIndicator.addEventListener('touchstart', handleIndicatorTouchStart, {
                    passive: false
                }); // Use passive: false to allow preventDefault

                document.addEventListener('mousemove', handleIndicatorMouseMove);
                document.addEventListener('touchmove', handleIndicatorTouchMove, {
                    passive: false
                });

                document.addEventListener('mouseup', handleIndicatorMouseUp);
                document.addEventListener('touchend', handleIndicatorTouchEnd);

                // === Event Handlers ===

                /** Handles opening the chatbot window. */
                async function handleOpenChatbot() {
                    chatbotWindow.classList.remove('hidden');
                    chatbotWindow.classList.add('open');
                    openBtn.classList.add('hidden'); // Hide open button when chatbot is open
                    console.log('Chatbot opened. hasGreeted:', hasGreeted); // Debug log

                    if (!hasGreeted) { // Use the new flag
                        console.log('Sending initial greeting...'); // Debug log
                        const options = {
                            hour: 'numeric',
                            hourCycle: 'h23',
                            timeZone: 'Africa/Lagos'
                        };
                        const dateInLagos = new Intl.DateTimeFormat('en-US', options).format(new Date());
                        const hour = parseInt(dateInLagos);

                        let greeting;
                        let emoji;
                        if (hour >= 5 && hour < 12) {
                            greeting = "Good morning";
                            emoji = "☀️";
                        } else if (hour >= 12 && hour < 18) {
                            greeting = "Good afternoon";
                            emoji = "👋";
                        } else {
                            greeting = "Good evening";
                            emoji = "🌙";
                        }

                        // Send the greeting message first and await its completion
                        await sendBotMessageWithTyping(`${greeting} ${emoji}! I'm your Kedicare Assistant. I'm here to help you with:
                            <ul>
                                <li>Product information and benefits 💊</li>
                                <li>Insights into various health conditions 🩺</li>
                                <li>How to start your own Kedi business 💰</li>
                                <li>General health tips and FAQs ❓</li>
                            </ul>
                            How can I help you today?`);

                        // Then display the suggestions
                        displaySuggestions([{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        }, {
                            text: "Tell me about Hydrogen Cup",
                            type: "text"
                        }, {
                            text: "Tell me about Refresh Tea",
                            type: "text"
                        }, {
                            text: "Tell me about Blood Circulatory Massager",
                            type: "text"
                        }, {
                            text: "Tell me about Colon Cleanse",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }]);
                        hasGreeted = true; // Set flag after greeting and initial suggestions
                    }
                }

                /** Handles closing the chatbot window. */
                function handleCloseChatbot() {
                    chatbotWindow.classList.remove('open');
                    chatbotWindow.classList.add('hidden');
                    openBtn.classList.remove('hidden'); // Show open button when chatbot is closed
                }

                /** Handles sending a message when the send button is clicked. */
                function handleSendMessage(e) {
                    e.preventDefault();
                    sendMessage();
                }

                /** Handles sending a message when Enter key is pressed in the input. */
                function handleInputKeyPress(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                    }
                }

                /** Handles mousedown event on the scroll indicator. */
                function handleIndicatorMouseDown(e) {
                    isDraggingIndicator = true;
                    startY = e.clientY;
                    startScrollTop = chatbotMessages.scrollTop;
                    scrollIndicator.classList.add('dragging');
                    e.preventDefault(); // Prevent text selection during drag
                }

                /** Handles touchstart event on the scroll indicator. */
                function handleIndicatorTouchStart(e) {
                    isDraggingIndicator = true;
                    startY = e.touches[0].clientY;
                    startScrollTop = chatbotMessages.scrollTop;
                    scrollIndicator.classList.add('dragging');
                    e.preventDefault(); // Prevent default scrolling
                }

                /** Handles mousemove event for scroll indicator dragging. */
                function handleIndicatorMouseMove(e) {
                    if (!isDraggingIndicator) return;

                    const deltaY = e.clientY - startY;
                    const scrollTrackHeight = chatbotMessages.clientHeight - scrollIndicator.offsetHeight;
                    const scrollContentHeight = chatbotMessages.scrollHeight - chatbotMessages.clientHeight;

                    if (scrollTrackHeight <= 0 || scrollContentHeight <= 0) return;

                    const scrollRatio = deltaY / scrollTrackHeight;
                    let newScrollTop = startScrollTop + scrollRatio * scrollContentHeight;

                    newScrollTop = Math.max(0, Math.min(newScrollTop, scrollContentHeight));

                    chatbotMessages.scrollTop = newScrollTop;
                    updateScrollIndicator(); // Update indicator position immediately
                }

                /** Handles touchmove event for scroll indicator dragging. */
                function handleIndicatorTouchMove(e) {
                    if (!isDraggingIndicator) return;

                    const deltaY = e.touches[0].clientY - startY;
                    const scrollTrackHeight = chatbotMessages.clientHeight - scrollIndicator.offsetHeight;
                    const scrollContentHeight = chatbotMessages.scrollHeight - chatbotMessages.clientHeight;

                    if (scrollTrackHeight <= 0 || scrollContentHeight <= 0) return;

                    const scrollRatio = deltaY / scrollTrackHeight;
                    let newScrollTop = startScrollTop + scrollRatio * scrollContentHeight;

                    newScrollTop = Math.max(0, Math.min(newScrollTop, scrollContentHeight));

                    chatbotMessages.scrollTop = newScrollTop;
                    updateScrollIndicator();
                    e.preventDefault(); // Prevent default scrolling
                }

                /** Handles mouseup event to stop scroll indicator dragging. */
                function handleIndicatorMouseUp() {
                    if (isDraggingIndicator) {
                        isDraggingIndicator = false;
                        scrollIndicator.classList.remove('dragging');
                        updateScrollIndicator(); // Ensure indicator state is correct after drag ends
                    }
                }

                /** Handles touchend event to stop scroll indicator dragging. */
                function handleIndicatorTouchEnd() {
                    if (isDraggingIndicator) {
                        isDraggingIndicator = false;
                        scrollIndicator.classList.remove('dragging');
                        updateScrollIndicator(); // Ensure indicator state is correct after drag ends
                    }
                    // Add a small delay before potentially hiding the indicator after touch end
                    setTimeout(() => {
                        if (!isDraggingIndicator) {
                            scrollIndicator.style.opacity = '0';
                        }
                    }, 500);
                }

                // === Core Chatbot Functions ===

                /**
                 * Adds a message to the chatbot display.
                 * @param {string} sender - 'user' or 'bot'.
                 * @param {string} text - The message content.
                 * @param {boolean} [isTypingIndicator=false] - True if it's a typing indicator.
                 * @returns {HTMLElement} The created message element.
                 */
                function addMessage(sender, text, isTypingIndicator = false) {
                    const msg = document.createElement('div');
                    msg.classList.add('message');

                    if (sender === "user") {
                        msg.classList.add('user-message');
                        msg.textContent = text;
                    } else {
                        msg.classList.add('bot-message');
                        // Create a div for the actual message content to apply padding and background
                        const contentDiv = document.createElement('div');
                        contentDiv.classList.add('bot-message-content');

                        if (isTypingIndicator) {
                            contentDiv.classList.add('typing-indicator');
                            contentDiv.innerHTML = `<span class="dots"><span></span><span></span><span></span></span>`; // Only dots for indicator
                        } else {
                            contentDiv.innerHTML = text; // Use innerHTML for rich content (like product cards)
                        }

                        // Add bot avatar
                        const avatarImg = document.createElement('img');
                        avatarImg.src = BOT_AVATAR_URL;
                        avatarImg.alt = "Bot Avatar";
                        avatarImg.classList.add('bot-avatar');
                        msg.appendChild(avatarImg);
                        msg.appendChild(contentDiv); // Append content div to message
                    }

                    chatbotMessages.appendChild(msg);
                    // Ensure scroll to bottom after adding message
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    updateScrollIndicator(); // Update indicator after new message
                    return msg;
                }

                /**
                 * Creates the HTML string for a product card.
                 * @param {object} product - The product object.
                 * @returns {string} HTML string for the product card.
                 */
                function createProductCardHtml(product) {
                    const qnaButton = product.qna && product.qna.length > 0 ?
                        `<button class="qna-btn suggestion-button" data-type="product" data-name="${product.name}">Q&A</button>` :
                        '';

                    return `
                        <div class="product-card">
                            <div class="image-container">
                                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/CCCCCC/333333?text=Product';" />
                            </div>
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <div class="price">${product.price}</div>
                            <div class="button-group">
                                <a href="${product.buyNowLink}" target="_blank" class="buy-now-btn">Buy Now</a>
                                ${product.blogLink ? `<a href="${product.blogLink}" target="_blank" class="blog-btn">Read Blog</a>` : ''}
                                ${qnaButton}
                                <a href="${WHATSAPP_BUSINESS_LINK}" target="_blank" class="whatsapp-buy-btn">Chat to Buy 💬</a>
                            </div>
                        </div>
                    `;
                }

                /**
                 * Creates the HTML string for a health condition card.
                 * @param {object} condition - The health condition object.
                 * @returns {string} HTML string for the health condition card.
                 */
                function createHealthConditionCardHtml(condition) {
                    const qnaButton = condition.qna && condition.qna.length > 0 ?
                        `<button class="qna-btn suggestion-button" data-type="condition" data-name="${condition.name}">Q&A</button>` :
                        '';

                    let recommendedProductsHtml = '';
                    if (condition.recommendedProducts && condition.recommendedProducts.length > 0) {
                        recommendedProductsHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">Kedicare products that may offer support:</h4>`;
                        condition.recommendedProducts.forEach(prodName => {
                            const product = products.find(p => p.name === prodName);
                            if (product) {
                                recommendedProductsHtml += createProductCardHtml(product);
                            }
                        });
                    } else {
                        recommendedProductsHtml += `<p class="mt-4 text-gray-600">While Kedicare products focus on general well-being, for ${condition.name}, it's crucial to follow medical advice. No specific Kedi product directly treats this condition, but general health support products may be beneficial.</p>`;
                    }

                    // Generate image tags for all images in the array
                    const imagesHtml = condition.images.map(imgSrc => `
                        <img src="${imgSrc}" alt="${condition.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/CCCCCC/333333?text=Condition';" />
                    `).join('');

                    return `
                        <div class="health-condition-card">
                            <div class="image-container">
                                ${imagesHtml}
                            </div>
                            <h4>${condition.name}</h4>
                            ${condition.definition ? `<p><strong class="text-gray-700">Definition:</strong> ${condition.definition}</p>` : ''}
                            <p><strong class="text-gray-700">Symptoms:</strong> ${condition.symptoms}</p>
                            <p><strong class="text-gray-700">Recommended Approach:</strong> ${condition.dosage.join(' ')}</p>
                            ${recommendedProductsHtml}
                            <div class="button-group">
                                ${qnaButton}
                            </div>
                        </div>
                    `;
                }


                /**
                 * Creates the HTML string for a health tip card.
                 * @param {string} tipContent - The content of the health tip.
                 * @returns {string} HTML string for the health tip card.
                 */
                function createHealthTipCardHtml(tipContent) {
                    return `
                        <div class="health-tip-card">
                            <h4 class="font-bold text-lg mb-2">💡 Did you know? 💡</h4>
                            <p>${tipContent}</p>
                            <small class="text-gray-500 mt-2 block"><em>Please note: These are general health tips and not a substitute for professional medical advice. Always consult a healthcare professional for personalized guidance.</em></small>
                        </div>
                    `;
                }


                /**
                 * Displays a set of clickable suggestions to the user.
                 * @param {Array<Object>} suggestions - An array of suggestion objects { text: string, type: string, [url]: string, [name]: string }.
                 */
                function displaySuggestions(suggestions) {
                    currentSuggestions = suggestions; // Store current suggestions
                    const suggestionsContainer = document.createElement('div');
                    suggestionsContainer.className = 'suggestions-container bot-message'; // Apply bot-message styling
                    suggestionsContainer.style.background = 'transparent'; // Override background for buttons

                    suggestions.forEach(suggestion => {
                        const button = document.createElement('button');
                        button.className = 'suggestion-button';
                        button.textContent = suggestion.text;
                        button.dataset.type = suggestion.type; // e.g., 'text', 'product-qna', 'condition-qna'
                        if (suggestion.name) { // For product/condition specific Q&A
                            button.dataset.name = suggestion.name;
                        }

                        if (suggestion.type === "link" && suggestion.url) { // Handle link type suggestions
                            button.addEventListener('click', () => {
                                window.open(suggestion.url, '_blank');
                                addMessage('user', suggestion.text); // Show user's "click" as a message
                                chatbotInput.value = ''; // Clear input after suggestion click
                                suggestionsContainer.remove();
                                currentSuggestions = [];
                            });
                        } else {
                            button.addEventListener('click', () => {
                                addMessage('user', suggestion.text); // Show user's "click" as a message
                                chatbotInput.value = ''; // Clear input after suggestion click
                                respondToUser(suggestion.text);
                                // Remove suggestions after one is clicked
                                suggestionsContainer.remove();
                                currentSuggestions = [];
                            });
                        }
                        suggestionsContainer.appendChild(button);
                    });
                    chatbotMessages.appendChild(suggestionsContainer);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    updateScrollIndicator(); // Update indicator after new suggestions
                }

                /**
                 * Simulates bot typing and then displays the full message.
                 * @param {string} messageContent - The message to display.
                 * @param {number} delayPerChar - Delay in ms per character for typing effect.
                 * @param {number} delayBetweenStages - Delay in ms before showing full message.
                 */
                async function sendBotMessageWithTyping(messageContent, delayPerChar = 20, delayBetweenStages = 300) {
                    // Create and append a temporary typing indicator message
                    const typingIndicatorMessage = addMessage("bot", "", true); // isTypingIndicator = true
                    console.log('Typing indicator added.'); // Debug log

                    // Scroll to bottom to show typing indicator
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                    // Simulate typing delay
                    await new Promise(resolve => setTimeout(resolve, delayBetweenStages));
                    console.log('Typing delay finished.'); // Debug log

                    // Remove the typing indicator message
                    typingIndicatorMessage.remove();
                    console.log('Typing indicator removed.'); // Debug log

                    // Add the actual message content
                    addMessage("bot", messageContent);
                    console.log('Actual message added.'); // Debug log

                    // Ensure scroll to bottom after adding the full message
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    updateScrollIndicator(); // Update scroll indicator after final message
                }


                /**
                 * Displays detailed information about a product or health condition, including Q&A.
                 * @param {string} type - 'product' or 'condition'.
                 * @param {string} name - The name of the product or condition.
                 */
                async function displayDetailedInfo(type, name) {
                    let item;
                    let responseHtml = '';
                    let suggestions = [];

                    if (type === 'product') {
                        item = products.find(p => p.name === name);
                        if (item) {
                            responseHtml += `<h3 class="text-xl font-bold text-purple-700 mb-4">Product Details: ${item.name} 💊</h3>`; // Section heading with emoji
                            responseHtml += createProductCardHtml(item);
                            if (item.qna && item.qna.length > 0) {
                                responseHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">Frequently Asked Questions about ${item.name}:</h4><ul>`; // Section heading
                                item.qna.forEach(qa => {
                                    responseHtml += `<li class="mb-2"><strong class="text-green-700">${qa.question}</strong><br>${qa.answer}</li>`;
                                });
                                responseHtml += `</ul>`;
                            } else {
                                responseHtml += `<p class="mt-4 text-gray-600">No specific Q&A available for ${item.name} at the moment.</p>`;
                            }

                            // If the product is a soap, suggest other soaps
                            if (item.type === 'Soaps') {
                                const otherSoaps = products.filter(p => p.type === 'Soaps' && p.id !== item.id); // Use ID for uniqueness
                                if (otherSoaps.length > 0) {
                                    responseHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">You might also be interested in these other Kedicare soaps:🧼</h4>`; // Section heading with emoji
                                    otherSoaps.forEach(soap => {
                                        responseHtml += createProductCardHtml(soap);
                                        suggestions.push({
                                            text: `Tell me about ${soap.name}`,
                                            type: "text"
                                        });
                                    });
                                }
                            }

                            // Add specific buy suggestions after product details
                            suggestions.push({
                                text: `Buy ${item.name}`,
                                type: "link",
                                url: item.buyNowLink
                            });
                            suggestions.push({
                                text: `Chat to Buy ${item.name} 💬`,
                                type: "link",
                                url: WHATSAPP_BUSINESS_LINK
                            });
                            suggestions.push({
                                text: `More about Kedi products`,
                                type: "text"
                            });
                            suggestions.push({
                                text: `List all products`,
                                type: "text"
                            });
                            suggestions.push({
                                text: `General health tips 💡`,
                                type: "text"
                            });
                            suggestions.push({
                                text: "Symptom Checker ✨",
                                type: "text"
                            });
                            suggestions.push({
                                text: "Personalized Product Recommendation ✨",
                                type: "text"
                            });
                        }
                    } else if (type === 'condition') {
                        item = healthConditions.find(c => c.name === name);
                        if (item) {
                            responseHtml += `<h3 class="text-xl font-bold text-purple-700 mb-4">Health Challenge: ${item.name} 🩺</h3>`; // Section heading with emoji
                            responseHtml += createHealthConditionCardHtml(item); // Use the new function here

                            if (item.qna && item.qna.length > 0) {
                                responseHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">Frequently Asked Questions:</h4><ul>`; // Section heading
                                item.qna.forEach(qa => {
                                    responseHtml += `<li class="mb-2"><strong class="text-green-700">${qa.question}</strong><br>${qa.answer}</li>`;
                                });
                                responseHtml += `</ul>`;
                            } else {
                                responseHtml += `<p class="mt-4 text-gray-600">No specific Q&A available for ${item.name} at the moment.</p>`;
                            }
                            suggestions.push({
                                text: `More health conditions`,
                                type: "text"
                            });
                            suggestions.push({
                                text: "General health tips 💡",
                                type: "text"
                            });
                            suggestions.push({
                                text: "Symptom Checker ✨",
                                type: "text"
                            });
                            suggestions.push({
                                text: "Personalized Product Recommendation ✨",
                                type: "text"
                            });
                        }
                    }

                    if (responseHtml) {
                        await sendBotMessageWithTyping(responseHtml);
                        if (suggestions.length > 0) {
                            displaySuggestions(suggestions);
                        }
                    }
                }

                /** Handles sending a message from the user. */
                async function sendMessage() {
                    const userMessage = chatbotInput.value.trim();
                    if (userMessage === '') return;

                    addMessage('user', userMessage);
                    chatbotInput.value = ''; // Clear input immediately

                    await respondToUser(userMessage);
                }

                /**
                 * Displays a single "Did you know?" health tip along with a "Next Tip" button.
                 * @param {number} index - The index of the tip to display.
                 */
                async function displayHealthTip(index) {
                    if (index >= 0 && index < generalHealthTips.length) {
                        const tip = generalHealthTips[index];
                        // Using the new createHealthTipCardHtml function
                        const styledTip = createHealthTipCardHtml(tip);
                        await sendBotMessageWithTyping(styledTip);
                        currentHealthTipIndex = index; // Update the current index

                        const suggestions = [];
                        suggestions.push({
                            text: "Next Tip",
                            type: "text",
                            action: "next-tip"
                        });
                        suggestions.push({
                            text: "See all health tips",
                            type: "text"
                        }); // Option to see all tips at once
                        suggestions.push({
                            text: "Back to main menu",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                    } else {
                        // If all tips have been shown, or index is out of bounds
                        await sendBotMessageWithTyping("That's all the tips I have for now! I hope they were helpful.");
                        currentHealthTipIndex = 0; // Reset for next time
                        displaySuggestions([{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, // Offer to restart tips
                        {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }]);
                    }
                }

                /**
                 * Responds to the user's message based on predefined rules or LLM.
                 * @param {string} message - The user's message.
                 */
                async function respondToUser(message) {
                    const lowerCaseMessage = message.toLowerCase();
                    let botResponse = "I'm sorry, I didn't quite understand that. Could you please rephrase or ask something else?";
                    let suggestions = [];

                    // 1. Handle "Next Tip" button click
                    if (lowerCaseMessage === "next tip") {
                        currentHealthTipIndex++;
                        await displayHealthTip(currentHealthTipIndex);
                        return;
                    }
                    // 2. Handle "See all health tips"
                    if (lowerCaseMessage === "see all health tips") {
                        let tipsHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">All General Health Tips: 💡</h3>`; // Section heading with emoji
                        generalHealthTips.forEach(tip => {
                            tipsHtml += createHealthTipCardHtml(tip); // Use card for each tip
                        });
                        await sendBotMessageWithTyping(tipsHtml);
                        suggestions = [{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, // Offer to restart tips
                        {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }];
                        displaySuggestions(suggestions);
                        return;
                    }
                    // 3. Handle "Back to main menu"
                    if (lowerCaseMessage === "back to main menu") {
                        await sendBotMessageWithTyping("Welcome back to the main menu! How can I help you further?");
                        suggestions = [{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        }, {
                            text: "Tell me about Diabetes",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }];
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 4. Handle "List all products"
                    if (lowerCaseMessage === "list all products") {
                        const groupedProducts = products.reduce((acc, product) => {
                            (acc[product.type] = acc[product.type] || []).push(product);
                            return acc;
                        }, {});

                        let allProductsHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">Our Products by Category: 🛍️</h3>`; // Section heading with emoji
                        for (const type in groupedProducts) {
                            allProductsHtml += `<h4 class="text-lg font-semibold text-purple-600 mt-4 mb-2">${type}</h4>`;
                            groupedProducts[type].forEach(product => {
                                allProductsHtml += createProductCardHtml(product);
                                suggestions.push({
                                    text: `Tell me about ${product.name}`,
                                    type: "text"
                                });
                            });
                        }
                        await sendBotMessageWithTyping(allProductsHtml);
                        suggestions.push({
                            text: "General health tips 💡",
                            type: "text"
                        }, {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 5. Direct Product/Health Condition Lookup (NEW LOGIC)
                    let foundItem = null;
                    // Check products first
                    for (const product of products) {
                        if (lowerCaseMessage.includes(product.name.toLowerCase()) || product.keywords.test(lowerCaseMessage)) {
                            foundItem = { type: 'product', name: product.name };
                            break;
                        }
                    }
                    // If not a product, check health conditions
                    if (!foundItem) {
                        for (const condition of healthConditions) {
                            if (lowerCaseMessage.includes(condition.name.toLowerCase()) || condition.keywords.test(lowerCaseMessage)) {
                                foundItem = { type: 'condition', name: condition.name };
                                break;
                            }
                        }
                    }

                    if (foundItem) {
                        await displayDetailedInfo(foundItem.type, foundItem.name);
                        return; // Exit function after handling direct lookup
                    }


                    // 6. --- Symptom Checker Logic ---
                    if (lowerCaseMessage.includes("symptom checker")) {
                        waitingForSymptoms = true;
                        await sendBotMessageWithTyping("I can help you with a symptom checker. Please list your symptoms, separated by commas (e.g., 'headache, fever, cough'). 🤒"); // Added emoji
                        suggestions.push({
                            text: "Back to main menu",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    if (waitingForSymptoms) {
                        const symptoms = lowerCaseMessage.split(',').map(s => s.trim());
                        await sendBotMessageWithTyping("Thank you for providing your symptoms. Let me analyze them to see if I can find a match or provide some general guidance. 🤔"); // Added emoji

                        let matchedConditions = [];
                        healthConditions.forEach(condition => {
                            const conditionKeywords = condition.keywords.source.split('|').map(k => k.replace(/\\/g, '').trim());
                            const commonSymptoms = symptoms.filter(symptom =>
                                conditionKeywords.some(keyword => symptom.includes(keyword))
                            );
                            if (commonSymptoms.length > 0) {
                                matchedConditions.push(condition);
                            }
                        });

                        if (matchedConditions.length > 0) {
                            let conditionsHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">Possible Health Conditions: 🩺</h3>`; // Section heading with emoji
                            conditionsHtml += `<p class="mb-4">Based on your symptoms, here are some health conditions that might be relevant. Please remember, I am an AI and cannot provide medical diagnoses. Always consult a healthcare professional for accurate diagnosis and treatment:</p>`;
                            matchedConditions.forEach(condition => {
                                conditionsHtml += createHealthConditionCardHtml(condition); // Use the new function here
                            });
                            conditionsHtml += `<small class="text-gray-500"><em>Please note: This information is for general guidance and not a substitute for professional medical diagnosis or treatment. Always consult a healthcare professional for accurate diagnosis and treatment.</em></small>`;
                            await sendBotMessageWithTyping(conditionsHtml);
                        } else {
                            await sendBotMessageWithTyping("I couldn't find a direct match for your symptoms in my database. It's crucial to consult a healthcare professional for any health concerns. Would you like general health tips instead?");
                            suggestions.push({
                                text: "General health tips 💡",
                                type: "text"
                            });
                        }
                        waitingForSymptoms = false; // Reset flag
                        suggestions.push({
                            text: "List all products",
                            type: "text"
                        });
                        suggestions.push({
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        });
                        suggestions.push({
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 7. --- Personalized Product Recommendation Logic ---
                    if (lowerCaseMessage.includes("personalized product recommendation")) {
                        waitingForHealthGoal = true;
                        await sendBotMessageWithTyping("I can help you find products based on your health goals! Please tell me what health area you are interested in (e.g., 'immunity', 'energy', 'digestion', 'skin health'). 🎯"); // Added emoji
                        suggestions.push({
                            text: "Back to main menu",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    if (waitingForHealthGoal) {
                        const healthGoal = lowerCaseMessage;
                        let recommendedProductsSet = new Set(); // Use a Set to store unique products

                        // Function to add products to the set based on keywords
                        const addProductsByKeywords = (keywords) => {
                            products.filter(p => keywords.some(k => healthGoal.includes(k)))
                                .forEach(p => recommendedProductsSet.add(p));
                        };

                        // Enhanced keyword matching for various health goals
                        if (healthGoal.includes("immune") || healthGoal.includes("immunity") || healthGoal.includes("boost health") || healthGoal.includes("fight infection")) {
                            addProductsByKeywords(["reishi", "small reishi", "golden hypha", "small golden hypha"]);
                        }
                        if (healthGoal.includes("energy") || healthGoal.includes("stamina") || healthGoal.includes("vitality") || healthGoal.includes("fatigue")) {
                            addProductsByKeywords(["vigor essential", "cordy active", "small cordy active", "cordy royal jelly", "small cordy royal jelly"]);
                        }
                        if (healthGoal.includes("male sexual health") || healthGoal.includes("libido") || healthGoal.includes("erection") || healthGoal.includes("male performance")) {
                            addProductsByKeywords(["re-vive", "packet re-vive", "vigor essential"]);
                        }
                        if (healthGoal.includes("diabetes") || healthGoal.includes("blood sugar") || healthGoal.includes("glucose")) {
                            addProductsByKeywords(["diawell"]);
                        }
                        if (healthGoal.includes("joint pain") || healthGoal.includes("arthritis") || healthGoal.includes("rheumatic") || healthGoal.includes("bone health")) {
                            addProductsByKeywords(["jointeez"]);
                        }
                        if (healthGoal.includes("weight management") || healthGoal.includes("lose weight") || healthGoal.includes("fat burning") || healthGoal.includes("obesity")) {
                            addProductsByKeywords(["magilim"]);
                        }
                        if (healthGoal.includes("memory") || healthGoal.includes("concentration") || healthGoal.includes("brain") || healthGoal.includes("cognitive function")) {
                            addProductsByKeywords(["memory 24/7 capsule"]);
                        }
                        if (healthGoal.includes("vision") || healthGoal.includes("eye fatigue") || healthGoal.includes("eye health")) {
                            addProductsByKeywords(["eye beta capsule", "refresh tea"]);
                        }
                        if (healthGoal.includes("stomach") || healthGoal.includes("digestion") || healthGoal.includes("ulcers") || healthGoal.includes("gastric")) {
                            addProductsByKeywords(["gastrifort capsule", "constilease", "colon cleanse"]);
                        }
                        if (healthGoal.includes("female reproductive health") || healthGoal.includes("hormonal balance") || healthGoal.includes("pid") || healthGoal.includes("ovarian cysts") || healthGoal.includes("menstrual")) {
                            addProductsByKeywords(["gynapharm capsule", "golden six"]);
                        }
                        if (healthGoal.includes("prostate health") || healthGoal.includes("urinary health male")) {
                            addProductsByKeywords(["lycovite"]);
                        }
                        if (healthGoal.includes("cardiovascular") || healthGoal.includes("heart health") || healthGoal.includes("blood pressure") || healthGoal.includes("cholesterol")) {
                            addProductsByKeywords(["cello q10", "blood circulatory massager"]); // Added BCM
                        }
                        if (healthGoal.includes("blood health") || healthGoal.includes("anemia") || healthGoal.includes("iron deficiency") || healthGoal.includes("blood circulation")) {
                            addProductsByKeywords(["reishi (blood tonic)", "blood circulatory massager"]); // Added BCM
                        }
                        if (healthGoal.includes("oral hygiene") || healthGoal.includes("toothache") || healthGoal.includes("dental pain") || healthGoal.includes("gum health")) {
                            addProductsByKeywords(["gum care toothpaste"]);
                        }
                        if (healthGoal.includes("detox") || healthGoal.includes("cleanse") || healthGoal.includes("liver detox")) {
                            addProductsByKeywords(["refresh tea", "colon cleanse"]);
                        }
                        if (healthGoal.includes("water") || healthGoal.includes("hydration") || healthGoal.includes("alkaline")) {
                            addProductsByKeywords(["hydrogen cup"]);
                        }
                        if (healthGoal.includes("acne") || healthGoal.includes("skin care") || healthGoal.includes("pimple")) {
                            addProductsByKeywords(["sulphur-anti-acne-soap", "pearl-whitening-soap", "nano-silver-antibacterial-soap"]); // All soaps for skin care
                        }
                        if (healthGoal.includes("whitening") || healthGoal.includes("brighten skin") || healthGoal.includes("lighten skin") || healthGoal.includes("pigmentation")) {
                            addProductsByKeywords(["pearl-whitening-soap"]);
                        }
                        if (healthGoal.includes("antibacterial") || healthGoal.includes("germs") || healthGoal.includes("deep cleansing") || healthGoal.includes("skin hygiene")) {
                            addProductsByKeywords(["nano-silver-antibacterial-soap"]);
                        }
                        if (healthGoal.includes("coffee") || healthGoal.includes("healthy coffee") || healthGoal.includes("energy drink")) {
                            addProductsByKeywords(["kedi coffee"]);
                        }


                        const recommendedProducts = Array.from(recommendedProductsSet); // Convert Set back to Array

                        if (recommendedProducts.length > 0) {
                            // Group recommended products by type
                            const groupedProducts = recommendedProducts.reduce((acc, product) => {
                                (acc[product.type] = acc[product.type] || []).push(product);
                                return acc;
                            }, {});

                            let productHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">Personalized Product Recommendations: ✨</h3>`; // Section heading with emoji
                            productHtml += `<p class="mb-4">Based on your health goal of "${healthGoal}", here are some Kedicare products you might find beneficial:</p>`;
                            for (const type in groupedProducts) {
                                productHtml += `<h4 class="text-lg font-semibold text-purple-600 mt-4 mb-2">${type}</h4>`;
                                groupedProducts[type].forEach(product => {
                                    productHtml += createProductCardHtml(product);
                                    suggestions.push({
                                        text: `Tell me about ${product.name}`,
                                        type: "text"
                                    });
                                });
                            }
                            productHtml += `<small class="text-gray-500"><em>Please note: These recommendations are based on general health goals and are not a substitute for professional medical advice. Always consult a healthcare professional for personalized guidance.</em></small>`;
                            await sendBotMessageWithTyping(productHtml);
                        } else {
                            await sendBotMessageWithTyping("I couldn't find specific product recommendations for that health goal in my current database. Kedicare has many products for general well-being. Would you like to see a list of all products or get general health tips?");
                            suggestions.push({
                                text: "List all products",
                                type: "text"
                            });
                            suggestions.push({
                                text: "General health tips 💡",
                                type: "text"
                            });
                        }
                        waitingForHealthGoal = false; // Reset flag
                        suggestions.push({
                            text: "Symptom Checker ✨",
                            type: "text"
                        });
                        suggestions.push({
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 8. Handle "General health tips"
                    if (lowerCaseMessage.includes("general health tips")) {
                        currentHealthTipIndex = 0; // Reset to first tip
                        await displayHealthTip(currentHealthTipIndex);
                        return;
                    }

                    // 9. Handle general FAQs
                    for (const faq of faqs) {
                        if (faq.q.test(lowerCaseMessage)) {
                            await sendBotMessageWithTyping(faq.a);
                            // Always offer general suggestions after an FAQ response
                            displaySuggestions([{
                                text: "List all products",
                                type: "text"
                            }, {
                                text: "How to make money with Kedi? 💰",
                                type: "text"
                            }, {
                                text: "General health tips 💡",
                                type: "text"
                            }, {
                                text: "Symptom Checker ✨",
                            }, {
                                text: "Personalized Product Recommendation ✨",
                                type: "text"
                            }, {
                                text: "Contact support 📞",
                                type: "text"
                            }, {
                                text: "Bonus Coupon 🎁",
                                type: "text"
                            }]);
                            return; // Exit function after handling FAQ
                        }
                    }


                    // 10. Fallback to LLM if no specific match
                    // Remove any existing typing indicators before making a new one
                    const existingTypingIndicators = chatbotMessages.querySelectorAll('.typing-indicator');
                    existingTypingIndicators.forEach(indicator => indicator.remove());

                    // Display "thinking" message
                    await sendBotMessageWithTyping("Let me think about that for a moment... 🤔"); // Added emoji
                    console.log('Initiating Gemini API call...'); // Debug log
                    try {
                        const chatHistory = [{
                            role: "user",
                            parts: [{
                                text: message
                            }]
                        }];
                        const payload = {
                            contents: chatHistory
                        };
                        const response = await fetch(API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        console.log('Gemini API response received, status:', response.status); // Debug log
                        const result = await response.json();
                        console.log('Gemini API response JSON:', result); // Debug log

                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            botResponse = result.candidates[0].content.parts[0].text;
                        } else {
                            botResponse = "I'm having trouble connecting to my knowledge base right now. Please try again later or ask a different question. 🚧"; // Added emoji
                            console.warn('Gemini API response structure unexpected or empty.'); // Debug log
                        }
                    } catch (error) {
                        console.error("Error calling Gemini API:", error); // Debug log
                        botResponse = "I'm currently experiencing technical difficulties and cannot process your request. Please try again in a moment. 🛠️"; // Added emoji
                    }

                    // Added disclaimer for LLM generated responses
                    await sendBotMessageWithTyping(`${botResponse}<br><br><small class="text-gray-500"><em>Please note: This information is AI-generated and for general informational purposes only. It is not medical advice. Always consult a healthcare professional for specific health concerns.</em></small>`);
                    // Always offer general suggestions after an LLM response
                    displaySuggestions([{
                        text: "List all products",
                        type: "text"
                    }, {
                        text: "How to make money with Kedi? 💰",
                        type: "text"
                    }, {
                        text: "General health tips 💡",
                        type: "text"
                    }, {
                        text: "Symptom Checker ✨",
                    }, {
                        text: "Personalized Product Recommendation ✨",
                        type: "text"
                    }, {
                        text: "Contact support 📞",
                        type: "text"
                    }, {
                        text: "Bonus Coupon 🎁",
                        type: "text"

                    }]);
                }
            });

            // --- LLM Feature Modal Logic (retained from previous version) ---

            // DOM Element References for Modal (these are outside the main chatbot.js scope but are needed)
            const llmModalOverlay = document.getElementById('llm-modal-overlay');
            const llmModalCloseButton = document.getElementById('llm-modal-close-button');
            const llmModalTitle = document.getElementById('llm-modal-title');
            const llmModalBody = document.getElementById('llm-modal-body');
            const llmModalLoading = document.getElementById('llm-loading-indicator');

            // Function to open the LLM output modal
            function openLlmModal(title, content) {
                llmModalTitle.textContent = title;
                llmModalBody.innerHTML = content; // Use innerHTML to render formatted text
                llmModalOverlay.classList.add('active');
            }

            // Function to close the LLM output modal
            function closeLlmModal() {
                llmModalOverlay.classList.remove('active');
                llmModalTitle.textContent = '';
                llmModalBody.innerHTML = '';
                llmModalLoading.classList.add('hidden'); // Ensure loading is hidden on close
            }

            // Event listener for closing modal
            llmModalCloseButton.addEventListener('click', closeLlmModal);
            llmModalOverlay.addEventListener('click', (event) => {
                if (event.target === llmModalOverlay) {
                    closeLlmModal();
                }
            });

            // === Function to Show Coupon Code ===
async function showCoupon() {
    const coupon = "123556"; // Fixed 6-digit coupon
    let responseHtml = `
        <h3 class="text-xl font-bold text-purple-700 mb-4">🎉 Your Kedi Bonus Coupon</h3>
        <p><strong>Coupon Code:</strong> 
           <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">${coupon}</span>
        </p>
        <p class="mt-2 text-gray-700">Use this coupon during registration to enjoy a special bonus as a new user.</p>
    `;
    await sendBotMessageWithTyping(responseHtml);
}

// === Update respondToUser() ===
async function respondToUser(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Handle Bonus Coupon
    if (lowerCaseMessage.includes("bonus coupon") || lowerCaseMessage.includes("new user coupon")) {
        await showCoupon();
        return;
    }

    // ... keep existing logic
}


            // Function to call Gemini API for LLM features (summarize/FAQ) - retained and adapted
            async function callGeminiForLlmFeature(promptText, modalTitle, isStructuredResponse = false) {
                openLlmModal(modalTitle, ''); // Open modal with title, empty body
                llmModalLoading.classList.remove('hidden'); // Show loading indicator

                try {
                    let payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };
                    const apiKey = ""; // Canvas will automatically provide this at runtime
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                    if (isStructuredResponse) {
                        payload.generationConfig = {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        "question": { "type": "STRING" },
                                        "answer": { "type": "STRING" }
                                    },
                                    "propertyOrdering": ["question", "answer"]
                                }
                            }
                        };
                    }

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorBody = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
                    }

                    const result = await response.json();
                    llmModalLoading.classList.add('hidden'); // Hide loading indicator

                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        let content = result.candidates[0].content.parts[0].text;

                        if (isStructuredResponse) {
                            try {
                                const parsedJson = JSON.parse(content);
                                let formattedContent = '';
                                if (Array.isArray(parsedJson)) {
                                    parsedJson.forEach(item => {
                                        if (item.question && item.answer) {
                                            formattedContent += `<p class="font-semibold text-lg mt-4 mb-2">${item.question}</p><p>${item.answer}</p>`;
                                        }
                                    });
                                }
                                llmModalBody.innerHTML = formattedContent || '<p>No structured content available.</p>';
                            } catch (jsonError) {
                                llmModalBody.innerHTML = `<p class="text-red-500">Error parsing structured response: ${jsonError.message}</p><p>Raw response: ${content}</p>`;
                                console.error('Error parsing JSON from Gemini API:', jsonError);
                            }
                        } else {
                            llmModalBody.innerHTML = content.replace(/\n/g, '<br>'); // Render newlines as <br>
                        }
                    } else {
                        llmModalBody.innerHTML = '<p class="text-red-500">Sorry, I could not generate content. The AI provided an empty or malformed response. 🤔</p>';
                        console.error('Gemini API response structure unexpected or empty:', result);
                    }
                } catch (error) {
                    llmModalLoading.classList.add('hidden'); // Hide loading indicator
                    llmModalBody.innerHTML = `<p class="text-red-500">Error communicating with the AI: ${error.message}. Please try again later. 🚧</p>`;
                    console.error('Error calling Gemini API for LLM feature:', error);
                }
            }
        })();

## Health Disease
## health-seo-package/content/disease-guides Disease
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/acidreflux.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/acne.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/addisons.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/adhd.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/alopecia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/alzheimmers.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/anemia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/anxiety.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/appendicitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/arrhythmia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/asthma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/athletesfoot.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/autism.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/backpain.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/bacterialvaginosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/bipolardisorder.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/bladdercancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/botulism.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/braintumor.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/breastcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/breastcysts.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/campylobacter.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/candida.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/capaltunnel.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cataracts.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/celiacdisease.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cerebralpalsy.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cervicaldysplasia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chickenpox.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chikungunya.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/childrenhealth-seo-package/content/disease-guides.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chlamydia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cholera.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chronicbronchitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chronicfatique.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chronickidneydisease.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/chronicpain.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/coldscores.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/colorectalcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/conjunctivitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/constipation.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/coronaryartery.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/covid-19recovery.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/crohnsdisease.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cushings.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/cysticfibrosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/dandruff.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/dementia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/denguefever.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/depression.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/detox.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/diabeticretinipathy.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/diarrhea.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/diphtheria.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/downsyndrome.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/dryeye.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/dvt.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/dysentery.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/e.coli.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ebola.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/eczema.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/endomentriosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/epilepsy.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/erectile-dysfunction.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/esophageal-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ewing-sarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/fatty-liver-disease.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/female-infertility.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/fibroid.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/fibromyalgia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/food-poisoning.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/gallstones.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/gastritis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/gingivitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/glaucoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/glioblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/goiter.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/gonorrhea.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/gout.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hair-loss.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/halitosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/heart-failure.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hemophilia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hemorrhoids.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hepatitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hernia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/herniated-disc.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/herpes.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/high-cholesterol.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hiv-aids.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hormonal-balance.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hpv.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hypertension.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hyportension.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/hypothroidism.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/IBS.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/immune.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/insomia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/jock-itch.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/kidney.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/kidneycancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/kidneyfailure.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/kidneystones.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/kyphosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/laryngitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lassafever.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/leukemia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lice.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/listeria.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/livercancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/livercirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lowspermcount.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lungcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lupus.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lymedisease.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/lymphoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/masculardegeneration.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/malaria.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/malevitality.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/measles.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/melanoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/memoryloss.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/menopause.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/menstrualcramps.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/mentalhealth-seo-package/content/disease-guides.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/migraines.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/multiplemyeloma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/mumps.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/musculardystrophy.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/nailfungus.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/neuroblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/non-hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/norovirus.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/nutrition.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/obesity.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/osteoarthritis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/osteoporosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/osteosarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/otitismedia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ovariancancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ovariancysts.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pancreaticcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pancreatitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/parkinson.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pcos.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pepticulcer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/periodontitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/peripheralartery.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pharyngitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pid.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pneumonia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/polio.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/pregnancy.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/premature-ejaculation.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/prostate.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/prostate-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/prostatitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/psoriasis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/rabies.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/retinoblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/rheumatoid-arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ringworm.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/rosacea.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/rotavirus.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/rubella.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/salmonella.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/scabies.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/schizzophrenia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/sciatica.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/scoliosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/shingles.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/sicklecell.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/sinusitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/spinabifida.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/stomachcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/strokerecovery.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/sypilis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/testicularcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/tetanus.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/thalasemia.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/thyroidcancer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/tinnitus.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/tonsillitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/toothdecay.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/trichomoniasis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/tuberculosis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/type2diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/typhoidfever.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ulcer.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/ulcerative-colitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/urinary-tract-infection.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/uterine-polyps.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/vaginitis.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/varicose-veins.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/vertigo.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/vitiligo.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/warts.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/weight.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/whooping-cough.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/wilms-tumor.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/women-health-seo-package/content/disease-guides.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/yeast-infection.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/yellow-fever.md
- https://kedicare.netlify.app/health-seo-package/content/disease-guides/zika-virus.md



## health-seo-package/content/prevention-guides 
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/acidreflux.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/acne.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/addisons.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/adhd.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/alopecia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/alzheimmers.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/anemia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/anxiety.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/appendicitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/arrhythmia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/asthma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/athletesfoot.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/autism.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/backpain.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/bacterialvaginosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/bipolardisorder.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/bladdercancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/botulism.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/braintumor.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/breastcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/breastcysts.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/campylobacter.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/candida.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/capaltunnel.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cataracts.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/celiacdisease.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cerebralpalsy.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cervicaldysplasia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chickenpox.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chikungunya.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/childrenhealth-seo-package/content/prevention-guides.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chlamydia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cholera.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chronicbronchitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chronicfatique.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chronickidneydisease.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/chronicpain.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/coldscores.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/colorectalcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/conjunctivitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/constipation.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/coronaryartery.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/covid-19recovery.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/crohnsdisease.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cushings.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/cysticfibrosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/dandruff.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/dementia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/denguefever.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/depression.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/detox.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/diabeticretinipathy.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/diarrhea.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/diphtheria.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/downsyndrome.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/dryeye.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/dvt.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/dysentery.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/e.coli.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ebola.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/eczema.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/endomentriosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/epilepsy.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/erectile-dysfunction.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/esophageal-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ewing-sarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/fatty-liver-disease.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/female-infertility.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/fibroid.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/fibromyalgia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/food-poisoning.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/gallstones.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/gastritis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/gingivitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/glaucoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/glioblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/goiter.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/gonorrhea.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/gout.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hair-loss.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/halitosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/heart-failure.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hemophilia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hemorrhoids.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hepatitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hernia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/herniated-disc.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/herpes.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/high-cholesterol.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hiv-aids.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hormonal-balance.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hpv.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hypertension.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hyportension.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/hypothroidism.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/IBS.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/immune.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/insomia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/jock-itch.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/kidney.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/kidneycancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/kidneyfailure.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/kidneystones.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/kyphosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/laryngitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lassafever.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/leukemia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lice.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/listeria.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/livercancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/livercirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lowspermcount.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lungcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lupus.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lymedisease.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/lymphoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/masculardegeneration.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/malaria.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/malevitality.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/measles.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/melanoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/memoryloss.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/menopause.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/menstrualcramps.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/mentalhealth-seo-package/content/prevention-guides.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/migraines.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/multiplemyeloma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/mumps.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/musculardystrophy.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/nailfungus.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/neuroblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/non-hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/norovirus.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/nutrition.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/obesity.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/osteoarthritis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/osteoporosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/osteosarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/otitismedia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ovariancancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ovariancysts.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pancreaticcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pancreatitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/parkinson.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pcos.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pepticulcer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/periodontitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/peripheralartery.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pharyngitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pid.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pneumonia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/polio.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/pregnancy.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/premature-ejaculation.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/prostate.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/prostate-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/prostatitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/psoriasis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/rabies.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/retinoblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/rheumatoid-arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ringworm.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/rosacea.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/rotavirus.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/rubella.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/salmonella.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/scabies.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/schizzophrenia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/sciatica.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/scoliosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/shingles.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/sicklecell.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/sinusitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/spinabifida.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/stomachcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/strokerecovery.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/sypilis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/testicularcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/tetanus.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/thalasemia.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/thyroidcancer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/tinnitus.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/tonsillitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/toothdecay.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/trichomoniasis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/tuberculosis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/type2diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/typhoidfever.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ulcer.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/ulcerative-colitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/urinary-tract-infection.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/uterine-polyps.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/vaginitis.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/varicose-veins.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/vertigo.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/vitiligo.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/warts.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/weight.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/whooping-cough.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/wilms-tumor.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/women-health-seo-package/content/prevention-guides.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/yeast-infection.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/yellow-fever.md
- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/zika-virus.md




## health-seo-package/content/symptom-guides 
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/acidreflux.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/acne.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/addisons.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/adhd.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/alopecia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/alzheimmers.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/anemia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/anxiety.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/appendicitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/arrhythmia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/asthma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/athletesfoot.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/autism.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/backpain.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/bacterialvaginosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/bipolardisorder.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/bladdercancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/botulism.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/braintumor.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/breastcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/breastcysts.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/campylobacter.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/candida.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/capaltunnel.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cataracts.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/celiacdisease.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cerebralpalsy.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cervicaldysplasia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chickenpox.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chikungunya.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/childrenhealth-seo-package/content/symptom-guides.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chlamydia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cholera.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chronicbronchitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chronicfatique.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chronickidneydisease.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/chronicpain.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/coldscores.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/colorectalcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/conjunctivitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/constipation.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/coronaryartery.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/covid-19recovery.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/crohnsdisease.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cushings.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/cysticfibrosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/dandruff.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/dementia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/denguefever.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/depression.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/detox.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/diabeticretinipathy.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/diarrhea.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/diphtheria.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/downsyndrome.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/dryeye.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/dvt.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/dysentery.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/e.coli.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ebola.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/eczema.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/endomentriosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/epilepsy.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/erectile-dysfunction.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/esophageal-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ewing-sarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/fatty-liver-disease.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/female-infertility.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/fibroid.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/fibromyalgia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/food-poisoning.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/gallstones.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/gastritis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/gingivitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/glaucoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/glioblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/goiter.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/gonorrhea.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/gout.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hair-loss.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/halitosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/heart-failure.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hemophilia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hemorrhoids.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hepatitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hernia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/herniated-disc.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/herpes.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/high-cholesterol.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hiv-aids.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hormonal-balance.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hpv.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hypertension.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hyportension.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/hypothroidism.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/IBS.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/immune.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/insomia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/jock-itch.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/kidney.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/kidneycancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/kidneyfailure.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/kidneystones.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/kyphosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/laryngitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lassafever.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/leukemia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lice.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/listeria.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/livercancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/livercirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lowspermcount.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lungcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lupus.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lymedisease.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/lymphoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/masculardegeneration.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/malaria.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/malevitality.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/measles.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/melanoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/memoryloss.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/menopause.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/menstrualcramps.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/mentalhealth-seo-package/content/symptom-guides.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/migraines.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/multiplemyeloma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/mumps.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/musculardystrophy.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/nailfungus.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/neuroblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/non-hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/norovirus.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/nutrition.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/obesity.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/osteoarthritis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/osteoporosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/osteosarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/otitismedia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ovariancancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ovariancysts.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pancreaticcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pancreatitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/parkinson.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pcos.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pepticulcer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/periodontitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/peripheralartery.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pharyngitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pid.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pneumonia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/polio.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/pregnancy.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/premature-ejaculation.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/prostate.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/prostate-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/prostatitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/psoriasis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/rabies.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/retinoblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/rheumatoid-arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ringworm.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/rosacea.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/rotavirus.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/rubella.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/salmonella.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/scabies.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/schizzophrenia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/sciatica.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/scoliosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/shingles.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/sicklecell.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/sinusitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/spinabifida.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/stomachcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/strokerecovery.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/sypilis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/testicularcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/tetanus.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/thalasemia.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/thyroidcancer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/tinnitus.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/tonsillitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/toothdecay.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/trichomoniasis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/tuberculosis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/type2diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/typhoidfever.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ulcer.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/ulcerative-colitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/urinary-tract-infection.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/uterine-polyps.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/vaginitis.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/varicose-veins.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/vertigo.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/vitiligo.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/warts.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/weight.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/whooping-cough.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/wilms-tumor.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/women-health-seo-package/content/symptom-guides.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/yeast-infection.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/yellow-fever.md
- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/zika-virus.md



## health-seo-package/content/treatment-guides 
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/acidreflux.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/acne.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/addisons.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/adhd.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/alopecia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/alzheimmers.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/anemia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/anxiety.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/appendicitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/arrhythmia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/asthma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/athletesfoot.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/autism.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/backpain.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/bacterialvaginosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/bipolardisorder.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/bladdercancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/botulism.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/braintumor.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/breastcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/breastcysts.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/campylobacter.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/candida.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/capaltunnel.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cataracts.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/celiacdisease.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cerebralpalsy.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cervicaldysplasia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chickenpox.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chikungunya.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/childrenhealth-seo-package/content/treatment-guides.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chlamydia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cholera.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chronicbronchitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chronicfatique.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chronickidneydisease.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/chronicpain.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/coldscores.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/colorectalcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/conjunctivitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/constipation.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/coronaryartery.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/covid-19recovery.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/crohnsdisease.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cushings.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/cysticfibrosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/dandruff.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/dementia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/denguefever.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/depression.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/detox.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/diabeticretinipathy.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/diarrhea.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/diphtheria.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/downsyndrome.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/dryeye.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/dvt.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/dysentery.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/e.coli.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ebola.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/eczema.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/endomentriosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/epilepsy.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/erectile-dysfunction.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/esophageal-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ewing-sarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/fatty-liver-disease.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/female-infertility.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/fibroid.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/fibromyalgia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/food-poisoning.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/gallstones.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/gastritis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/gingivitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/glaucoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/glioblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/goiter.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/gonorrhea.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/gout.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hair-loss.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/halitosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/heart-failure.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hemophilia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hemorrhoids.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hepatitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hernia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/herniated-disc.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/herpes.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/high-cholesterol.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hiv-aids.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hormonal-balance.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hpv.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hypertension.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hyportension.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/hypothroidism.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/IBS.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/immune.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/insomia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/jock-itch.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/kidney.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/kidneycancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/kidneyfailure.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/kidneystones.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/kyphosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/laryngitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lassafever.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/leukemia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lice.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/listeria.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/livercancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/livercirrhosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lowspermcount.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lungcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lupus.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lymedisease.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/lymphoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/masculardegeneration.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/malaria.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/malevitality.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/measles.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/melanoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/memoryloss.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/menopause.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/menstrualcramps.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/mentalhealth-seo-package/content/treatment-guides.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/migraines.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/multiplemyeloma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/mumps.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/musculardystrophy.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/nailfungus.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/neuroblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/non-hodgkins.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/norovirus.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/nutrition.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/obesity.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/osteoarthritis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/osteoporosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/osteosarcoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/otitismedia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ovariancancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ovariancysts.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pancreaticcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pancreatitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/parkinson.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pcos.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pepticulcer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/periodontitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/peripheralartery.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pharyngitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pid.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pneumonia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/polio.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/pregnancy.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/premature-ejaculation.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/prostate.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/prostate-cancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/prostatitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/psoriasis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/rabies.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/retinoblastoma.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/rheumatoid-arthritis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ringworm.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/rosacea.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/rotavirus.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/rubella.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/salmonella.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/scabies.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/schizzophrenia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/sciatica.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/scoliosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/shingles.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/sicklecell.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/sinusitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/spinabifida.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/stomachcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/strokerecovery.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/sypilis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/testicularcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/tetanus.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/thalasemia.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/thyroidcancer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/tinnitus.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/tonsillitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/toothdecay.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/trichomoniasis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/tuberculosis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/type2diabetes.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/typhoidfever.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ulcer.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/ulcerative-colitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/urinary-tract-infection.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/uterine-polyps.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/vaginitis.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/varicose-veins.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/vertigo.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/vitiligo.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/warts.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/weight.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/whooping-cough.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/wilms-tumor.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/women-health-seo-package/content/treatment-guides.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/yeast-infection.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/yellow-fever.md
- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/zika-virus.md
