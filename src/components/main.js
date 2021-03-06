/*global chrome*/
import React,{useState, useEffect} from 'react'
import {Tabs, Tab, makeStyles, IconButton} from '@material-ui/core'
import {useHistory} from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import {Quotes} from './quotes'
import {Pages} from './pages'
const firebase=require('firebase')

const useStyles=makeStyles({
    container:{
        minWidth: '580px',
        minHeight: '800px'
    },
    header:{
        backgroundColor: '#7e3477',
        position: 'sticky',
        display: 'flex',
        top: '0',
        zIndex: '1000'
    },
    arrowBackBtn:{
        marginLeft: '12px',
        color: '#ddd',
        padding: '4px',
        width: '48px',
        height: '48px'
    },
    arrowBackIcon:{
        width: '30px',
        height: '30px'
    },
    tabs:{
        margin: '0 auto'
    },
    captionEnabled:{
        color: '#fff',
        fontSize: '19px',
        fontWeight: '500',
        margin: '0 8px'
    },
    captionDisabled:{
        color: '#bdbdbd',
        fontSize: '19px',
        fontWeight: '500',
        margin: '0 8px'
    }
})

export const Main=()=>{
    const history=useHistory()
    const[quotes, setQuotes]=useState(undefined)
    const[pages, setPages]=useState(undefined)
    const[pageCategories, setPageCategories]=useState([])
    const[quoteCategories, setQuoteCategories]=useState([])
    const[value, setValue]=useState(0)
    const[id, setId]=useState('')
    const classes=useStyles()

    useEffect(()=>{
        chrome.storage.sync.get(null, data=>{
            setId(data.userId)

            firebase.firestore().collection('users').onSnapshot(serverUpdate=>{
                    serverUpdate.docs.map(item=>{
                        const user=item.data()

                        if(data.userId==item.id){
                            setPages(user.pages)
                            setQuotes(user.quotes)
                            setPageCategories(user.pageCategories)
                            setQuoteCategories(user.quoteCategories)
                        }
                    })
                })
        })
    },[])

    const handleChange=(event, newValue)=>setValue(newValue)

    const TabPanel=props=>{
        return(
            <div hidden={props.value!==props.index} role="tabpanel">
                {props.children}
            </div>
        )
    }

     return(
        <div className={classes.container}>
            <div className={classes.header}>
                {/* <IconButton onClick={()=>history.push('/')}
                    className={classes.arrowBackBtn}>
                    <ArrowBackIcon className={classes.arrowBackIcon}/>
                </IconButton> */}

                <Tabs
                    centered
                    onChange={handleChange}
                    className={classes.tabs}>
                    <Tab
                        label='Quotes'
                        className={value===0 ? classes.captionEnabled : classes.captionDisabled}/>
                    <Tab
                        label='Pages'
                        className={value===1 ? classes.captionEnabled : classes.captionDisabled}/>
                </Tabs>
            </div>

            <TabPanel value={value} index={0} className={classes.tabPanel}>
                <Quotes quotes={quotes} categories={quoteCategories} id={id}/>
            </TabPanel>

            <TabPanel value={value} index={1} className={classes.tabPanel}>
                <Pages pages={pages} categories={pageCategories} id={id}/>
            </TabPanel>
        </div>
     )
}
