import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FuelInjectionSettings } from '../backend';

export function useGetFuelInjectionSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FuelInjectionSettings | null>({
    queryKey: ['fuelInjectionSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const settings = await actor.getFuelInjectionSettings();
      
      // If no settings exist, create defaults
      if (!settings) {
        const defaultSettings: FuelInjectionSettings = {
          amount: 50,
          pressure: 500,
          temperature: 50,
        };
        await actor.saveFuelInjectionSettings(defaultSettings);
        return defaultSettings;
      }
      
      return settings;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSaveFuelInjectionSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: FuelInjectionSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveFuelInjectionSettings(settings);
    },
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ['fuelInjectionSettings'] });
      
      const previousSettings = queryClient.getQueryData<FuelInjectionSettings>(['fuelInjectionSettings']);
      
      queryClient.setQueryData<FuelInjectionSettings>(['fuelInjectionSettings'], newSettings);
      
      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(['fuelInjectionSettings'], context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelInjectionSettings'] });
    },
  });
}
