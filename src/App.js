import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Header from './app/components/header/Header';
import RentNow from './app/pages/RentNow'


function App() {
  return (
    <>
    <Router>
       <Header/>
      <Routes>
        <Route exact path='/' element={<RentNow/>}/>
      </Routes>
    </Router>
  
    </>
  );
}

export default App;
