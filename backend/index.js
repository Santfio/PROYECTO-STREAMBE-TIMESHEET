const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Timesheet backend funcionando correctamente.');
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
