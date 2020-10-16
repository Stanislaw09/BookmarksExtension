import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter} from 'react-router-dom'

const firebase=require('firebase')
require('firebase/firestore')

firebase.initializeApp({
    apiKey: // api key
    authDomain: // domain
    databaseURL: //database url
    projectId: //project id
    storageBucket: //storage bucket
    messagingSenderId: //sender id
    appId: //your app id
})

ReactDOM.render(
    <BrowserRouter basename={window.location.pathname || ''}>
        <App/>
    </BrowserRouter>,document.getElementById('root')
)
