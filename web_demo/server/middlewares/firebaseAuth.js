const admin = require("firebase-admin");
const User = require("../models/User"); // Đường dẫn đúng với project của bạn

const serviceAccount = require("../path/to/webblog-fcb1c-firebase-adminsdk-fbsvc-b4fe31bd29.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 🔍 Lấy thông tin người dùng từ MongoDB
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // ✅ Gán thông tin vào req.user (có uid, email, role)
    req.user = {
      uid: user.uid,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = firebaseAuth;
