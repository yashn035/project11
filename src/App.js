import React from "react";
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";

const products = [
  {
    id: 1,
    name: "Laptop",
    price: "₹55000",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    id: 2,
    name: "Headphones",
    price: "₹2000",
    image: "https://m.media-amazon.com/images/I/41-SmR1zwkL._SY300_SX300_QL70_FMwebp_.jpg"
  },
  {
    id: 3,
    name: "Smartphone",
    price: "₹30000",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
  },
  {
    id: 4,
    name: "Smart Watch",
    price: "₹5000",
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTMPm8ONSLA6UWO8wcEgSAXuRrcQAsOot3UJfvHFzuDH3yM0eXMr0akT2oXXwO4YqtzlDBwyKNcRZvy0wF4ZqM5a_Eu-KFuDqCZMPMaDuMpLvv1luB0ZvAP"
  }
];

function App() {

  // Function to add to cart + trigger sync + push
  const addToCart = (name) => {
    alert(name + " added to cart");

    // 1️⃣ Trigger background sync (offline orders)
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(sw => {
        sw.sync.register('sync-orders')
          .then(() => console.log('Sync registered for order:', name))
          .catch(err => console.log('Sync registration failed', err));
      });
    }

    // 2️⃣ Trigger push notification (local test)
    if ('serviceWorker' in navigator && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          navigator.serviceWorker.ready.then(sw => {
            if (sw.active) {
              sw.active.postMessage({
                type: 'PUSH_TEST',
                title: 'Order Added!',
                body: `${name} has been added to your cart`
              });
            }
          });
        } else {
          console.log('Notification permission not granted');
        }
      });
    }
  };

  return (
    <div>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            E-Commerce Store
          </Typography>
        </Toolbar>
      </AppBar>

      <Container style={{marginTop:"20px"}}>

        <Typography variant="h4" align="center" gutterBottom>
          Products
        </Typography>

        <Grid container spacing={4}>

          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>

              <Card>

                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                />

                <CardContent>
                  <Typography variant="h6">
                    {product.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {product.price}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => addToCart(product.name)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>

              </Card>

            </Grid>
          ))}

        </Grid>

      </Container>

    </div>
  );
}

export default App;