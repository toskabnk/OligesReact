import { StyledFlexFull } from './styles/StyledContainers'
import Navbar from './components/Navbar';
import Routes from './routes/Routes';

function App() {
  return (
    <StyledFlexFull height='100%'>
      <Navbar/>
      <Routes/>
    </StyledFlexFull>
  )
}

export default App
