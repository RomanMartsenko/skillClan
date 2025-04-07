const express = require('express');
const path = require('path');
const formRoutes = require('./routes/formRoutes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => res.send('API is alive'));

app.use('/', formRoutes); // ← тут маршрути

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));