const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('connected successfully')
  })
  .catch(err => {
    console.log(err)
  })

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.student = require('./studentModel')(sequelize, DataTypes);
db.personal_info = require('./personalModel')(sequelize, DataTypes);
db.others_info = require('./othersModel')(sequelize, DataTypes);
db.academic_info = require('./academicInfoModel')(sequelize, DataTypes);
db.employment_info = require('./employmentModel')(sequelize, DataTypes);
db.chat = require('./chatModel')(sequelize, DataTypes);
db.chat_user = require('./chatUsersModel')(sequelize, DataTypes);
db.message = require('./messageModel')(sequelize, DataTypes);
db.notification = require('./notificationModel')(sequelize, DataTypes);
db.job_info = require('./jobInfoModel')(sequelize, DataTypes);

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('re sync done');
  })

// user connection with varius model
db.student.hasOne(db.personal_info, {
  foreignKey: 'studentId',
  as: 'personal_info'
})

db.student.hasMany(db.employment_info, {
  foreignKey: 'studentId',
  as: 'employment_info'
})

db.student.hasMany(db.academic_info, {
  foreignKey: 'studentId',
  as: 'academic_info'
})

db.student.hasMany(db.others_info, {
  foreignKey: 'studentId',
  as: 'others_info'
})

db.chat_user.belongsTo(db.student, {
  foreignKey: 'user',
  as: 'student'
})

db.employment_info.belongsTo(db.student,{
  foreignKey: 'studentId',
  as: 'student'
})

db.academic_info.belongsTo(db.student,{
  foreignKey: 'studentId',
  as: 'student'
})

db.job_info.belongsTo(db.student,{
  foreignKey: 'postedBy',
  as: 'student'
})

db.chat.belongsTo(db.student,{
  foreignKey: 'groupAdminId',
  as: 'group_admin'
})

db.chat.belongsTo(db.student,{
  foreignKey: 'senderId',
  as: 'sender'
})

db.chat.belongsTo(db.student,{
  foreignKey: 'receiverId',
  as: 'receiver'
})

db.chat.hasMany(db.message,{
  foreignKey: 'chat',
  as: 'messages'
})

db.chat.belongsTo(db.message,{
  foreignKey: 'latestMessageId',
  as: "latest_message"
})

db.message.belongsTo(db.chat,{
  foreignKey: 'chat',
  as: "chat_details"
})

db.message.belongsTo(db.student,{
  foreignKey: 'senderId',
  as: 'sender'
})

db.chat_user.belongsTo(db.chat,{
  foreignKey: 'chat',
  as: "group_chat"
})

db.chat.hasMany(db.chat_user, {
  foreignKey: 'chat',
  as: 'group_chat_details'
})




module.exports = db;