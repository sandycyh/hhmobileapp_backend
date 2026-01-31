import { Router} from 'express';
import { getOrg } from '../DB.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const Orgs = await getOrg();

    res.json(Orgs);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
});

export default router; 
