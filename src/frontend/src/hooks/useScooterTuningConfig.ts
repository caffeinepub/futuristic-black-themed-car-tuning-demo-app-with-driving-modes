import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ScooterTuning } from '../backend';

export function useGetScooterTuningConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScooterTuning | null>({
    queryKey: ['scooterTuningConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const config = await actor.getScooterTuningConfig();
      
      // If no config exists, create a default one
      if (!config) {
        const defaultConfig: ScooterTuning = {
          maxSpeed: 60,
          acceleration: 5.0,
          handling: 50,
          weight: 100,
        };
        await actor.saveScooterTuningConfig(defaultConfig);
        return defaultConfig;
      }
      
      return config;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSaveScooterTuningConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: ScooterTuning) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveScooterTuningConfig(config);
    },
    onMutate: async (newConfig) => {
      await queryClient.cancelQueries({ queryKey: ['scooterTuningConfig'] });
      
      const previousConfig = queryClient.getQueryData<ScooterTuning>(['scooterTuningConfig']);
      
      queryClient.setQueryData<ScooterTuning>(['scooterTuningConfig'], newConfig);
      
      return { previousConfig };
    },
    onError: (err, newConfig, context) => {
      if (context?.previousConfig) {
        queryClient.setQueryData(['scooterTuningConfig'], context.previousConfig);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['scooterTuningConfig'] });
    },
  });
}
