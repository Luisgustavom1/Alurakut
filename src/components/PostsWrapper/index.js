import Box from '../Box'
import styled from 'styled-components'
import { useEffect, useState } from 'react'

const HeaderPost = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0 0 10px;
    img{
        width: 40px;
        border-radius: 50%;
    }
    h3{
        font-size: 1rem;
    }
`
const Post = styled.div`
    padding: 15px;
    font-size: 1rem;
`
const ImagePost = styled.img`
    max-width: 100%;
    border-radius: 8px;
`
export default function PostsWrapper(props){
    const token = process.env.NEXT_PUBLIC_TOKEN

    useEffect(() => {
        fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: '{allPosts { imagepost, textpost, id, createSlugPost}}'
            })
        })
        .then(res => res.json())
            .then(dados => {
                props.setPosts(dados.data.allPosts)
            })
            .catch(err => console.log(err))
    }, [])

    return(
        <div>
            {props.posts.map((post) => {
                return <Box key={post.id}>
                            <HeaderPost>
                                <img src={`https://github.com/${post.createSlugPost}.png`}></img>
                                <h3>- {post.createSlugPost}</h3>
                            </HeaderPost>
                            <Post>
                                <p>{post.textpost}</p>
                            </Post>
                            <ImagePost src={post.imagepost}></ImagePost>
                        </Box>
            })}
        </div>
    )
}