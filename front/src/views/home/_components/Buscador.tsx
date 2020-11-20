import styled from "styled-components";
import React from "react";
import SearchImage from '../../../ui/Images/Search.jpg';
import { rem } from "polished";
import { size } from "../../../ui/theme";

interface Props{
    hasError : Boolean;
}

const BuscadorStyle = styled.nav`
    width: 100%;
    display: flex;
    margin-bottom: ${rem(size.medium)};
`

const Input = styled.input`
    border: solid 0;
    width: 100%;
    padding: 1rem;
`
const Imagen = styled.img`
    width:3rem;
`
const Error = styled.span`
    display: none;
`
function startSearch(){}

export const Buscador: React.FC<Props> = (props) =>{
    return(
        <>
            <BuscadorStyle>
                <Input type ="text" name="buscador" aria-label='search' placeholder="ENCUENTRA TU MEME" />
                <button aria-label='search' onClick={startSearch}>
                    <Imagen src={SearchImage} alt = 'Buscador logo'/>
                    
                </button>
            </BuscadorStyle>
        {props.hasError && <Error>El texto de búsqueda necesita ser mayor que dos caracteres</Error>}
        </>   
    )
}