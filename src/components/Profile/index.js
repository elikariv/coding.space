import React from 'react';
import LazyImage from '../LazyImage';
import { AuthUserContext } from '../Session';
import {withAuthentication} from '../Session';
import {withFirebase} from '../Firebase';
import TCSEditor from '../TCSEditor';
import { v4 as uuidv4 } from 'uuid';
import * as ROUTES from '../../constants/routes';



class ProfilePageBase extends React.Component {

 constructor(props){
 	super(props);
 	this.state = {
 		authUser:null,
 		loading:true,
 		untutorials: {},
 		profile:{},
 		uploading:false,
 		uploadPercent:0,
 		dirty:false,





 	}
 	this.handleNotesOnChange = this.handleNotesOnChange.bind(this);
 	this.handleNotesOnSave = this.handleNotesOnSave.bind(this);
 	this.handleStatusOnChange = this.handleStatusOnChange.bind(this);
 	this.handleStatusOnSave = this.handleStatusOnSave.bind(this);
 	this.handleAgeOnChange = this.handleAgeOnChange.bind(this);
 	this.handleAgeOnSave = this.handleAgeOnSave.bind(this);
 	this.handlePTitleOnChange = this.handlePTitleOnChange.bind(this);
 	this.handlePTitleOnSave = this.handlePTitleOnSave.bind(this);
 	this.handleThumbnailUpload = this.handleThumbnailUpload.bind(this);
 	this.handleDisplayNameOnChange = this.handleDisplayNameOnChange.bind(this);
 	this.handleDisplayNameOnSave = this.handleDisplayNameOnSave.bind(this);
 	this.handlePDescriptionOnChange = this.handlePDescriptionOnChange.bind(this);
 	this.handlePDescriptionOnSave = this.handlePDescriptionOnSave.bind(this);
 	this.handleAgeOnChange = this.handleAgeOnChange.bind(this);
 	this.handleAgeOnSave = this.handleAgeOnSave.bind(this);
 	this.saveChangesHandler = this.saveChangesHandler.bind(this);
 	
 	//this.onChange = editorState => this.setState({editorState});
 	//console.log("hiya");

 }

 
 handleMouseEnter = (target) => {

 	if(this.state.canEdit){
 		return; //replace control with rich text editor
 	}
 };

 componentDidMount(){
 	//console.log(this.authUser);

 	const {key} = this.props.match.params;
 	this.props.firebase.profile(key).on('value',snapshot => {
		this.setState({
			profile:snapshot.val()
		})
		this.props.firebase.untutorials().once('value')
			.then(snapshot => {
 				const {key} = this.props.match.params;
 				const untutorials = Object.values(snapshot.val()).filter(untutorial=>untutorial.Author===key);
 				/*const filProjects = [];
 				for(var keyz in projects){
 					if(projects[keyz].Author === key)
 						filProjects.push(projects[keyz]);
 				}*/
 				

 		
		 		this.setState({
		 			untutorials: untutorials,
		 			loading:false,
		 		})
 		

 		
 		})
	})
 	


 }

 componentWillUnmount(){
 	this.props.firebase.profile().off();
 	this.props.firebase.untutorials().off();
 }
  handleThumbnailUpload(event){
 	var file = event.target.files[0];
 	var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
 	var pCopy = this.state.profile;
 	const {authUser} = this.props;
 	if(!!authUser && !!authUser.roles['STUDENT'] && !(!!pCopy.roles['ADMIN']))
 		pCopy.Status = 'DRAFT';
 	pCopy.ThumbnailFilename = uuidv4() + '.' + ext;

 	var storageRef = this.props.firebase.storage.ref('/public/' + pCopy.key + '/' + pCopy.ThumbnailFilename);
 	var task = storageRef.put(file);

 	task.on('state_changed',
 		(snapshot)=>{
 			//update
 			var percentage = 100 * snapshot.bytesTransferred / snapshot.totalBytes;
 			this.setState({uploadPercent:percentage,uploading:true})

	 	},(error)=>{
	 		//error
	 		console.log(error);
	 		this.setState({uploadPercent:0,uploading:false})
	 	},
	 	()=>{
	 		//complete
	 		this.setState({uploadPercent:0,uploading:false,profile:pCopy,dirty:true})

	 	})


 }

 handlePTitleOnChange(value){
 	var pCopy = this.state.profile;
 	if(value !== pCopy.Title){
 		pCopy.Title = value;
	 	const {authUser} = this.props;
	 	if(!!authUser && !!authUser.roles['STUDENT'] && !(!!pCopy.roles['ADMIN']))
	 		pCopy.Status = 'DRAFT';
	 	this.setState({project:pCopy,dirty:true});
 	}
 	
 }
  handlePTitleOnSave(){
 	this.saveChangesHandler();
 }
 handlePDescriptionOnChange(value){
 	var pCopy = this.state.profile;
 	if(value !== pCopy.About){
 		pCopy.About = value;
	 	const {authUser} = this.props;
	 	if(!!authUser && !!authUser.roles['STUDENT'] && !(!!pCopy.roles['ADMIN']))
	 		pCopy.Status = 'DRAFT';
	 	this.setState({project:pCopy,dirty:true});
 	}
 	
 }
  handlePDescriptionOnSave(){
 	this.saveChangesHandler();
 }
  handleAgeOnChange(value){
 	var pCopy = this.state.profile;
 	if(value !== pCopy.Age){
 		pCopy.Age = value;
	 	const {authUser} = this.props;
	 	if(!!authUser && !!authUser.roles['STUDENT'] && !(!!pCopy.roles['ADMIN']))
	 		pCopy.Status = 'DRAFT';
	 	this.setState({project:pCopy,dirty:true});
 	}
 	
 }
  handleAgeOnSave(){
 	this.saveChangesHandler();
 }
 handleDisplayNameOnChange(value){
 	var pCopy = this.state.profile;
 	if(value !== pCopy.DisplayName){
 		pCopy.DisplayName = value;
	 	const {authUser} = this.props;
	 	if(!!authUser && !!authUser.roles['STUDENT'] && !(!!pCopy.roles['ADMIN']))
	 		pCopy.Status = 'DRAFT';
	 	this.setState({project:pCopy,dirty:true});
 	}
 	
 }
 handleDisplayNameOnSave(){
 	this.saveChangesHandler();
 }
 handleStatusOnChange(value){
 	var pCopy = this.state.profile;
 	if(value !== pCopy.Status){
 		pCopy.Status = value;
 		this.setState({profile:pCopy,dirty:true});	
 	}
 	
 }
  handleStatusOnSave(){
 	this.saveChangesHandler();
 }
 handleNotesOnChange(value){
 	var pCopy = this.state.profile;
 	if(value !== pCopy.Notes){
 		pCopy.Notes = value;
	 	const {authUser} = this.props;
	 	if(!!authUser && !!authUser.roles['STUDENT'] && !(!!pCopy.roles['ADMIN']))
	 		pCopy.Status = 'DRAFT';
	 	this.setState({project:pCopy,dirty:true});
 	}
 }
  handleNotesOnSave(){
 	this.saveChangesHandler();
 }
 saveChangesHandler(event){
 	const {key} = this.props.match.params;

 	this.props.firebase.profile(key).set({
 		...this.state.profile
 	})
 		.then(()=>{
 			console.log("Successfully Saved");
 			this.setState({dirty:false})
 		})
 		.catch(error=>console.log(error));
 	console.log("Save Changes");
 }

 render(){
 	
 	const {untutorials, loading, profile} = this.state;
 	const {authUser} = this.props;
 	const {key} = this.props.match.params;
 	
 	//console.log(Object.keys(project));
 	if(loading)
 		return (<div>Loading ...</div>);
 	
 	//can edit

	return (
	 <section id="profile">	
	
	<TCSEditor 
					disabled={!(!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key))}
					classname={'block'}
					type='select'
					selectOptions={['DRAFT','APPROVED']}
					onEditorChange={this.handleStatusOnChange}
					onEditorSave={this.handleStatusOnSave}
					text={profile.Status}/>
		<div className="main">
			
		  <div className="profile-panel">
			<div className="content">
			  <div className="avatar">
				{this.state.uploading && (
					<progress value={this.state.uploadPercent} max="100"/>
				)}
				{!!profile.ThumbnailFilename && !this.state.uploading &&(
					<LazyImage file={this.props.firebase.storage.ref('/public/' + profile.key + '/' + profile.ThumbnailFilename)}/>
				)}	
				<input type="file" onChange={this.handleThumbnailUpload}/>
				</div>	
				{!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key) && (
				<div className={'container'}>
					<h4>Username</h4>
					<div className={'block'}>{profile.Username}</div>
				</div>	
			)}
			<h4>Display Name</h4>
				<TCSEditor 
					disabled={!(!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key))}
					className={'block'} 
					type='plain'
					onEditorChange={this.handleDisplayNameOnChange} 
					onEditorSave={this.handleDisplayNameOnSave} 
					placeholder={'Display Name'} 
					text={profile.DisplayName}/>
			{!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key) && (
				<div className={'container'}>
					<h4>Email</h4>
					<div className={'block'}>{profile.Email}</div>
				</div>
				
			)}	
				<h4>About Me</h4>
				<TCSEditor 
					disabled={!(!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key))}
					className={'block'} 
					type='text'
					onEditorChange={this.handlePDescriptionOnChange} 
					onEditorSave={this.handlePDescriptionOnSave}
					placeholder={'About Me'} 
					text={profile.About}/>
			
				<h4>My Age</h4>
				<TCSEditor 
					disabled={!(!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key))}
					type='text'
					onEditorChange={this.handleAgeOnChange} 
					onEditorSave={this.handleAgeOnSave}
					placeholder={'I\'m ___ years old!'} 
					text={profile.Age}/>
			
				<h4>Notes</h4>
				<TCSEditor 
					disabled={!(!!authUser && (!!authUser.roles['ADMIN'] || authUser.uid===profile.key))}
				type='text'
					onEditorChange={this.handleNotesOnChange} 
					onEditorSave={this.handleNotesOnSave}
					placeholder={'Notes'} 
					text={profile.Notes}/>
				</div>
			</div>
		  	{/* <div classname={'block'}>My Untutorials</div> */}
		  <div className="untutorials">
			  <div className="content">
				{untutorials.map(untutorial => (
				  <div id={untutorial.key} class={'wsite-image wsite-image-border-none project'}>
					  <a href={ROUTES.LAUNCHPAD + untutorial.key} >
						<LazyImage file={this.props.firebase.storage.ref('/public/' + untutorial.Author + '/' + untutorial.ThumbnailFilename)}/>
					  </a>
					  <h4 dangerouslySetInnerHTML={{__html:untutorial.Title}}/>

				</div>
			))}
			</div>
			</div>	
		</div>
	 </section>	
	)

 	

 	
}
}


const ProfilePage = withFirebase(withAuthentication(ProfilePageBase));

export default ProfilePage;
