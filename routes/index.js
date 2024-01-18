const { notFound, errorHandler } = require('../middlewares/errorHandler')
const userRouter = require('../routes/userRoute')
const postRouter = require('../routes/postRoute')

const initRoute = (app) => {
    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/posts', postRouter)

    app.use(notFound)
    // app.use(errorHandler)
}

module.exports = initRoute