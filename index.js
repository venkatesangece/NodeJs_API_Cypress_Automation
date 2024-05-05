const express = require('express');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');

const app = express();
app.use(cookieparser());

app.use(bodyparser.json())

const verifyToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    jwt.verify(token, 'MySecretKey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Application Started on port :' + port)
})

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js API!');
});

app.get('/getToken', (req, res) => {
    const user = {
        name: 'Venkatesan Ganesan',
        id: 100,
        roles: ['admin', 'user']
    }
    const token = jwt.sign(user, 'MySecretKey', { expiresIn: '2m' })
    res.send(token)
});

app.get('/getUsers', verifyToken, (req, res) => {
    res.json({ data: [{ name: "User 1" }, { name: "User 2" }, { name: "User 3" }] })
})

app.get('/getItems', (req, res) => {
    res.json({ data: [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }] })
})