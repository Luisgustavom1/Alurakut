import { useState } from 'react'
import Box from '../Box'

export default function PostsBox(props){
  const [teste, setTeste] = useState('')
    return(
        <Box>
            <h2 className='subtitle'>No que você
            esta pensando?</h2>

            <form onSubmit={(e) => {
              e.preventDefault()
              const dataForm = new FormData(e.target)

              const post = {
                textpost: dataForm.get('textpost'),
                imagepost: dataForm.get('imagepost'),
                createSlugPost: props.githubUser
              }

              fetch('/api/posts', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(post)
              }).then(async res => {
                const dados = await res.json()
                const postCriadoNow = dados.postCriado  
                const postsAtualizado = [...props.posts, postCriadoNow]
                props.setPosts(postsAtualizado)
              })
            }}>
              <div>
                <input 
                  placeholder={`No que você está pensando, ${props.githubUser}?`}
                  aria-label={`No que você está pensando, ${props.githubUser}?`}
                  type='text'
                  name='textpost'/>
              </div>
              <div>
                <input 
                  placeholder='Deseja adicionar alguma imagem, adiciona um URL' 
                  aria-label='Deseja adicionar alguma imagem, adiciona um URL' 
                  type='text'
                  name='imagepost'/>
              </div>
              <button>
                Criar Post
              </button>
            </form>
        </Box>      
    )
}
