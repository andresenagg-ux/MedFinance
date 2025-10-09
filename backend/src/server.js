import express from 'express';
import cors from 'cors';
import { getDb } from './database.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const normalizeConsent = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.userId,
    consented: Boolean(row.consentido),
    createdAt: row.createdAt
  };
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/consents/:userId', async (req, res) => {
  try {
    const db = await getDb();
    const row = await db.get(
      `SELECT * FROM Consentimentos WHERE userId = ? ORDER BY datetime(createdAt) DESC LIMIT 1`,
      req.params.userId
    );

    if (!row) {
      return res.status(404).json({ message: 'Consentimento não encontrado.' });
    }

    res.json(normalizeConsent(row));
  } catch (error) {
    console.error('Erro ao buscar consentimento', error);
    res.status(500).json({ message: 'Erro interno ao buscar consentimento.' });
  }
});

app.post('/consents', async (req, res) => {
  try {
    const { userId, consented } = req.body;

    if (!userId || typeof consented !== 'boolean') {
      return res.status(400).json({
        message: 'Parâmetros inválidos. Informe userId e consented (booleano).'
      });
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO Consentimentos (userId, consentido) VALUES (?, ?)`,
      userId,
      consented ? 1 : 0
    );

    const created = await db.get(`SELECT * FROM Consentimentos WHERE id = ?`, result.lastID);

    res.status(201).json(normalizeConsent(created));
  } catch (error) {
    console.error('Erro ao registrar consentimento', error);
    res.status(500).json({ message: 'Erro interno ao registrar consentimento.' });
  }
});

app.post('/consents/:userId/revoke', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await getDb();

    const lastConsent = await db.get(
      `SELECT * FROM Consentimentos WHERE userId = ? ORDER BY datetime(createdAt) DESC LIMIT 1`,
      userId
    );

    if (!lastConsent) {
      return res.status(404).json({ message: 'Consentimento não encontrado.' });
    }

    if (!lastConsent.consentido) {
      return res.status(200).json(normalizeConsent(lastConsent));
    }

    const result = await db.run(
      `INSERT INTO Consentimentos (userId, consentido) VALUES (?, 0)`,
      userId
    );

    const revoked = await db.get(`SELECT * FROM Consentimentos WHERE id = ?`, result.lastID);

    res.json(normalizeConsent(revoked));
  } catch (error) {
    console.error('Erro ao revogar consentimento', error);
    res.status(500).json({ message: 'Erro interno ao revogar consentimento.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de consentimentos ouvindo na porta ${PORT}`);
});
