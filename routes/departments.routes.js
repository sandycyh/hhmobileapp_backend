import {Router} from 'express';
import { getDeptWithOrgID } from '../DB.js';

const router = Router();

//Department 
router.get('/:orgID', async (req, res) => {
  try {
    const OrgID = Number(req.params.orgID);
    const depts = await getDeptWithOrgID(OrgID);

    res.json(depts);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: 'Database Error' });
  }
});

export default router;