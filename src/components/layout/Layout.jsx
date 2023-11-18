import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => {

    return (
        <div style={{ backgroundColor: "rgb(228, 228, 228)" }}>
            <Header />
            <main style={{ minHeight: "90.4vh" }}>
                {props.children}
            </main>
            <Footer />
        </div >
    )
}
export default Layout
