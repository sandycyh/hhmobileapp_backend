import express from 'express';
import cors from "cors";
import { getPool } from './src/db/DB.js'

import orgRoutes from './src/routes/org.routes.js';
import deptRoutes from './src/routes/departments.routes.js';
import auditorRoutes from './src/routes/auditors.routes.js';
import HCWRoutes from './src/routes/HCW.routes.js';
import momentRoutes from './src/routes/moments.routes.js';
import actionRoutes from './src/routes/actions.routes.js';
import gloveRoutes from './src/routes/gloves.routes.js';
import resultRoutes from './src/routes/results.routes.js';
import resultSetsRoutes from './src/routes/resultSets.routes.js';
import login from './src/routes/auth/login.js';
import { requireAuth } from './src/middleware/auth.js';
import routeProtection from './src/routes/auth/routeProtection.js';
const app = express();
app.use(cors());
app.use(express.json());  


app.use('/api/Organisation', orgRoutes)
app.use('/api/Department', deptRoutes)
app.use('/api/Auditor', auditorRoutes)
app.use('/api/HCW', HCWRoutes)
app.use('/api/Moments', momentRoutes) 
app.use('/api/Actions', actionRoutes)
app.use('/api/Glove', gloveRoutes)
app.use('/api/Result', resultRoutes)
app.use('/api/ResultSets', resultSetsRoutes)
app.use('/login', login)
app.use('/audit', requireAuth, routeProtection)

app.get('/', (req, res) => {
  res.send('API is alive');
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Running on ${PORT}`));

app.get('/env-check', (req, res) => {
  res.json({
    hasDbUser: !!process.env.DB_USER,
    hasDbServer: !!process.env.DB_SERVER,
  });
});


app.get('/db-test', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 AS ok');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

