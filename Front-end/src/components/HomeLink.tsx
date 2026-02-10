import { Link } from "react-router";

type HomeLinkProps = {
  link: string;
  text: string;
};

const HomeLink = ({ link, text }: HomeLinkProps) => {
  return (
    <>
      <Link to={link}>
        <div className="h-52 rounded-2xl flex justify-center items-center bg-blue-600 hover:bg-blue-950 transition-all ease-in-out duration-500">
          <p className="text-white font-bold text-2xl">{text}</p>
        </div>
      </Link>
    </>
  );
};

export default HomeLink;
