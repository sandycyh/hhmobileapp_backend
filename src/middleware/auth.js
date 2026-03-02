 import { verifyToken } from '../utils/jwt.js';

 export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization; 

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing token' }); 
    }

    const token = authHeader.split(' ')[1];

    try { 
        const payload = verifyToken(token);
        req.user = payload; 
        next();
    }catch(err){
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
 }