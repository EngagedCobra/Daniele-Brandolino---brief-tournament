import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button, MotionButton } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HomeLink from "@/components/HomeLink";

const HomePage = () => {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-8 px-4 pb-4">
        <h1 className="font-bold text-center text-4xl mb-8">
          Tournament manager
        </h1>
        <div className="grid grid-cols-2 gap-8">
          <HomeLink link="competitions/" text="TORNEI"></HomeLink>
          <HomeLink link="teams/" text="SQUADRE"></HomeLink>
          <HomeLink link="athletes/" text="ATLETI"></HomeLink>
          <HomeLink link="past-competitions/" text="STORICO"></HomeLink>
        </div>
      </div>
    </>
  );
};

export default HomePage;
