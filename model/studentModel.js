module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define("student", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    course: {
      type: DataTypes.STRING,
    },
    intake: {
      type: DataTypes.STRING,
    },
    photo:{
        type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    academicStatus: {
      type: DataTypes.STRING,
      defaultValue: 'student',
    },
    passingYear: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    shareContact: {
      type: DataTypes.STRING,
      defaultValue: "yes",
    }
  });
  return Student;
};