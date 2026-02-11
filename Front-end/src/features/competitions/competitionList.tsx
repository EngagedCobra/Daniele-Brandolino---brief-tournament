import CustomEmpty from "@/components/customEmpty";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2, OctagonAlert, Trophy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import { CompetitionService } from "./competition.service";

const createCompetitionSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(50, "Il nome è troppo lungo").trim(),
  team_number: z.coerce.number().refine(
    (number) => [4, 8, 16].includes(number)
  ),
});

type CompetitionData = z.infer<typeof createCompetitionSchema>;

const CompetitionList = () => {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const competitionForm = useForm({
    resolver: zodResolver(createCompetitionSchema),
    defaultValues: {
      name: "",

    },
  });

  const queryClient = useQueryClient();

  const {
    data: competitions = [],
    isPending,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const res = await CompetitionService.list();
      // Filtra solo competizioni in corso (senza vincitore)
      return res.filter(c => !c.winner)
    },
  });

  const createCompetitionMutation = useMutation({
    mutationFn: CompetitionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
      setCreateDialogOpen(false);
      competitionForm.reset();
    }
  });

  const handleCompetitionCreate = (data: CompetitionData) => {
    createCompetitionMutation.mutate(data);
  };

  if (isPending) {
    return (
      <CustomEmpty title="Caricamento..." linkText="Attendi mentre vengono caricate le competizioni" icon={<Loader2 className="animate-spin" />} ></CustomEmpty>
    );
  }

  if (isError) {
    return (
      <CustomEmpty title="Errore imprevisto" icon={<OctagonAlert />} message={error.message} linkText="Riprova" link={refetch()}  ></CustomEmpty>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Competizioni in Corso
          </h1>
        </div>

        {competitions.length === 0 ? (
          <CustomEmpty title="Nessuna competizione in corso" message="Inizia creando la tua prima competizione"/>
        ) : (
          competitions.map((competition) => (
            <Item key={competition.id}>
              <ItemContent>
                <ItemTitle>{competition.name}</ItemTitle>
                <ItemDescription>
                  {competition.team_number} squadre • {competition.phases} fasi
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="secondary"
                  className="w-full shrink"
                  nativeButton={false}
                  render={<Link to={`/competitions/${competition.id}`} />}
                >
                  Gestisci squadre
                  <ArrowRight />
                </Button>
              </ItemActions>
            </Item>
          ))
        )}

        <div className="flex justify-center mt-8">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setCreateDialogOpen}
          >
            <DialogTrigger asChild className="px-4 py-2 rounded-2xl">
              <Button>
                Crea nuova competizione
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuova Competizione</DialogTitle>
                <form
                  onSubmit={competitionForm.handleSubmit(
                    handleCompetitionCreate
                  )}
                >
                  <FieldSet className="w-full max-w-xs">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="competition-name" className="mt-4">
                          Nome della competizione
                        </FieldLabel>
                        <Input
                          id="competition-name"
                          type="text"
                          placeholder="Coppa Italia 2024"
                          {...competitionForm.register("name")}
                        />
                        {competitionForm.formState.errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {competitionForm.formState.errors.name.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSet className="w-full max-w-xs">
                    <FieldGroup>
                      <Field>
                        <FieldLabel
                          htmlFor="competition-team-number"
                          className="mt-4"
                        >
                          Numero di squadre
                        </FieldLabel>
                        <select
                          id="competition-team-number"
                          className="w-full border rounded px-3 py-2"
                          {...competitionForm.register("team_number")}
                        >
                          <option value={4}>4 squadre (2 fasi)</option>
                          <option value={8}>8 squadre (3 fasi)</option>
                          <option value={16}>16 squadre (4 fasi)</option>
                        </select>
                        {competitionForm.formState.errors.team_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              competitionForm.formState.errors.team_number
                                .message
                            }
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <Button
                    type="submit"
                    className="mt-4"
                    disabled={createCompetitionMutation.isPending}
                  >
                    {createCompetitionMutation.isPending
                      ? "Creazione..."
                      : "Crea competizione"}
                  </Button>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default CompetitionList;