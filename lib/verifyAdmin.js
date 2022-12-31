const db = require('../model');

const Student = db.student;

const verifyAdmin = async (req, res, next)=>{
    const {email} = req.user;
    const student = await Student.findOne({where: {email: email}});
    if(student?.dataValues.role === "admin"){
        next();
    }else{
        res.status(401).json({
            message: 'Unauthorized Access'
        })
    }
};

module.exports = verifyAdmin;