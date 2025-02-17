import { Card, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import styled from "styled-components";
import { auth, database } from '../firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalMall } from "@material-ui/icons";


const useStyles = makeStyles(theme => ({
    root: {
        width: '15rem',
        height: '25rem',
    },
    media: {
        height: '19rem',
        width: '15rem',
        position: 'absolute',
        // paddingTop: '56.25%', // 16:9
    },
    rootV: {
        width: '15em',
    },
    mediaV: {
        height: "19em",
        width: '15em',
    }

}));


export default function ItemCards({ id, productName, image, price, oldPrice, desc }) {
    const classes = useStyles();
    const [user, setUser] = useState("")
    const [docs, setDocs] = useState([]);
    const [wishData, setWishData] = useState([]);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                database.collection('users').doc(user.uid).collection('cart').onSnapshot((a) => {
                    const fdata = [];
                    a.forEach((item) => {
                        fdata.push({ ...item.data(), key: item.id })

                    })
                    setDocs(fdata)
                })
                database.collection('users').doc(user.uid).collection('wish').onSnapshot((a) => {
                    const wdata = [];
                    a.forEach((item) => {
                        wdata.push({ ...item.data(), key: item.id })

                    })
                    setWishData(wdata)
                })
            }
            else setUser(null)
        }
        )
    }, [setUser])

    const Msg = () => (
        <>
            <div style={{ display: "flex", }}>
                <LocalMall fontSize="small" />
                <h6 >&nbsp; Product added to Bag</h6>
            </div>
        </>
    );


    const addItem = () => {
        let q = docs.filter(a => a.productName === productName)

        if (user) {

            if (q.length === 0) {
                database.collection("users").doc(user.uid).collection("cart").add({
                    productName: productName,
                    image: image,
                    price: price,
                    oldPrice: oldPrice
                }).then(() => {
                    toast(Msg,
                        {
                            position: "bottom-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined
                        });
                })
            }
            else {
                toast.warn("Item already in cart", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,

                })

            }
        }
        else {
            toast.warn("Please Login First")
        }

    }

    const addtoWish = () => {
        let q = wishData.filter(a => a.productName === productName)
        if (user) {
            if (q.length === 0) {
                database.collection("users").doc(user.uid).collection("wish").add({
                    productName: productName,
                    image: image,
                    price: price,
                    oldPrice: oldPrice
                }).then(() => {
                    toast("Item Added to Wishlist",
                        {
                            position: "bottom-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                })
            }
            else {
                toast.warn("Item already in WishList", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,

                })
            }
        }
        else {
            toast.warn("Please Login First")
        }

    }

    const OriginalPrice = styled.span`
        text-decoration: line-through;
        font-size: 15px;
        font-weight: 100;
        color: #7e818c;
        padding: 0 0.2rem;
        `;
    return (
        <div>

            <Card className={classes.rootV} style={{ marginTop: '3em' }}>
                <CardMedia
                    className={classes.mediaV}
                    image={image}
                >
                    <IconButton>
                        <FavoriteIcon onClick={() => { addtoWish() }} />
                    </IconButton>
                    <br />
                    <IconButton btne>
                        <LocalMallIcon onClick={() => { addItem() }} />
                    </IconButton>
                    <ToastContainer />
                </CardMedia>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {desc}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {productName}
                    </Typography>
                    <Typography variant="body1" style={{ color: 'black' }} component="p">
                        ₹{price} <OriginalPrice id="price">{oldPrice}</OriginalPrice>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}