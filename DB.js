import sql from 'mssql';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
let pool;

export async function getPool() {
  if (pool) return pool;
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to Azure SQL');
    return pool;
  } catch (err) {
    console.error('SQL connection error:', err);
    pool = null;
    throw err;
  }
}
// export const pool = await sql.connect(dbConfig);
// console.log('connecting to DB: ', dbConfig.database)

export async function getOrg() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Organisation`);
    return result.recordset;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getMoment() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Moment_Descriptions`);
    return result.recordset;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getResult() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Result`);
    return result.recordset;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getResultSets() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM ResultSets`);
    return result.recordset;

  } catch (error) {
    console.error(error.message);
  }
}

export async function getDeptWithOrgID(OrgID) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('OrgID', sql.Int, OrgID)
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Department
              WHERE OrgID = @OrgID`);
    return result.recordset;

  } catch (error) {
    console.error(error.message);
  }
}

export async function getAuditorWithDeptCode(DeptCode) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('DeptCode', sql.Int, DeptCode)
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Auditor 
              WHERE DeptCode = @DeptCode`)

    return result.recordset;

  } catch (error) {
    console.error(error.message);
  }
}

export async function getResultWithSetID(setID) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('SetID', sql.Int, setID)
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Result
              WHERE SetID = @SetID`);
    return result.recordset;

  } catch (error) {
    console.error(error.message);
  }
}

export async function getOneResult(setID, resultID) {
  try {
    const pool = await getPool();
    const request = pool.request()
      .input('resultID', sql.Int, resultID)
      .input('setID', sql.Int, setID)

    const result = await request
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Result
              WHERE ResultID = @resultID
              AND SetID = @setID`)
    return result.recordset[0] ?? null;

  } catch (error) {
    console.error(error.message)
  }
}

export async function getResultSetwithSetID(setID) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('SetID', sql.Int, setID)
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM ResultSet
              WHERE SetID = @SetID`);
    return result.recordset;

  } catch (error) {
    console.error(error.message);
  }
}

export async function getHCW() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM HCW_Descriptions
              ORDER BY 
                CASE WHEN Type = 'N' THEN 1
		                WHEN Type = 'DR' THEN 2
		                WHEN Type = 'AH' THEN 3
		                WHEN Type = 'BL' THEN 4
		                WHEN Type = 'PC' THEN 5
		                WHEN Type = 'SN' THEN 6
		                WHEN Type = 'SAH' THEN 7
		                ELSE 8
                END,
	            Type`);
    return result.recordset;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getAction() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Action_Descriptions
              ORDER BY 
                CASE WHEN Action = 'Rub' THEN 1 
	                    WHEN Action = 'Wash' THEN 2 
                      ELSE 3
                END, 
                Action `)
    return result.recordset;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getGlove() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`USE HandHygieneAuditAppDB
              SELECT * FROM Glove_Descriptions
              ORDER BY 
                CASE WHEN Glove = 'On' THEN 1
                      WHEN Glove = 'Off' THEN 2
                      ELSE 3
                END,
                Glove`)
    return result.recordset;
  } catch (error) {
    console.error(error.message);
  }
}



export async function postAuditSet({ AuditDate, StartTime, TotalTime,
  OrgID, DeptCode, AuditedBy, TotalCorrectMoment, TotalMoment, SuccessRate }) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("AuditDate", sql.Date, AuditDate)
      .input("StartTime", sql.VarChar(8), StartTime)
      .input("TotalTime", sql.VarChar(8), TotalTime)
      .input("OrgID", sql.Int, OrgID)
      .input("DeptCode", sql.VarChar(10), DeptCode)
      .input("AuditedBy", sql.Int, AuditedBy)
      .input("TotalCorrectMoment", sql.Int, TotalCorrectMoment)
      .input("TotalMoment", sql.Int, TotalMoment)
      .input("SuccessRate", sql.Decimal(18, 0), SuccessRate)
      .query(`USE HandHygieneAuditAppDB
          INSERT INTO ResultSets (AuditDate, StartTime, TotalTime, OrgID, DeptCode, AuditedBy, TotalCorrectMoment, TotalMoment, SuccessRate)
          OUTPUT INSERTED.*
          VALUES (@AuditDate, @StartTime, @TotalTime, @OrgID, @DeptCode, @AuditedBy, @TotalCorrectMoment, @TotalMoment, @SuccessRate)
          `)
    if (!result.recordset || !result.recordset[0] || !result.recordset[0].SetID) {
      throw new Error("Failed to get SetID from insert")
    }


    // return the inserted row to the caller (if needed)
    return result.recordset[0].SetID;

  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function postResults(setID, HCW, Moment, Action, Glove,
  CorrectMoment) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("SetID", sql.Int, setID)
      .input("HCW", sql.VarChar(3), HCW)
      .input("Moment", sql.Int, Moment)
      .input("Action", sql.VarChar(6), Action)
      .input("Glove", sql.VarChar(4), Glove)
      .input("CorrectMoment", sql.VarChar(3), CorrectMoment)
      .query(`USE HandHygieneAuditAppDB
          INSERT INTO Result (SetID, HCW, Moment, [Action], Glove, CorrectMoment)
          OUTPUT INSERTED.*
          VALUES (@SetID, @HCW, @Moment, @Action, @Glove, @CorrectMoment)
        `);

    // return the inserted row to the caller (if needed)
    return result.recordset && result.recordset[0];

  } catch (error) {
    console.error(error.message);
    // rethrow so callers can handle/report the failure
    throw error;
  }
}



