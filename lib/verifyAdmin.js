const db = require('../model');

const User = db.users;

const verifyAdmin = async (req, res, next)=>{
    const {email} = req.user;
    const user = await User.findOne({where: {email: email}});
    if(user.dataValues.role === "admin"){
        next();
    }else{
        res.status(401).json({
            message: 'Unauthorized Access'
        })
    }
};

module.exports = verifyAdmin;