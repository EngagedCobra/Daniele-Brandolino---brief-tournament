
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router"

const MainLayout = () => {

    return (
      <>
        <header className="px-4 w-full max-w-4xl mx-auto">
          <div className="p-2 mt-4 border rounded-2xl flex items-center justify-evenly">
            <Button
              variant={"secondary"}
              className="shrink"
              nativeButton={false}
              render={<Link to={`/teams`} />}
            >
              Squadre
            </Button>
            <Button
              variant={"secondary"}
              className="shrink"
              nativeButton={false}
              render={<Link to={`/competitions`} />}
            >
              Tornei
            </Button>
            <Button
              variant={"secondary"}
              className="shrink"
              nativeButton={false}
              render={<Link to={`/athletes`} />}
            >
              Atleti
            </Button>
            <Button
              variant={"secondary"}
              className="shrink"
              nativeButton={false}
              render={<Link to={`/past-competitions`} />}
            >
              Storico tornei
            </Button>
          </div>
        </header>
        <Outlet />
      </>
    );
}

export default MainLayout