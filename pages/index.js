import { React, useEffect, useState } from 'react'
import styled from 'styled-components'

import jwt from 'jsonwebtoken'
import nookies from 'nookies'
import Box from '../src/components/Box'
import MainGrid from '../src/components/Maingrid'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/alurakutCommons'
import ProfileRelationsBoxWrapperModel from '../src/components/ProfileRelationsBoxWrapperModel'
import PostsBox from '../src/components/PostsBox'
import PostsWrapper from '../src/components/PostsWrapper/index'

function ProfileSidebar(props){
  return(
    <Box>
      <img alt='Imagem de perfil' src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}}></img>
      <hr/>
      <p>
        <a href={`https://github.com/${props.githubUser}.png`} className='boxLink'>
          @{props.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault></AlurakutProfileSidebarMenuDefault>
    </Box>
  )
}

export default function Home(props) {
  const githubUser = props.githubUser
  const [comunidades, setComunidades] = useState([])
  const [seguidores, setSeguidores] = useState([''])
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    if(githubUser){
      fetch(`https://api.github.com/users/${githubUser}/followers`)
        .then(res => res.json())
          .then(datas =>  {
            const seguidoresArray = datas.map((data) => {
              return {
                title: data.login,
                avatarUrl: data.avatar_url,
                id: data.id
              }
            // console.log(datas)
            })
            setSeguidores(seguidoresArray)
          }, [])     
    }

      const token = process.env.NEXT_PUBLIC_TOKEN
      fetch('https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: '{ allCommunities { title, id, _status, _firstPublishedAt, avatarUrl } }'
        })
      }).then(res => res.json())
        .then(datas => setComunidades(datas.data.allCommunities))
        .catch(err => console.log(err))
      }, [])

  return(
    <>
      <AlurakutMenu githubUser={githubUser}></AlurakutMenu>
      <MainGrid>
        <div className='profileArea' style = {{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser} ></ProfileSidebar>
        </div>

        <div className='welcomeArea' style = {{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">Bem Vindo(a)</h1>

            <OrkutNostalgicIconSet></OrkutNostalgicIconSet>
          </Box>
          <Box>
            <h2 className='subtitle'>O que você deseja fazer</h2>

            <form onSubmit = {(e) => {
              e.preventDefault()
              const dataForm = new FormData(e.target)
              const comunidade = {
                title: dataForm.get('title'),
                avatarUrl: dataForm.get('image'),
                creatorSlug: 'luisgustavom1'
              }

              fetch('/api/comunidades', 
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              }).then( async (response) => {
                const datas = await response.json();
                const comunidade = datas.registroCriado
                const comunidadesAtualizada = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizada)
              })
            }}>
              <div>
                <input 
                  placeholder='Qual vai ser o nome da sua comunidade' 
                  aria-label='Qual vai ser o nome da sua comunidade'
                  type='text'
                  name='title'
                  id='titleCommunity'/>
              </div>
              <div>
                <input 
                  placeholder='Coloque uma URL para usarmos de capa' 
                  aria-label='Coloque uma URL para usarmos de capa'
                  type='text'
                  name='image'
                  id='imageCommunity'/>
              </div>
              <button>
                Criar Comunidade
              </button>
            </form>
          </Box>
          <PostsBox githubUser={githubUser} posts={posts} setPosts={setPosts}></PostsBox>
          
          <PostsWrapper githubUser={githubUser} posts={posts} setPosts={setPosts}></PostsWrapper>
        </div>

        <div className='profileRelationsArea' style = {{gridArea: 'profileRelationsArea'}}>
            <ProfileRelationsBoxWrapperModel name={'Comunidades'} estado={comunidades}/>
            <ProfileRelationsBoxWrapperModel name={'Seguidores'} estado={seguidores}/>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  
  const {isAuthenticated} = await fetch(`http://alurakut-seven-lemon.vercel.app/api/auth`, {
    headers:{
      Authorization: token
    }
  }).then((res) => res.json())
  
  if(!isAuthenticated){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  const {githubUser} = jwt.decode(token)
  return{
    props: {
      githubUser
    }
  }
}