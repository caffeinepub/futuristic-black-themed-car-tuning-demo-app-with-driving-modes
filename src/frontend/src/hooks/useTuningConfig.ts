import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CarTuningConfig, DriveMode, TuningParameters } from '../backend';

export function useGetTuningConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CarTuningConfig | null>({
    queryKey: ['tuningConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const config = await actor.getTuningConfig();
      
      // If no config exists, create a default one
      if (!config) {
        const defaultConfig: CarTuningConfig = {
          driveMode: DriveMode.classic,
          tuningParams: {
            suspensionStiffness: 5.0,
            steeringSensitivity: 5.0,
            throttleResponse: 5.0,
            brakeBias: 5.0,
          },
        };
        await actor.saveTuningConfig(defaultConfig);
        return defaultConfig;
      }
      
      return config;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateDriveMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driveMode: DriveMode) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDriveMode(driveMode);
    },
    onMutate: async (newMode) => {
      await queryClient.cancelQueries({ queryKey: ['tuningConfig'] });
      
      const previousConfig = queryClient.getQueryData<CarTuningConfig>(['tuningConfig']);
      
      if (previousConfig) {
        queryClient.setQueryData<CarTuningConfig>(['tuningConfig'], {
          ...previousConfig,
          driveMode: newMode,
        });
      }
      
      return { previousConfig };
    },
    onError: (err, newMode, context) => {
      if (context?.previousConfig) {
        queryClient.setQueryData(['tuningConfig'], context.previousConfig);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tuningConfig'] });
    },
  });
}

export function useUpdateTuningParameters() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TuningParameters) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTuningParameters(params);
    },
    onMutate: async (newParams) => {
      await queryClient.cancelQueries({ queryKey: ['tuningConfig'] });
      
      const previousConfig = queryClient.getQueryData<CarTuningConfig>(['tuningConfig']);
      
      if (previousConfig) {
        queryClient.setQueryData<CarTuningConfig>(['tuningConfig'], {
          ...previousConfig,
          tuningParams: newParams,
        });
      }
      
      return { previousConfig };
    },
    onError: (err, newParams, context) => {
      if (context?.previousConfig) {
        queryClient.setQueryData(['tuningConfig'], context.previousConfig);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tuningConfig'] });
    },
  });
}
