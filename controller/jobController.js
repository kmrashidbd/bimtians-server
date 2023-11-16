const db = require("../model");

const JobInfo = db.job_info;
const Student = db.student;

module.exports = {
    postJob: async (req, res) => {
        const host = req.get('host');
        const filePath = req.protocol + "://" + host + "/" + req.file.path.replace(/\\/g, "/");
        const data = {postedBy: req.user.id, photo: filePath, ...req.body};
        const result = await JobInfo.create(data);
        res.status(200).json({
            message: 'Job Post Successfully',
            result
        })
    },
    getJobByUser: async(req, res)=>{
        const user = req.user.id;
        const result = await JobInfo.findAll({where: {postedBy: user}});
        res.status(200).json(result)
    },
    getAllJob: async (req, res) => {
        const result = await JobInfo.findAll({
            include:[
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "name", "intake", "course"],
                }
            ],
            attributes: { exclude: ["postedBy"] }
        });
        res.status(200).json(result)
    },
    getAllPublishedJob: async (req, res) => {
        const result = await JobInfo.findAll({
            where:{ status: "public"},
            include:[
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "name", "intake", "course"],
                }
            ],
            attributes: { exclude: ["postedBy", "status"] }
        });
        res.status(200).json(result)
    },
    getJobById: async (req, res) => {
        const id = req.params.id;
        const job = await JobInfo.findOne({
            where: {id: id},
            include:[
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "name", "intake", "course"],
                }
            ],
            attributes: { exclude: ["id", "postedBy"] }
        });
        res.status(200).json(job);
    },
    updateJob: async (req, res) => {
        const {id} = req.params;
        const result = await JobInfo.update(req.body, {where:{id: id}});
        res.status(201).json({message: 'Job Updated Successfully'})
    },
    deleteJob: async (req, res) => {
        const id = req.params.id;
        const result = await JobInfo.destroy({ where: { id: id } })
        if (result > 0) {
            res.status(200).json({
                message: "Job Deleted Successfully",
            });
        } else {
            res.status(404).json({
                message: "Job Not Found",
            });
        };
    }
}