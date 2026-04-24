import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    // ข้อมูลการเชื่อมต่อจากรูปภาพของคุณ
    const dbConfig = {
        host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
        user: '42Arh74tapgxe8h.root',
        password: '1wBACsBo5saP2a7X',
        database: 'mytravel',
        port: 4000,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: false
        }
    };

    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        const { id } = req.query;

        if (id) {
            // ดึงข้อมูลรายตัว (สำหรับหน้า Detail)
            const [rows] = await connection.execute('SELECT * FROM attractions WHERE id = ?', [id]);
            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ message: 'ไม่พบข้อมูลสถานที่' });
            }
        } else {
            // ดึงข้อมูลทั้งหมด (สำหรับหน้า List)
            const [rows] = await connection.execute('SELECT * FROM attractions');
            res.status(200).json(rows);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Connection Error: ' + error.message });
    } finally {
        if (connection) await connection.end();
    }
}