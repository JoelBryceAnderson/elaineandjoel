import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GiftsPage from './pages/GiftsPage';
import HotelsPage from './pages/HotelsPage';
import NeighborhoodPage from './pages/NeighborhoodPage';
import GalleryPage from './pages/GalleryPage';
import FaqsPage from './pages/FaqsPage';
import EventsPage from './pages/EventsPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/gifts",
        element: <GiftsPage />
      },
      {
        path: "/hotels",
        element: <HotelsPage />
      },
      {
        path: "/events",
        element: <EventsPage />
      },
      {
        path: "/williamsburg",
        element: <NeighborhoodPage />
      },
      {
        path: "/cute_pics",
        element: <GalleryPage />
      },
      {
        path: "/im_confused",
        element: <FaqsPage />
      }
    ]
  }
]);

const WeddingWebsite: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default WeddingWebsite;
