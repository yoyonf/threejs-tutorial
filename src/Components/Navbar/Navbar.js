import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components'
import { Link } from "react-router-dom";
import { Colours } from "../Global/Global.styles";

const NavbarWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    background: transparent;
`

const NavbarLinksWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
`

const NavbarLink = styled(Link)`
    text-decoration: none;
    color: ${Colours.dark_purple};
`

const Navbar = () => {
    const navbarLinks = [
        {
            to: '/',
            title: 'Home'
        },
        {
            to: '/cube',
            title: 'Cube'
        },
        // {
        //     to: '/portfolio',
        //     title: 'Portfolio'
        // },
    ]


    return (
        <NavbarWrapper>
            <NavbarLinksWrapper>
            {navbarLinks.map((navbarLink, id) => (
                <NavbarLink key={id} to={navbarLink.to}> {navbarLink.title} </NavbarLink>
            ))}

            </NavbarLinksWrapper>
        </NavbarWrapper>
    )
}

export default Navbar;