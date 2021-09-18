import React from 'react'
import {ProfileRelationsBoxWrapper} from '../ProfileRelations'

export default function ProfileRelationsBoxWrapperModel(props){
    return(
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">{props.name} ({props.estado.length})</h2>
          
          <ul>
            {props.estado.length !== 0 && props.estado.slice(0,6).map(stateAtual => {
              return  <li key={stateAtual.id}>
                        <a href={`https://github.com/${stateAtual.title}`} key={stateAtual.id}>
                          <img src={`${stateAtual.avatarUrl}`}></img>
                          <span>{stateAtual.title}</span>
                        </a>
                      </li>
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
    )
}