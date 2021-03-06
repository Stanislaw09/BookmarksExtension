import React,{useState} from 'react'
import {Typography,
    makeStyles,
    Avatar,
    Collapse,
    Paper,
    Link,
    IconButton,
    Menu,
    Grid,
    MenuItem} from '@material-ui/core'
import {FacebookShareButton,
    FacebookIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    RedditShareButton,
    RedditIcon,
    EmailShareButton,
    EmailIcon} from 'react-share'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import MenuIcon from '@material-ui/icons/Menu'
import ClassIcon from '@material-ui/icons/Class'
const firebase=require('firebase')

const useStyles=makeStyles(theme=>({
    grid:{
        backgroundColor: '#20252e',
        height: 'fit-content'
    },
    container:{
        height: '100%'
    },
    gridHeader:{
        display: 'inline-flex',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '-2px'
    },
    gridSubHeader:{
        display: 'flex',
        width: 'calc(100% - 50px)'
    },
    headerContent:{
        width: '83%'
    },
    avatar:{
        width: '30px',
        height: '30px',
        margin: '6px'
    },
    link:{
        margin: '0 4px 0 0',
        fontSize: '14px',
        display: 'flex',
        textDecoration: 'none',
        underline: 'none',
        color: '#7187ab'
    },
    date:{
        margin: 'auto 10px',
        color: '#555',
        fontSize: '13px',
        fontStyle: 'italic'
    },
    headerData:{
        display: 'inline-flex'
    },
    title:{
        margin: '4px 2px',
        fontSize: '12px',
        color: '#494d5b',
        fontWeight: '600',
        wordWrap: 'break-word'
    },
    menuBtn:{
        height: '46px',
        width: '46px'
    },
    menuItem:{
        marginRight: '10px',
        color: '#444'
    },
    menu:{
        width: '190px'
    },
    categoriesMenu:{
        position: 'table'
    },
    subMenuIcon:{
        marginRight: '10px',
        color: '#444'
    },
    menuIcon:{
        width: '30px',
        height: '30px'
    },
    shareContainers:{
        padding: '10px'
    },
    share:{
        width: '30px',
        height: '30px',
        margin: '4px',
        borderRadius: '50%'
    },
    imgContainer:{
        overflow: 'hidden',
        width: '100%',
        maxHeight: '250px'
    },
    image:{
        width: '100%',
        borderRadius: '2px'
    }
}))

export const PageView=props=>{
    const classes=useStyles()
    const [menuAnchor, setMenuAnchor]=useState(null)
    const [shareMenu, setShareMenu]=useState(false)
    const [categoriesAddAnchor, setCategoriesAddAnchor]=useState(false)
    const [categoriesRemoveAnchor, setCategoriesRemoveAnchor]=useState(false)
    const date=new Date(1970, 0, 1)
    date.setSeconds(props.page.date.seconds)

    const handleDelete=()=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()
            let pages=data.pages.filter(item=>item.url!=props.page.url || item.date.seconds!=props.page.date.seconds)

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: data.quotes,
                pages: pages,
                quoteCategories: data.quoteCategories,
                pageCategories: data.pageCategories
            })
        })

        setMenuAnchor(null)
    }

    const handleFavourite=()=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()

            let pages=data.pages.map(item=>{
                if(item.url==props.page.url && item.date.seconds==props.page.date.seconds)
                    return {
                        date: props.page.date,
                        favIcon: props.page.favIcon,
                        favourite: !props.page.favourite,
                        image: props.page.image,
                        title: props.page.title,
                        url: props.page.url,
                        categories: props.page.categories
                    }
                else
                    return item
                })

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: data.quotes,
                pages: pages,
                quoteCategories: data.quoteCategories,
                pageCategories: data.pageCategories
            })
        })
        setMenuAnchor(null)
    }

    const addToCategory=category=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()

            let pages=data.pages.map(item=>{
                if(item.text==props.page.text && item.date.seconds==props.page.date.seconds)
                    return{
                        date: props.page.date,
                        favIcon: props.page.favIcon,
                        favourite: props.page.favourite,
                        image: props.page.image,
                        title: props.page.title,
                        url: props.page.url,
                        categories: [...props.page.categories, category]
                    }
                else
                    return item
                })

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: data.quotes,
                pages: pages,
                quoteCategories: data.quoteCategories,
                pageCategories: data.pageCategories
            })
        })
        setCategoriesAddAnchor(null)
    }

    const removeFromCategory=category=>{
        firebase.firestore().collection('users').doc(props.id).get().then(doc=>{
            let data=doc.data()
            let categories=props.categories.filter(item=>item!=category)

            let pages=data.pages.map(item=>{
                if(item.text==props.page.text && item.date.seconds==props.page.date.seconds)
                    return{
                        date: props.page.date,
                        favIcon: props.page.favIcon,
                        favourite: props.page.favourite,
                        title: props.page.title,
                        image: props.page.image,
                        url: props.page.url,
                        categories: categories
                    }
                else
                    return item
            })

            firebase.firestore().collection("users").doc(props.id).set({
                quotes: data.quotes,
                pages: pages,
                quoteCategories: data.quoteCategories,
                pageCategories: data.pageCategories
            })
        })
        setCategoriesRemoveAnchor(null)
    }

    return(
        <Grid item xs={6} sm={4} md={3} className={classes.grid}>
            <div className={classes.container}>
                <Paper className={classes.gridHeader} elevation={5}>
                    <div className={classes.gridSubHeader}>
                        <Avatar src={props.page.favIcon} className={classes.avatar}/>

                        <div className={classes.headerContent}>
                            {
                                props.page.title.length>46 ?
                                    <Typography className={classes.title}>{props.page.title.slice(0, 46)}...</Typography> :
                                    <Typography className={classes.title}>{props.page.title}</Typography>}

                            <div className={classes.headerData}>
                                <Typography>
                                    <Link
                                        href={props.page.url}
                                        target='_blank'
                                        className={classes.link}>
                                        {props.page.url.replace('http://','').replace('https://','').replace('en.', '').replace('www.', '').split(/[/?#]/)[0]}
                                    </Link>
                                </Typography>

                                <Typography className={classes.date}>{date.toLocaleDateString()}</Typography>
                            </div>
                        </div>
                    </div>

                    <IconButton
                        onClick={event=>setMenuAnchor(event.currentTarget)}
                        className={classes.menuBtn}>
                        <MenuIcon className={classes.menuIcon}/>
                    </IconButton>

                    <Menu
                        open={menuAnchor}
                        keepMounted
                        anchorEl={menuAnchor}
                        onClose={()=>setMenuAnchor(false)}
                        className={classes.menu}>

                        <MenuItem onClick={handleFavourite} className={classes.menuItem}>
                            {
                                props.page.favourite ?
                                    <FavoriteIcon
                                        style={{color: 'rgba(138, 46, 68, 0.95)'}} className={classes.subMenuIcon}/> :
                                        <FavoriteBorderIcon className={classes.subMenuIcon}/>
                            }Favourite
                        </MenuItem>

                        <MenuItem
                            onClick={event=>setCategoriesAddAnchor(event.currentTarget)}
                            className={classes.categoriesMenu}>
                            <ClassIcon className={classes.menuItem}/>
                            Add to...
                        </MenuItem>

                        <Menu
                            open={categoriesAddAnchor}
                            keepMounted
                            anchorEl={categoriesAddAnchor}
                            onClose={()=>setCategoriesAddAnchor(false)}
                            className={classes.menu}>
                            {
                                props.categories.map(category=>
                                    !props.page.categories.includes(category) &&
                                        <MenuItem onClick={()=>addToCategory(category)}>{category}</MenuItem>
                                )
                            }
                        </Menu>

                        <MenuItem
                            onClick={event=>setCategoriesRemoveAnchor(event.currentTarget)}
                            className={classes.categoriesMenu}
                            style={props.page.categories.length ? {display: 'flex'} : {display: 'none'}}>
                            <ClassIcon className={classes.menuItem}/>
                            Remove from...
                        </MenuItem>

                        <Menu
                            open={categoriesRemoveAnchor}
                            keepMounted
                            anchorEl={categoriesRemoveAnchor}
                            onClose={()=>setCategoriesRemoveAnchor(false)}
                            className={classes.menu}>
                            {
                                props.page.categories.map(category=>
                                    <MenuItem onClick={()=>removeFromCategory(category)}>{category}</MenuItem>
                                )
                            }
                        </Menu>

                        <MenuItem onClick={handleDelete} className={classes.menuItem}>
                            <DeleteIcon className={classes.subMenuIcon}/>Delete
                        </MenuItem>

                        <MenuItem onClick={()=>setShareMenu(prev=>!prev)} className={classes.menuItem}>
                            <ShareIcon className={classes.subMenuIcon}/>Share
                        </MenuItem>

                        <Collapse in={shareMenu}>
                            <div className={classes.shareContainers}>
                                <FacebookShareButton
                                    url={props.page.url}
                                    onClick={()=>setMenuAnchor(null)}>
                                    <FacebookIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </FacebookShareButton>

                                <FacebookMessengerShareButton
                                    url={props.page.url}
                                    onClick={()=>setMenuAnchor(null)}>
                                    <FacebookMessengerIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </FacebookMessengerShareButton>

                                <TwitterShareButton
                                    url={props.page.url}
                                    onClick={()=>setMenuAnchor(null)}>
                                    <TwitterIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </TwitterShareButton>
                            </div>

                            <div className={classes.shareContainers}>
                                <WhatsappShareButton
                                    url={props.page.url}
                                    onClick={()=>setMenuAnchor(null)}>
                                    <WhatsappIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </WhatsappShareButton>

                                <RedditShareButton
                                    url={props.page.url}
                                    onClick={()=>setMenuAnchor(null)}>
                                    <RedditIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </RedditShareButton>

                                <EmailShareButton
                                    url={props.page.url}
                                    onClick={()=>setMenuAnchor(null)}>
                                    <EmailIcon
                                        logoFillColor="white"
                                        className={classes.share}/>
                                </EmailShareButton>
                            </div>
                        </Collapse>
                    </Menu>
                </Paper>

                <div className={classes.imgContainer}>
                    <a href={props.page.url} target='_blank'>
                        <img src={props.page.image} className={classes.image}/>
                    </a>
                </div>
            </div>
        </Grid>
    )
}
