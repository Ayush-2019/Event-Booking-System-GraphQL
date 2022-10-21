import React, {Component} from "react";
import Modal from "../Modal/modal";
import Backdrop from "./Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "./Events/List/EventList";
import {CircularProgress} from '@mui/material';
import  {ShowToast} from "./Toasts/Toasts";

class Events extends Component {

    state = {
        creating:false,
        events:[],
        isLoading:false,
        selectedEvent:null
    };

    isActive = true;

    static contextType = AuthContext;

    constructor(props){
        super(props)
        this.titlelRef = React.createRef();
        this.pricelRef = React.createRef();
        this.datelRef = React.createRef();
        this.descriptionlRef = React.createRef();
    }

    componentDidMount(){
        this.getEvents();
    }

    createEvent = () => {
        this.setState({creating:true})
    }

    modalCancel = () => {
        this.setState({creating:false, selectedEvent:null})
    }

    getEvents = () => {

        this.setState({isLoading:true});

        const req = {
            query : `
                query {
                    events{
                        _id
                        title
                        description
                        price
                        date
                        creater{
                            _id
                            email
                        }
                    }
                }
            
            `
        }


        const token = this.context.token;
    

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
        return res.json();
    })
    .then(resdata => {
        const events = resdata.data.events;
        if(this.isActive){
        this.setState({events:events, isLoading:false});
        }

    })
    .catch(err => {
        console.log(err);
        if(this.isActive){
        this.setState({isLoading:false});
        }
    }
        )

    }



    modalConfirm = () => {
        this.setState({creating:false});
        const title = this.titlelRef.current.value;
        const price = +this.pricelRef.current.value;
        const date = this.datelRef.current.value;
        const description = this.descriptionlRef.current.value;

        if(title.trim().length === 0 || price<= 0 || date.trim().length === 0 || description.trim().length === 0){
            return;
        }

        const event = {title, price, date, description};
        console.log(event);

            const req = {
                query : `
                    mutation CreateEvents($ttl:String!, $description:String!, $price:Float!, $date:String!) {
                        createEvents(eventInput:{title: $ttl, description:$description, price:$price, date:$date}){
                            _id
                            title
                            description
                            price
                            date
                            creater{
                                _id
                                email
                            }
                        }
                    }
                
                `,
                variables:{
                    ttl:title,
                    description:description,
                    price:price,
                    date:date
                }
            }


            const token = this.context.token;
        

        fetch('http://localhost:3001/graphql',{
            method:'POST',
            body:JSON.stringify(req),
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('An error occured')
            }
            ShowToast('success', 'Event Created Succesfully')
            return res.json();
        })
        .then(data => {
            this.setState(prevState => {
                const addevents = [...prevState.events];
                addevents.push({
                             _id:data.data.createEvents._id,
                            title:data.data.createEvents.title,
                            description:data.data.createEvents.description,
                            price:data.data.createEvents.price,
                            date:data.data.createEvents.date,
                            creater:{
                                _id:this.context.userID
                                
                            }
                });
                
                return {events:addevents};

            });
            
        
        })
        .catch(err => {
            console.log(err);
            ShowToast('error', err);
        
        })
    }

    showDetails = eventID => {
        this.setState(prevState => {
            const eventhere = prevState.events.find(e => e._id === eventID);
            return {selectedEvent : eventhere}
        })
    }

    bookEvent = () => {
        
        const req = {
            query : `
                mutation BookEvent($id:ID!){
                    bookEvent(eventID:$id){
                        _id
                        createdAt
                        updatedAt
                    }
                }
            
            `,
            variables:{
                id:this.state.selectedEvent._id
            }
        }


        const token = this.context.token;
    

    fetch('http://localhost:3001/graphql',{
        method:'POST',
        body:JSON.stringify(req),
        headers:{
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + token
        }
    }).then(res => {
        if(res.status !== 200 && res.status !== 201){
            throw new Error('An error occured')
        }
        ShowToast('success', 'Event Booked')
        return res.json();
    })
    .then(resdata => {
        console.log(resdata)
        this.setState({selectedEvent:null})

    })
    .catch(err => {
        console.log(err)
        this.setState({isLoading:false});
        ShowToast('error', err)
    }
        )
    }

    componentWillUnmount(){
        this.isActive = false;
    }
    render() {

        
        return(
            <>
            {this.state.creating && <Modal 
            title = "Add Event" 
            cancel 
            confirm 
            onClose = {this.modalCancel} 
            onSubmit = {this.modalConfirm}
            submit = "Confirm"
            >
            <form>
                <div className="form-control">
                    <label htmlFor="title">Event Title</label>
                    <input type="text" id="title" ref={this.titlelRef}></input>
                </div>

                <div className="form-control">
                    <label htmlFor="price">Event Price</label>
                    <input type="number" id="price" ref={this.pricelRef}></input>
                </div>

                <div className="form-control">
                    <label htmlFor="date">Event Date</label>
                    <input type="datetime-local" id="date" ref={this.datelRef}></input>
                </div>

                <div className="form-control">
                    <label htmlFor="description">Event Description</label>
                    <textarea id="description" rows="3" ref={this.descriptionlRef}></textarea>
                </div>
            </form>
                
                </Modal>}
            
            {this.state.selectedEvent && 
            
            <Modal 
            title = {this.state.selectedEvent.title} 
            cancel 
            confirm 
            onClose = {this.modalCancel} 
            onSubmit = {this.bookEvent}
            submit = "Book This Event"
            cannotSubmit = {!this.context.token}
            shouldLogin = {true}
            >
                
                <h1>{this.state.selectedEvent.title}</h1>
                <h2>${this.state.selectedEvent.price}</h2>
                <h2>{this.state.selectedEvent.date}</h2>
                <p>{this.state.selectedEvent.description}</p>
                
                </Modal>
            
            
            }
            <h1 style={{marginLeft:'50%'}}>All Events</h1>

            {this.context.token && <div className="event_control">
            <button className="btn" style={{backgroundColor:"green", boxShadow: '0 4px 8px grey'}} onClick={this.createEvent}>Create New Event</button>
            </div>}
            {this.state.isLoading ? <CircularProgress style={{
                marginLeft:'20%',
                marginTop:'50%'
            }} color = "success"/> : 
            <EventList
                events = {this.state.events}
                authuser = {this.context.userID}
                onShow = {this.showDetails}
            />

    }
            </>
        )
    }
};

export default Events;