/**
 * A file containing all the api calls for the admin dashboard.
 */
import { deleteData, putData } from '../util/api.tsx';

/**
 * Sends a request to the server to delete a user
 * @param email - the email of the user to delete
 * @returns true if successful, false otherwise
 */
async function deleteUser(email: string) {
  const res = await deleteData(`admin/${email}`);
  if (res.error) return false;
  return true;
}

/**
 * Sends a request to the server to assign a role to a user
 * @param id - the id of the user to update
 * @param role - the role to assign
 * @returns true if successful, false otherwise
 */
async function upgradeUser(id: string, role: string) {
  const res = await putData(`admin/promote/${id}`, { role });
  if (res.error) return false;
  return true;
}

export { deleteUser, upgradeUser };
