const router = require('express').Router()
const userController = require('../controllers/userControllers')
const { verifyToken } = require('../middlewares/verify')

router.get('/', userController.getAllUser)
router.get('/:id', userController.getUserById)
router.get('/current', verifyToken, userController.getCurrentUser)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.put('/update', verifyToken, userController.update)
router.get('/refreshtoken', userController.refreshAccessToken)
router.get('/logout', userController.logout)
router.delete('/:id', verifyToken, userController.delete)
module.exports = router