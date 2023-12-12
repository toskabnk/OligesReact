import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const NavBar = styled.nav`
    background-color: #214f61;
    margin: 0;
    padding: 0;
    width: 100%;
`;

export const NavBarList = styled.ul`
    list-style-type: none;
    overflow: hidden;
`;

export const NavBarItems = styled.li`
  float: left;
`;

export const NavBarLink = styled(NavLink)`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  &.active{
    background-color: #04AA6D;
  };
`;

export const RightNavItem = styled(NavBarItems)`
  float: right;
`;

export const NavBarLogout = styled(NavLink)`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  background-color: red;

`;

export const Logo = styled.img`
  width: 170px;
  padding: 10px;
  float: left;
`;