
import { Outlet } from "react-router"

const MainLayout = () => {

    return (
        <>
            <header className="px-4 w-full max-w-4xl mx-auto">
                <div className="p-2 mt-4 border rounded-2xl flex items-center justify-between">
                    <p className="font-bold text-xl pl-2">Voci menù</p>
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default MainLayout