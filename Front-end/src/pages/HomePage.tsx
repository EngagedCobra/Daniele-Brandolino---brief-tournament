import { Button } from "@/components/ui/button"
import MainLayout from "@/layouts/MainLayout"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

const HomePage = () => {
    return (
        <>
        <div className="w-full max-w-4xl mx-auto mt-8 px-4 pb-4">
            <h1 className="font-bold text-center text-4xl mb-4"> Tournament manager</h1>
            <Button
                variant={'secondary'}
                className='w-full after:absolute after:inset-0 shrink'
                render={<Link to={'/teams'} />}
            >
                Visualizza squadre
                <ArrowRight />
            </Button>
        </div>
        </>
    )
}

export default HomePage