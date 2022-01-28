import React, { useState, useEffect, useRef, Component } from 'react';
import styled from 'styled-components'

const OverlayWrapper = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: rgba(255,0,0,10);
    display: ${props => props.show ? 'block': 'none'}
`

const Overlay = props => {

    const onClick  = () => {
        props.hide();
    }
    return (
        <OverlayWrapper show={props.show} onClick={() => onClick()}>
            <p>Overlay </p> 
        </OverlayWrapper>
    )

}

export default Overlay;
