import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Home } from '../pages/Home'
import { Services } from '../pages/Services'
import { Restaurants } from '../pages/Restaurants'
import { RestaurantDetail } from '../pages/RestaurantDetail'
import { Menu } from '../pages/Menu'
import { Profile } from '../pages/Profile'
import { Rooms } from '../pages/Rooms'
import { RoomDetail } from '../pages/RoomDetail'
import { Spa } from '../pages/Spa'
import { SpaServiceDetail } from '../pages/SpaServiceDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'services',
        element: <Services />
      },
      {
        path: 'restaurants',
        element: <Restaurants />
      },
      {
        path: 'restaurants/:id',
        element: <RestaurantDetail />
      },
      {
        path: 'menu',
        element: <Menu />
      },
      {
        path: 'rooms',
        element: <Rooms />
      },
      {
        path: 'rooms/:id',
        element: <RoomDetail />
      },
      {
        path: 'spa',
        element: <Spa />
      },
      {
        path: 'spa/service/:id',
        element: <SpaServiceDetail />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
])
