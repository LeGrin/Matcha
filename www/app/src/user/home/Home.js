import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { PostData } from '../main/components/PostData';
import history from "../history/history";
import jwtDecode from 'jwt-decode';

import './home.css';
import '../fonts/fonts.css';

import UnAuthorize from './UnAuthorize';
import Header from '../main/components/headerComponents/Header.jsx';
import Footer from '../main/components/footerComponents/Footer';
import Cabinet from '../cabinet/Cabinet';
// import Chat from '../chat/chat';
// import Search from "./Search.js";
// import Profile from "../profile/Profile";

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			author: false,
			userLogin: '',
			userId: '',
			fullProfile: false,
			errMsg: ''
		};
	}
	

	componentWillMount() {
		const token = localStorage.getItem('token');
		if (token !== null)
		{
			const user = jwtDecode(token);
			if (user.userLogin !== '')
			{
				this.setState({
					author: true,
					userLogin: user.userLogin,
					userId: user.userId,
				}, ()=>{this.setState({author: true})});
			};
			//postdata to usercontroller to get is profile full, setstate fullProfile = true
			PostData('user/isFull', {userId: user.userId}).then ((result) => {
				if (result.error !== '' || result.error !== undefined) {
					this.setState({ errMsg: result.error });
				} else
					this.setState({ fullProfile: result });
			});
		}
	}

	render() {
        // console.log("in home before render ", this.state.notifications)

		if (this.state.author === false)
		{
			return(
				<div>
					<Header/>
					<UnAuthorize />
					<Footer />
				</div>
			)
		}
		else 
		{
			return(
			<div>
				<Header />
				<Router history={history}>
					<Route path="/home/cabinet" render={()=><Cabinet login={this.state.userLogin} userId={this.state.userId}/>} />				
				</Router>
				<Footer />				
			</div>
			)
		}
		// else
		// {
		// 	return(
		// 		<div>
		// 			<Router history={history}>
		// 				<div>
		// 					<Header notifications={this.state.notifications}/>
		// 					<Route path="/home/cabinet" component={(props) => (<Cabinet login={this.state.userLogin} userId={this.state.userId}/>)} />
		// 					<Route path="/home/chat" component={(props) => (<Chat login={this.state.userLogin}/>)} />
		// 					<Route path="/profile/:id" component={(props) => (<Profile />)} />
		// 					<Route path='/search' component={(props) => (<Search login={this.state.userLogin}/>)} />
		// 					<Footer />
		// 				</div>
		// 			</Router>
		// 		</div>
		// 	)
		// }
	}
	
}

export default Home;