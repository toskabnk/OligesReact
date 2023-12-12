import React from 'react';
import styled from 'styled-components';

export const StyledSectionBorder = styled.section`
    margin: auto;
    margin-top: 10px;
    border: 2px solid #214f61;
    border-radius: 16px;
    width: ${props => (props.width ? props.width : '500px')};
    height: ${props => (props.height ? props.height : '')};;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
`;