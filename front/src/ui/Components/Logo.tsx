import styled from "styled-components"
import React from "react"
import logoImg from "../Images/logo.png"

const Imagen = styled.img`
`
export const Logo: React.FC=() =>{
    return(
        <>
        <Imagen src={logoImg} alt="Logo"/>
        </>
    )
}