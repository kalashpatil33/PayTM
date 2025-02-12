require("dotenv").config();
const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    // console.log(req);
    const header = req.headers.authorization;
    if (!(header) || !(header.startsWith('Bearer '))) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = header.split(' ')[1];
    // console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.userID = decoded.id;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ error: err });
    }

}

module.exports = authMiddleware;