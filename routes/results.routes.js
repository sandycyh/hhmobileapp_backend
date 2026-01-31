import { Router } from 'express';
import { getResultWithSetID, getOneResult, getResult, postResults } from '../DB.js';

const router = Router();

//get whole set from result with the same setID
router.get('/:setID', async (req, res) => {
  try {
    const setID = Number(req.params.setID);
    const results = await getResultWithSetID(setID);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
})

//get one specify result from result with resultID
router.get('/:setID/:resultID', async (req, res) => {
  try {
    const resultID = Number(req.params.resultID);
    const setID = Number(req.params.setID);

    const results = await getOneResult(setID, resultID);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
});

//get all results
router.get('/', async (req, res) => {
  try {
    const results = await getResult();

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database Error' });
  }
});

//post data to Result
router.post('/', async (req, res) => {
  try {
    const resultsArray = req.body.payload || req.body;

    if (!Array.isArray(resultsArray) || resultsArray.length === 0) {
      return res.status(400).json({ error: "Payload must be an array of results" });
    }

    for (const r of resultsArray) {
      if (!r.SetID) {
        return res.status(400).json({ error: 'SetID missing in payload' })
      }

      await postResults(
        r.SetID,
        r.HCW,
        r.Moment,
        r.Action,
        r.Glove,
        r.CorrectMoment
      ); // pass object
      // inserted.push(row);

    }
    return res.status(201).json({ message: 'Results saved' })


  } catch (err) {
    console.error("POST ROUTE ERROR:", err);
    res.status(500).json({ error: "Database Error" });
  }
});


export default router; 