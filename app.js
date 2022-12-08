require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const customerRouter = require('./router/customerRouter')
const { logger, auth } = require('./middlewares/middlewares')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('./router/customerRouter');
const PORT = 3001;
const path = require('path');

// app.get('/redirect',(req,res)=>{
//     res.redirect('http://localhost:3001/welcome');
// })

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', "*")
//     next();
// })

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(logger);

const authUser = (req, res, next) => {
    // console.log(req.cookies)
    let user;
    try {
        user = jwt.verify(req.cookies?.access_token, process.env.SECRET_KEY)
        console.log(user)
        delete user.iat;
        req.user = user;
        return next()
    } catch (error) {
        res.redirect('/login')
    }
}


app.use('/customer', authUser)

const users = []; //should be in db

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    if (req.body?.password) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                userName: req.body?.userName,
                firstName: req.body?.firstName,
                lastName: req.body?.lastName,
                password: hashedPassword
            }) //this should be go to db
            return res.redirect('/login');
        } catch (error) {
            res.status(500).json({ error })
        }
    }

})

app.post('/logout', (req, res) => {
    res.clearCookie("access_token").redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {

    // true we check if user exist in database blablabla


    const user = req.body
    const access_token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15m' });
    res.cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'strict'
        // secure: process.env.prod
    }).redirect('/');




    // const user = users.find(user => user.userName == req.body.userName);   //should be checked with db    
    // if (user) {
    //     try {
    //         if (await bcrypt.compare(req.body?.password, user.password)) {
    //             res.redirect('/');
    //         } else {
    //             res.redirect('/login'); //
    //         }
    //     } catch (error) {
    //         res.status(500).json({ error })
    //     }
    // } else {
    //     res.status(400).json({ message: 'user not found in database' })
    // }
})


app.use('/customer', customerRouter)


app.use('*', authUser);

app.use(express.static(path.join(__dirname, 'build'), { index: false }));

app.get('*', authUser, function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



//Customers controller
// app.delete('/customer/:id', deleteCustomer)
// app.post('/customer', postCustomer)
// app.patch('/customer/:id', patchCustomerController)
// app.get('/customer', getCustomer)
// app.get('/customer/:id', getCustomerByIdController)
// app.put('/customer/:id', putCustomerController)


//Tickets controller
// app.delete('/customer/:id', deleteCustomer)
// app.post('/customer', postCustomer)
// app.patch('/customer/:id', patchCustomerController)
// app.get('/customer', getCustomer)
// app.get('/customer/:id', getCustomerByIdController)
// app.put('/customer/:id',putCustomerController)


//Flight controller
// app.delete('/customer/:id', deleteCustomer)
// app.post('/customer', postCustomer)
// app.patch('/customer/:id', patchCustomerController)
// app.get('/customer', getCustomer)
// app.get('/customer/:id', getCustomerByIdController)
// app.put('/customer/:id',putCustomerController)


app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})