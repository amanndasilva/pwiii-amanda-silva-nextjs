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
    if(req.method !== 'PUT'){
        return res.status(405).json({error: 'Método não permitido'});
    }

    const {id, nome, email} = req.body;
    console.log(req.body);

    if(!id || !nome || !email){
        return res.status(400).json({error: 'id, nome e email são obrigatórios no request nody'})
    }

    try{
        const connection = await connectToDatabase();

        const [result] = await connection.execute(
            'UPDATE users SET nome = ?, email = ? WHERE id = ?',
            [nome, email, id]
        );

        await connection.end();

        if(result.affectedRows === 0){
            return res.status(400).json({error: 'Usuário não encontrado'});
        }
        
        res.status(200).json({message: 'Usuário atualizado com sucesso'});
    } catch(error){
        console.error('Erro de conexão com o banco:', error);
        res.status(500).json({error: 'Erro interno de servidor'});
    }
}