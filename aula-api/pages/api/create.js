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
    if(req.method !== 'POST'){
        return res.status(405).json({error:'Método não permitido'});
    }
    
    const userdata = req.body;
    console.log(userdata)

    const{nome, email} = userdata;

    if(!nome || !email){
        return res.status(400).json({error: 'nome e email são obrigatórios no request body.'});
    }
    try{
        const connection = await connectToDatabase();

        const [result] = await connection.execute('INSERT INTO users (nome, email) VALUES (?, ?)', [
            nome,
            email,
        ]);

        await connection.end();

        res.status(201).json({id: result.insertId, message: 'Usuário criado com sucesso!'});
    }
    catch(error){
        console.error('Erro de conexão com o banco:', error);
        res.status(500).json({error: 'Erro interno de servidor'});
    }
}