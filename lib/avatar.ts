/**
 * Generate UI Avatars URL for a given username or email
 * @param nameOrEmail - The username or email to generate avatar for
 * @param size - Size of the avatar in pixels (default: 64)
 * @returns URL for the generated avatar
 */
export function generateAvatarUrl(nameOrEmail: string, size: number = 64): string {
  const encodedName = encodeURIComponent(nameOrEmail);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random`;
}

/**
 * Generate default avatar for anonymous users
 * @param size - Size of the avatar in pixels (default: 64)
 * @returns URL for the generated avatar
 */
export function getDefaultAvatar(size: number = 64): string {
  return `https://ui-avatars.com/api/?name=User&size=${size}&background=random`;
}
