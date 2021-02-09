import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

import {withAuthorization} from '../Session';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  name: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  isAdmin: false,
  isTeacher: false,
};
class NewUserFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE   };
    this.onChange = this.onChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onSubmit = event => {
    const { name, username, passwordOne, isAdmin, isTeacher, errors } = this.state;
    const roles = {};
    if(isAdmin) roles[ROLES.ADMIN] = ROLES.ADMIN;
    if(isTeacher) roles[ROLES.TEACHER] = ROLES.TEACHER;
    if(!isAdmin && !isTeacher) roles[ROLES.STUDENT] = ROLES.STUDENT;

      fetch("/api/createUser", {
        method:"POST",
        headers: {
          Accept: "application/json",
          'Content-Type':"application/json",
        },
        body: JSON.stringify({
          email:"students+"+username+"@thecodingspace.com",
          password:passwordOne,
        })
      })
        .then((response)=>{
          var {uid} = response.json().then(data =>{
            return this.props.firebase
              .profile(data.uid)
              .set({
                Email:data.email,
                DisplayName:name,
                key:data.uid,
                roles,
                About:'',
                Age:'',
                Username:username,
                ThumbnailFilename:'',
                Status:'DRAFT',
              })
              .then(res=>{
                alert('account created!')
                this.props.setGlobalState({
                  // messages:[{

                  //   html:`CREATE.<span class="green">GOOD</span>`,
                  //   type:true},{

                  //   html:`Press any key to continue...`,
                  //   type:false,

                  //   }],
                  // showMessage:true
                });
              })
          });
          
        })
        .catch((response)=>{
          this.props.setGlobalState({
            messages:[{
              html:response,
              type:true
            }]
          })
          console.log(response);
          //this.setState({ error: response.body.json().error });
        })
      event.preventDefault();
  }
  onChange = event => {
    
    if(event.target.name === "name")
      this.setState({ username: event.target.value.trim().replace(/ /g,'.')})
  	this.setState({ [event.target.name]: event.target.value });
    

  };
  onCheckboxChange = event => {
    

    this.setState({ [event.target.name]: event.target.checked });
    

  };
  render() {
  	const {
  		name,
  		username,
  		passwordOne,
  		passwordTwo,
  		error,
      isAdmin,
      isTeacher,
  	} = this.state;
  	const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      name === '';

    return (
    <section id="signup">
       <div className="main"> 
      <form onSubmit={this.onSubmit}>
	      <input
	          name="name"
	          value={name}
	          onChange={this.onChange}
	          type="text"
	          placeholder="Full Name"
	        />
	        <input
	          name="username"
	          value={username}
            disabled={true}
	          onChange={this.onChange}
	          type="text"
	          placeholder="Username"
	        />
	        <input
	          name="passwordOne"
	          value={passwordOne}
	          onChange={this.onChange}
	          type="password"
	          placeholder="Password"
	        />
	        <input
	          name="passwordTwo"
	          value={passwordTwo}
	          onChange={this.onChange}
	          type="password"
	          placeholder="Confirm Password"
	        />
          <div className="labels">
          <label>
            <input
              type="checkbox"
              name="isAdmin"
              onChange={this.onCheckboxChange}/>
              Admin
          </label>
          <label>
            <input
              type="checkbox"
              name="isTeacher"
              onChange={this.onCheckboxChange}/>
              Teacher
          </label>
          </div>
	        <button disabled={isInvalid ? true : null} type="submit">Sign Up</button>
	        {error && <p>{error.message}</p>}
      </form>
       </div>
      </section> 
    );
  }
}

const condition = authUser => authUser && (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.TEACHER]);
const NewUserForm =  withFirebase(withAuthorization(condition)(NewUserFormBase));
//withMail(withAuthorization(withFirebase(SignUpFormBase)));
  
export default NewUserForm;
