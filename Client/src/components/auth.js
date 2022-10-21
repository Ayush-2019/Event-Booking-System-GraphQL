import React, {Component} from "react";
import AuthContext from "../context/auth-context";
import { ShowToast } from "./Toasts/Toasts";

class Auth extends Component {

    state = {
        isLogin:true
    }

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.email = React.createRef()
        this.password = React.createRef()
    }


    changeMode = () => {
        this.setState(prevState => {
            return {isLogin : !prevState.isLogin}
        })
    }

    submitForm = (event) => {
        event.preventDefault();
        const email = this.email.current.value;
        const password = this.password.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        let req = {
            query : `
                query SignIn($email:String!, $password:String!){
                    signin(email:$email, password:$password){
                        userID
                        token
                        tokenexpire
                    }
                }
            
            `,
            variables:{
                email:email,
                password:password
            }
        }

        if(!this.state.isLogin){

            req = {
                query : `
                    mutation CreateUser($email:String!, $password:String!) {
                        createUser(userInput:{email: $email, password:$password}){
                            _id
                            email
                        }
                    }
                
                `,
                variables:{
                    email:email,
                    password:password
                }
            }

        }

        

        fetch('http://localhost:3001/graphql',{
            method:'POST',
            body:JSON.stringify(req),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('An error occured')
            }
            if(this.state.isLogin){
                ShowToast('success', 'Welcome:)')
            }
            else{
                ShowToast('success', 'Registered Succesfully')
            }
            return res.json();
        })
        .then(resdata => {
            console.log(resdata)
            if(resdata.data.signin.token){
                this.context.login(resdata.data.signin.token, resdata.data.signin.userID, resdata.data.signin.tokenexpire)
            }
        })
        .catch(err => console.log(err))
    }

    render() {
        return(
            <>
            <h1 style={{textAlign:'center'}}>Sign-in/Register</h1>

            <div className="auth_page">
                <div className="left">
                    <h3>{this.state.isLogin ? 'New User?' : 'Already have an account?'}</h3>
                    <p style={
                        {
                            textAlign:'justify',
                            maxWidth:'50%'
                        }
                    }>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.

                    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
                    <button className="btn" type="button" onClick={this.changeMode}>{this.state.isLogin ? 'Register Here' : 'Go To Sign In'}</button>
                </div>

                <div>
                    <h1 style={{marginLeft:'20%'}}>{this.state.isLogin ? 'Sign-in Form' : 'Register Form'}</h1>
                <form className="auth_form" onSubmit={this.submitForm}>

                <div className="form-control">
                <label htmlFor= "email">E-mail</label>
                <input type="email" id="email" ref={this.email}/>

                </div>

                <div className="form-control">
                <label htmlFor= "password">Password</label>
                <input type="password" id="password" ref={this.password}/>

                </div>

                <div className="form-actions">
                    
                    <button type="submit" style={{marginLeft:'20%'}}>{this.state.isLogin ? 'Sign-in' : 'Register'}</button>
                </div>



                </form>
                </div>
            </div>
            </>
        )
    }
};

export default Auth;