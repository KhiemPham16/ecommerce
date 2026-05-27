import React from 'react';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';


export default function App() {
    return (
        <>
        <Header />
        <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/blog" element={<div>Blog</div>} />
            <Route path="/contact" element={<div>Contact</div>} />
        </Routes>
        </>
    );
}
