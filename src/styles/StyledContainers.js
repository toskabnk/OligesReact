import styled from "styled-components";

export const StyledFlexFullCenter = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: ${props => (props.height ? props.height : '100vh;')};;
  background-color: #eeeeee;
`

export const StyledFlexFull = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  height: ${props => (props.height ? props.height : '100vh;')};;
  background-color: #eeeeee;
`