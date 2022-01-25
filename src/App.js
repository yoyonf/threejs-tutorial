import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Home from './Components/Pages/Home';
import Test from './Components/Pages/Test';
import Portfolio from './Components/Pages/Portfolio';

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/cube" element={<Test />} />
				<Route exact path="/portfolio" element={<Portfolio />} />
			</Routes>
		</Router>
	);
}

export default App;
