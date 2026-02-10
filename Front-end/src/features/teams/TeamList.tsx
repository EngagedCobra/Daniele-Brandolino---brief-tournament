import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TeamService } from './team.service'
import { useEffect, useState } from "react"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/MainLayout'
import { Form } from '@base-ui/react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Loader2, OctagonAlert, PackageOpen, SaveIcon } from 'lucide-react'
import type { Team } from './team.type'
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'



const nameSchema = z.object({
    name: z.string().min(1),
});
type NameData = z.infer<typeof nameSchema>

const TeamList = () => {

    const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(nameSchema),
    })

    const queryClient = useQueryClient();

    const { data: teams = [], isPending, isError, refetch, error } = useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const res = await TeamService.list()
            return res.sort((a, b) => a.id - b.id)
        }
    })

    const updateMutation = useMutation({
        mutationFn: TeamService.update,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['teams']
            })
    })

    const handleTeamUpdate = (data: NameData) => {
        if (!selectedTeam) return;
        updateMutation.mutate({ id: selectedTeam.id, data })
        setIsDialogOpen(false)
    }

    useEffect(() => {
        if (selectedTeam) {
            form.setValue('name', selectedTeam.name);
        }
    }, [selectedTeam])


    if (isPending) {
        return (
            <Empty className="border">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Loader2 className="animate-spin" />
                    </EmptyMedia>
                    <EmptyTitle>Caricamento...</EmptyTitle>
                    <EmptyDescription>Attendi mentre vengono caricate le squadre</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    if (isError) {
        return (
            <Empty className="border">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <OctagonAlert />
                    </EmptyMedia>
                    <EmptyTitle>Errore imprevisto</EmptyTitle>
                    <EmptyDescription>{error.message}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => refetch()}>Riprova</Button>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <>
            <MainLayout></MainLayout>
            <div className='max-w-[1240px] mx-auto mt-6'>
                {teams.map(team => {
                    return <>
                        <Item key={team.id}>
                            <ItemMedia variant="image">
                                <img src={team.logo} />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>{team.name}</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger onClick={() => setSelectedTeam(team)} className='bg-blue-300 px-4 py-2 rounded-2xl text-white'>Modifica Team</DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Modifica Team</DialogTitle>
                                            <form onSubmit={form.handleSubmit(handleTeamUpdate)}>
                                                <InputGroup
                                                    className={cn(
                                                        "bg-background shadow-lg",
                                                        form.formState.errors.name && 'border-red-500!',
                                                        !selectedTeam && "animate-pulse"
                                                    )}
                                                >
                                                    <InputGroupInput disabled={!selectedTeam} {...form.register('name')} />
                                                    {selectedTeam && selectedTeam.name !== form.watch("name") && (
                                                        <Button type="submit" size={'icon-sm'} variant={'ghost'}>
                                                            <SaveIcon />
                                                        </Button>
                                                    )}
                                                </InputGroup>
                                            </form>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </ItemActions>
                        </Item>
                    </>
                })}
            </div>

        </>
    )
}

export default TeamList