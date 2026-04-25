const expess = require('express');
const router = expess.Router();
const {registerUser, loginUser, verifyotp} = require('../controllers/authController');



router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verifyotp', verifyotp);

module.exports = router;