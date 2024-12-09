import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between '>
            <Link to='/' className="font-semibold text-xl">Chatbot</Link>
            <ul className='flex justify-center gap-10'>
                <li>
                    <Link className='font-semibold hover:underline' to='/chatbot'>Chatbot</Link>
                </li>
                <li>
                    <Link className='font-semibold hover:underline' to='sentiment-analysis'>Sentiment Analysis</Link>
                </li>
            </ul>
            <div>
                Logout
            </div>
        </div>
    )
}

export default Navbar