

import pool from '../config/dbpostgresql.js';

export const createOrUpdateEvents = async (req, res) => {
  const { title, date, startTime, endTime, description } = req.body;

  try {
    const existingEvent = await pool.query('SELECT * FROM events WHERE titulo = $1', [title]);

    if (existingEvent.rows.length > 0) {
      // Atualiza evento existente
      const updatedEvent = await pool.query(
        'UPDATE events SET data = $1, inicio = $2, termino = $3, descricao = $4 WHERE titulo = $5 RETURNING *',
        [date, startTime, endTime, description, title]
      );
      return res.status(200).json({ message: 'Evento atualizado com sucesso.', event: updatedEvent.rows[0] });
    } else {
      // Cria novo evento
      const newEvent = await pool.query(
        'INSERT INTO events (titulo, data, inicio, termino, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, date, startTime, endTime, description]
      );
      return res.status(201).json({ message: 'Evento criado com sucesso.', event: newEvent.rows[0] });
    }
  } catch (error) {
    console.error('Erro ao adicionar evento:', error);
    return res.status(500).json({ message: 'Falha ao adicionar evento' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await pool.query('SELECT * FROM events');
    return res.status(200).json(events.rows);
  } catch (error) {
    console.error('Erro ao obter eventos:', error);
    return res.status(500).json({ message: 'Falha ao obter eventos' });
  }
}
