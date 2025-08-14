// middlewares/checkToken.js
module.exports = function checkToken(req, res, next) {
    try {
        const token = req.headers['authorization']; // faqat token olingan header

        // Token mavjudligini tekshirish
        if (!token) {
            return res.status(401).json({ success: false, message: "Token mavjud emas" });
        }

        // Statik token bilan solishtirish
        const VALID_TOKEN = "SalomBaxtinuraka"; // Sizning token
        if (token !== VALID_TOKEN) {
            return res.status(401).json({ success: false, message: "Token noto'g'ri" });
        }

        // Token to‘g‘ri bo‘lsa keyingi middleware yoki route’ga o‘tamiz
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server xatosi" });
    }
};
