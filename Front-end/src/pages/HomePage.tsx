import { Link } from 'react-router'

const HomePage = () => {
    return (
        <div className='w-full max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold text-center mt-8'>Tournament Manager</h1>
            <div className='grid grid-cols-2 gap-5 mt-16'>
                <Link to={"/competitions"} className='h-40 bg-blue-400 text-white font-3xl rounded-2xl flex justify-center items-center hover:bg-blue-300 transition-all duration-300'>TORNEI</Link>
                <Link to={"/teams"} className='h-40 bg-blue-400 text-white font-3xl rounded-2xl flex justify-center items-center hover:bg-blue-300 transition-all duration-300'>SQUADRE</Link>
            </div>
        </div>
    )
}

export default HomePage
