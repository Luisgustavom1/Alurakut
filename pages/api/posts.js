import { SiteClient } from "datocms-client";

export default async function PostsRequest(req, res){
    if(req.method === 'POST'){
        const token = process.env.NEXT_PUBLIC_TOKEN;
        const client = new SiteClient(token)

        const postCriado = await client.items.create({
            itemType: '976006',
            ...req.body,
        })
        console.log(postCriado)
        res.json({
            postCriado: postCriado
        })
        return
    }
    res.status(404).json({
        status: '404',
        message: 'Não temos nenhuma postagem no POST'
    })

} 