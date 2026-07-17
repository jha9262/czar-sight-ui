import { useUser } from "@/lib/queries";

export function useUserViewLogic(id: string) {
  const { data: user, isLoading } = useUser(id);

  let initials = "";
  if (user) {
    initials = user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  }

  return {
    state: { user, isLoading, initials },
  };
}
