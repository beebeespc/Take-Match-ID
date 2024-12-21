const express = require('express');
const path = require('path');

const app = express();
const PORT = 3115;

app.use(express.static(path.join(__dirname, 'html')));

// Cấu hình để khi mở localhost:3115 sẽ trả về match.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/homepage.html'));
});

// Tạo endpoint khác nếu cần
// app.get('/another-page', (req, res) => {
//     res.sendFile(path.join(__dirname, 'another.html'));
// });

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});