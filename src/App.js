import React from 'react';

// css dependencies
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap/dist/css/bootstrap.min.css'

// App specific scss
import './App.scss';

// Components
import Navigation from './components/Navigation'
import UserTable from './components/UserTable'
import Footer from './components/Footer'

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Navigation />
				<UserTable />
				<Footer />
			</div>
		)
	}
}

export default App;
