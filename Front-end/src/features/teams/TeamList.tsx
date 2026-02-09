import { useMutation, useQuery } from '@tanstack/react-query'
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
import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/MainLayout'



const TeamList = () => {
    const { data: teams = [], isPending, isError, refetch } = useQuery({
        queryKey: ['teams'],
        queryFn: TeamService.list
    })
    /* 
        const { mutate, isPending: isDeleting } = useMutation({
            mutationFn: TeamService.create,
            onSuccess: () => refetch()
        }) */

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
                            <Button>Action</Button>
                        </ItemActions>
                    </Item>
                </>
            })}
            </div>

        </>
    )
}

export default TeamList