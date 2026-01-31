import { Router} from 'express';
import { getAction } from '../DB.js';

const router = Router();

router.get('/', async (req, res) => {
  try{
    const Actions = await getAction('Action_Descriptions');
    res.json(Actions);
  }catch(err){
    res.status(500).json({ error: 'Database Error'});
  }
});

export default router; 