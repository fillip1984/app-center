"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { GoStack } from "react-icons/go";

import type { EnvironmentSummaryType } from "~/server/api/types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export default function Home() {
  return (
    <div className="flex flex-col grow max-w-200 mx-auto gap-2 ">
      <EnvironmentsList />
      <ParametersList />
      <SecretsList />
    </div>
  );
}

const EnvironmentsList = () => {
  const trpc = useTRPC();
  const { data: environments } = useQuery(
    trpc.environment.readAll.queryOptions(),
  );

  return (
    <div className="flex gap-2 justify-between border rounded-lg flex-col">
      <div className="flex gap-2 justify-between p-2">
        <div className="flex gap-2 items-center">
          <GoStack className="h-8 w-8" />
          <h1>Environments</h1>
        </div>
        <Badge>{environments?.length ?? 0}</Badge>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-4">
        {environments?.map((environment) => (
          <EnvironmentCard key={environment.id} environment={environment} />
        ))}
      </div>
      <CreateEnvironment />
    </div>
  );
};

const EnvironmentCard = ({
  environment,
}: {
  environment: EnvironmentSummaryType;
}) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const deleteEnvironment = useMutation(
    trpc.environment.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.environment.readAll.pathFilter());
      },
    }),
  );
  const handleDeleteEnvironment = async () => {
    await deleteEnvironment.mutateAsync({ id: environment.id });
  };

  return (
    <div className="border rounded flex gap-2 p-4 justify-between">
      <div className="flex flex-col">
        <h4>{environment.name}</h4>
        <span className="text-muted-foreground">{environment.description}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"outline"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteEnvironment}>
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const CreateEnvironment = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const createEnvironment = useMutation(
    trpc.environment.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.environment.readAll.pathFilter());
        setName("");
        setDescription("");
      },
    }),
  );

  const handleCreateEnvironment = async () => {
    await createEnvironment.mutateAsync({
      name,
      description,
    });
  };

  return (
    <div className="flex flex-col gap-2 grow p-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Environment name..."
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Environment description..."
      ></Textarea>
      <Button
        onClick={handleCreateEnvironment}
        disabled={!name || !description}
      >
        Create Environment
      </Button>
    </div>
  );
};

const ParametersList = () => {
  return <div>Parameters List - To be implemented</div>;
  /*
  <div className="flex gap-2 justify-between border rounded-lg flex-col">
      <div className="flex gap-2 justify-between p-2">
        <div className="flex gap-2 items-center">
          <GoStack className="h-8 w-8" />
          <h1>Environments</h1>
        </div>
        <Badge>{environments?.length ?? 0}</Badge>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-4">
        {environments?.map((environment) => (
          <EnvironmentCard key={environment.id} environment={environment} />
        ))}
      </div>
      <CreateEnvironment />
    </div>
  */
};

const SecretsList = () => {
  return <div>Secrets List - To be implemented</div>;
};
