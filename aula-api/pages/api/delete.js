import {createConnection} from "mysql2/promise";

async function connectToDatabase(){
    return createConnection({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'testeapi', 
    });
}

export default async function handler(req, res){
    if(req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Método não permitido.'});
    }

    const{id} = req.body;
    console.log(req.body)
    if(!id){
        return res.status(400).json({ error: 'O id é obrigatório no request body.'});
    }

    try{
        const connection = await connectToDatabase();

        // Executa o delete em "Users"
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);

        // Fecha a conexão 
        await connection.end();

        // Check se foi deletado com sucesso
        if(result.affectedRows === 0){
            return res.status(404).json({ error: 'Usuário não encontrado.'});
        }

        //Respostas de sucesso 
        res.status(200).json({ message: 'Usuário deletado com sucesso!'});
    }catch (error){
        console.error('Erro de conexão com o banco:', error);
        res.status(500).json({ error: 'Erro interno de servidor.'});
    }
}