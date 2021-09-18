import {SiteClient} from 'datocms-client'

export default async function recebeRequest(req, res){
    if(req.method == 'POST'){
        const TOKEN = process.env.NEXT_PUBLIC_TOKEN;
        const client = new SiteClient(TOKEN)
    
        const registroCriado = await client.items.create({
            itemType:'968630',
            ...req.body,
        })
        console.log(registroCriado)
        res.json({
            registroCriado: registroCriado
        })
        return
    }
    res.status(404).json({
        status: '404',
        message: 'Ainda não temos nada no POST'
    })
}