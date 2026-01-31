import { Router } from 'express';
import { getHCW } from '../DB.js';

const router = Router();

//HCW
router.get('/', async (req, res) => {
  try {
    const HCW = await getHCW('HCW_Descriptions');
    res.json(HCW);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
});

export default router;  