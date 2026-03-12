import { Router } from 'express';
import { verifyPassword } from '../../utils/password/passwordHashing.js'
import { getUserByUsername } from '../../db/users.db.js';
import jwt from 'jsonwebtoken';

const router = Router();


router.post('/', async (req, res) => {
    //const { username, password } = req.body;
    const username = req.body[0];
    const password = req.body[1];

    console.log(`request body: username: ${username}, pw: ${password}`)
    console.log('API running')

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    const user = await getUserByUsername(username);
    
    if (user) {
        if (!user.Username) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
    } else {
        return res.status(401).json({
            error: "Invalid username or password"
        });
    }

    const correctPW = await verifyPassword(password, user.PasswordHash);

    console.log(`Correct credentials: ${correctPW}`)

    if (!correctPW) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        {
            userId: user.UserID,
            audId: user.auditorID,
            role: user.Role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
    console.log('token: ', token)
    console.log('user exists')

    return res.json({ token })
});

export default router;