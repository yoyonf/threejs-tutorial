import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Home from './Components/Pages/Home';
import Portfolio from './Components/Pages/Portfolio';
import Cube from './Components/Pages/Cube';

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/cube" element={<Cube />} />
				<Route exact path="/portfolio" element={<Portfolio />} />
			</Routes>
		</Router>
	);
}

export default App;
