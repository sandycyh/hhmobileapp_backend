import { Router } from 'express';
import { getResultSets, getResultSetwithSetID, postAuditSet } from '../DB.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const resultSets = await getResultSets();
    res.json(resultSets);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
});


router.get('/:SetID', async (req, res) => {
  try {
    const resultSet = Number(req.params.SetID);
    const set = await getResultSetwithSetID(resultSet)
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const results = req.body.payload || req.body;
    const setID = await postAuditSet(results);

    if (!setID) {
      return res.status(500).json({ error: 'SetID not returned from DB' })
    }

    res.json({ setID })

  } catch (err) {
    console.error("POST ROUTE ERROR:", err);
    res.status(500).json({ error: "Database Error" });
  }
});

export default router; 
