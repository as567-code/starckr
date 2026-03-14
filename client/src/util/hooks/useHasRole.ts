import { useAppSelector } from '../redux/hooks.ts';

export function useHasRole(...roles: string[]): boolean {
  const user = useAppSelector((state) => state.user);
  if (!user.roles) return false;
  return roles.some((r) => user.roles!.includes(r));
}
