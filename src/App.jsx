import { StyledFlexFull } from './styles/StyledContainers'
import Routes from './routes/Routes';
import Navbar from './pages/Navbar';

function App() {
  return (
    <StyledFlexFull height='100%'>
      <Navbar/>
      <Routes/>
    </StyledFlexFull>
  )
}

export default App
