import CustomEmpty from "@/components/customEmpty";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, OctagonAlert, Trophy } from "lucide-react";
import { Link } from "react-router";
import { TeamService } from "../teams/team.service";
import { CompetitionService } from "./competition.service";

const HistoryList = () => {
    const {
        data: competitions = [],
        isPending,
        isError,
        refetch,
        error,
    } = useQuery({
        queryKey: ["competitions-history"],
        queryFn: async () => {
            const res = await CompetitionService.list();
            // Filtra solo competizioni concluse (con vincitore)
            return res.filter(c => c.winner !== null).sort((a, b) => b.id - a.id);
        },
    });

    // Query per tutti i teams (per mostrare nome vincitore)
    const { data: allTeams = [] } = useQuery({
        queryKey: ["teams"],
        queryFn: () => TeamService.list(),
    });

    const getWinnerTeam = (winnerId: number | null) => {
        if (!winnerId) return null;
        return allTeams.find(t => t.id === winnerId);
    };

    if (isPending) {
        return (
            <CustomEmpty title="Caricamento..." message="Attendi mentre vengono caricate le competizioni" icon={<Loader2 className="animate.spin" />} />
        );
    }

    if (isError) {
        return (
            <CustomEmpty title="Errore imprevisto" message={error.message} link={refetch()} icon={<OctagonAlert />} />
        );
    }

    return (
        <>
            <div className="max-w-3xl mx-auto mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        Storico Competizioni
                    </h1>
                </div>

                {competitions.length === 0 ? (
                    <CustomEmpty title="Nessuna competizione conclusa" message="Le competizioni completate appariranno qui" />
                ) : (
                    competitions.map((competition) => {
                        const winnerTeam = getWinnerTeam(competition.winner);

                        return (
                            <Item key={competition.id}>
                                <ItemContent>
                                    <ItemTitle>{competition.name}</ItemTitle>
                                    <ItemDescription>
                                        {competition.team_number} squadre • {competition.phases} fasi
                                        {winnerTeam && (
                                            <span className="ml-2">
                                                • Vincitore:
                                                <Link
                                                    to={`/teams/${winnerTeam.id}`}
                                                    className="text-yellow-600 font-semibold hover:underline"
                                                >
                                                    {winnerTeam.name}
                                                </Link>
                                            </span>
                                        )}
                                    </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Button
                                        variant="secondary"
                                        className="w-full shrink"
                                        nativeButton={false}
                                        render={<Link to={`/competitions/${competition.id}/games`} />}
                                    >
                                        Vedi partite
                                        <ArrowRight />
                                    </Button>
                                </ItemActions>
                            </Item>
                        );
                    })
                )}
            </div>
        </>
    );
};

export default HistoryList;