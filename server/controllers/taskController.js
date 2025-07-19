const db = require("../config/dbConnection");
const getAllTasks = async (req, res) => {
    try {
        const [rows, fields] = await db.query(`
           SELECT 
            t.id AS task_id,
            t.title,
            t.description,
            t.completed,
            t.deadline,
            t.created_at,
            t.updated_at,
            u.first_name,
            u.last_name,
            p.name AS priority_name,
            p.color AS priority_color,
            GROUP_CONCAT(DISTINCT tg.name) AS tags,
            GROUP_CONCAT(DISTINCT a.file_url) AS attachments
            FROM tasks t
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN priority_levels p ON t.priority_id = p.id
            LEFT JOIN task_tag tt ON t.id = tt.task_id
            LEFT JOIN tags tg ON tt.tag_id = tg.id
            LEFT JOIN attachments a ON t.id = a.task_id
            GROUP BY t.id
            ORDER BY t.deadline ASC;
            `);
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error on fetching tasks", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
module.exports = {
    getAllTasks
};