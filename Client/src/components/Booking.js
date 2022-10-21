import { CircularProgress } from "@mui/material";
import React, {Component} from "react";
import authContext from "../context/auth-context";
import BookList from "./Bookings/BookingList";
import BookingChart from "./Bookings/Charts/charts";
import BookControls from "./Bookings/Controls/BookControls";
import {ToastContainer, toast} from 'react-toastify';
import { ShowToast } from "./Toasts/Toasts";

class Booking extends Component {

state = {
    isLoading:false,
    bookings:[],
    type:'list'
};
static contextType = authContext;
componentDidMount(){
    this.getBookings();
}

getBookings(){

    this.setState({isLoading:true});
    

    const req = {
        query : `
            query {
                    bookings{
                    _id
                    createdAt
                    updatedAt
                    event{
                        _id
                        title
                        date
                        price
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
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + token
    }
}).then(res => {
    if(res.status !== 200 && res.status !== 201){
        throw new Error('An error occured')
    }
    return res.json();
})
.then(resdata => {
    const bookings = resdata.data.bookings;
    this.setState({bookings:bookings, isLoading:false});

})
.catch(err => {
    console.log(err)
    this.setState({isLoading:false});
}
    )
}

deleteBooking = (bookId) => {
    this.setState({isLoading:true})

    const req = {
        query : `
            mutation CancelBooking($id:ID!) {
                cancelBooking(bookingID:$id){
                    _id
                    title
                }
            }
        `,

        variables : {
            id:bookId
        }
    };


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
    ShowToast('success', 'Booking Cancelled');
    return res.json();
})
.then(resdata => {
    const bookings = resdata.data.bookings;
    this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookId
        });

        return {bookings : updatedBookings, isLoading:false}
    });

})
.catch(err => {
    console.log(err)
    this.setState({isLoading:false});
    ShowToast('error', err)
}
    )
}

typeHandler = (type) => {
    if(type === 'list'){
        this.setState({type:'list'})
    }
    else{
        this.setState({type:'chart'})
    }
}

    render() {

        let content = <CircularProgress style={{
            marginLeft:'50%',
            marginTop:'50%'
        }} color = "success"/>

        if(!this.state.isLoading){
            content = (
                <>


                <ToastContainer/>
                    <BookControls
                        typeHandler = {this.typeHandler}
                        isActive = {this.state.type}
                    />
                    <div>

                        {
                        this.state.type === 'list' ? 

                        <BookList bookings = {this.state.bookings} cancelBooking = {this.deleteBooking}/>
                    
                                :

                                <BookingChart
                                bookings = {this.state.bookings} 
                                />
                    
                    }

                    </div>
                </>
            );
        }
        return(
            <>
            <h1 style={{marginLeft:'40%'}}>Bookings</h1>
            {content}
            </>
        )
    }
};

export default Booking;