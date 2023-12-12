import styled, { keyframes} from 'styled-components';

const spinner = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

export const SpinnerContainer = styled.div`
    position: relative;
    height: 50px;
    margin-top: 5px;
`;

export const LoadingDiv = styled.div`
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 10px solid #bababa; /* Light grey */
    border-top: 10px solid #214f61; /* Black */
    border-radius: 50%;
    animation: ${spinner} 1.5s linear infinite;
`;