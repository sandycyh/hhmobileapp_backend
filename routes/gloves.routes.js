import { Router } from 'express';
import { getGlove } from '../DB.js';

const router = Router();

router.get('/', async (req, res) => {
  try{ 
    const Gloves = await getGlove('Glove_Descriptions');
    res.json(Gloves);
  }catch(err) {
    res.status(500).json({ error: 'Database Error'});
  }
});

export default router;