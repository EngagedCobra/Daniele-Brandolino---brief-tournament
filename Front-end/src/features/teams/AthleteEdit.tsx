
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AthleteService } from "../athletes/athlete.service";

const athleteSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  age: z.coerce.number().int().min(18).max(60),
  team_id: z.coerce.number().int().min(1),
});

type AthleteData = z.infer<typeof athleteSchema>;

type AthleteEditProps = {
  id: number,
  updating: true | undefined,
  creating: true | undefined,
}

const AthleteEdit = ({id, updating, creating}: AthleteEditProps) => {

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState();

  const athleteForm = useForm({
    resolver: zodResolver(athleteSchema),
  });

    const queryClient = useQueryClient();

    const formOperation = () => {
      if (creating) handleAthleteCreate
      if (updating) handleAthleteUpdate
    }

      const updateAthleteMutation = useMutation({
        mutationFn: AthleteService.update,
        onSuccess: () => {
          (queryClient.invalidateQueries({
            queryKey: ["athletes"],
          }),
            setDialogOpen(false));
        },
      });
    
      const createAthleteMutation = useMutation({
        mutationFn: AthleteService.create,
        onSuccess: () => {
          (queryClient.invalidateQueries({
            queryKey: ["athletes"],
          }),
            setDialogOpen(false));
        },
      });
    
      const deleteAthleteMutation = useMutation({
        mutationFn: AthleteService.delete,
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["athletes"],
          }),
      });
    
      const handleAthleteCreate = (data: AthleteData) => {
        createAthleteMutation.mutate(data);
      };
    
      const handleAthleteUpdate = (data: AthleteData) => {
        updateAthleteMutation.mutate({ id: id, data });
      };
    
      const handleAthleteDelete = (id: number) => {
        deleteAthleteMutation.mutate(id);
      };
    
/*       useEffect(() => {
        if (selectedAthlete && updating {
          athleteForm.setValue("name", selectedAthlete.name);
          athleteForm.setValue("surname", selectedAthlete.surname);
          athleteForm.setValue("age", selectedAthlete.age);
          athleteForm.setValue("team_id", selectedAthlete.team_id);
        }
      }, [selectedAthlete]); */

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger
          className="bg-blue-300 px-4 py-2 rounded-2xl text-white"
        >
          Aggiungi atleta
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi atleta</DialogTitle>
            <form onSubmit={athleteForm.handleSubmit(formOperation)}>
              <FieldSet className="w-full max-w-xs">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="athlete-name" className="mt-4">
                      Nome
                    </FieldLabel>
                    <Input
                      id="athlete-name"
                      type="text"
                      {...athleteForm.register("name")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet className="w-full max-w-xs">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="athlete-surname" className="mt-4">
                      Cognome
                    </FieldLabel>
                    <Input
                      id="athlete-surname"
                      type="text"
                      {...athleteForm.register("surname")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet className="w-full max-w-xs">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="athlete-age" className="mt-4">
                      Età
                    </FieldLabel>
                    <Input
                      id="athlete-age"
                      type="number"
                      {...athleteForm.register("age")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet className="w-full max-w-xs hidden">
                <FieldGroup>
                  <Field>
                    <Input
                      id="athlete-team-id"
                      type="number"
                      value={id}
                      {...athleteForm.register("team_id")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Button type="submit" className={"mt-4"}>
                Salva
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AthleteEdit