import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../api/client";
import type { User } from "../../../types";

export const PROFILE_KEYS = {
  profile: ["user", "profile"] as const,
};

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery<User>({
    queryKey: PROFILE_KEYS.profile,
    queryFn: async () => {
      const { data } = await apiClient.get("/user/profile");
      return data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data } = await apiClient.patch("/user/profile", payload);
      return data.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(PROFILE_KEYS.profile, updatedUser);
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}
