import { HandPalm, Play } from "phosphor-react";
import * as zod from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm/index";
import { Countdown } from "./components/Countdown/index";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(
      1,
      "O tempo para a realização da tarefa precisa ser de, no mínimo, 10 minutos"
    )
    .max(
      60,
      "O tempo para a realização da tarefa precisa ser de, no máximo, 60 minutos"
    ),
});
//formulário de criação de um novo ciclo

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)

    reset()
  }
  
  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            Interromper
            <HandPalm size={24} />
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            Começar
            <Play size={24} />
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
