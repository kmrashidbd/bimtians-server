const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) =>{
    const authToken = req.headers.authorization.split(' ')[1];
    console.log(authToken)
    jwt.verify(authToken, process.env.SECRET, (err, decoded)=>{
        console.log(decoded)
        if(err){
            res.status(403).json({
                message: 'Forbidden Access'
            })
        }else{
            req.user = decoded
            next();
        }
    });
}

module.exports = verifyToken;