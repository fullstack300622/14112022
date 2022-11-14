require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const customerRouter = require('./router/customerRouter')
const { logger, auth } = require('./middlewares/middlewares')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('./router/customerRouter');




// app.get('/redirect',(req,res)=>{
//     res.redirect('http://localhost:3001/welcome');
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


app.get('/', authUser, (req, res) => {
    
    return res. render('welcome.ejs', { name: req.user?.userName });
})

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

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {

    // true we check if user exist in database blablabla


    const user = req.body
    console.log(user)
    const access_token = jwt.sign(user, process.env.SECRET_KEY ,{expiresIn: '15m'});
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


app.listen(3000, () => {
    console.log('app is listening on port 3000')
})