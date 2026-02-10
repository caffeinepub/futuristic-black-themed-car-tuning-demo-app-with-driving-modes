import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetThrottleSetting() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['throttleSetting'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const setting = await actor.getThrottleSetting();
      return Number(setting);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSaveThrottleSetting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: number) => {
      if (!actor) throw new Error('Actor not available');
      if (value < 1 || value > 10) {
        throw new Error('Throttle value must be between 1 and 10');
      }
      return actor.saveThrottleSetting(BigInt(value));
    },
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ['throttleSetting'] });
      
      const previousValue = queryClient.getQueryData<number>(['throttleSetting']);
      
      queryClient.setQueryData<number>(['throttleSetting'], newValue);
      
      return { previousValue };
    },
    onError: (err, newValue, context) => {
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['throttleSetting'], context.previousValue);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['throttleSetting'] });
    },
  });
}
