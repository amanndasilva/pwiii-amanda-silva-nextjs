import {createConnection} from 'mysql2/promise';

async function connectToDatabase(){
    return createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'testeapi',
    });
}

export default async function handler(req, res){
    if(req.method !== 'GET'){
        return res.status(405).json({error: 'Método não permitido'});
    }
    
    try{
        const connection = await connectToDatabase();
        
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = 1', );
        
        if(rows.length === 0){
            return res.status(404).json({error: 'Usuário não encontrado.'});
        }
        
        await connection.end();
        
        res.status(200).json(rows);
    } catch(error){
        console.error('Erro de conexão com o banco:', error);
        res.status(500).json({error: 'Erro interno de servidor'});
    }
}