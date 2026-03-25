import type { SidebarLink } from "./links";

export const filterSidebarByRole = (
  links: SidebarLink[], 
  userRole: string
): SidebarLink[] => {
  return links
    .map(link => {
      // Check if user has access to this link
      if (link.roles && !link.roles.includes(userRole.toLowerCase())) {
        return null;
      }

      // If link has subLinks, filter them by role
      if (link.subLinks) {
        const filteredSubLinks = link.subLinks.filter(subLink => {
          if (subLink.roles) {
            return subLink.roles.includes(userRole.toLowerCase());
          }
          return true; // Show if no roles specified
        });

        // Don't show parent if no subLinks are visible
        if (filteredSubLinks.length === 0) {
          return null;
        }

        return {
          ...link,
          subLinks: filteredSubLinks
        };
      }

      return link;
    })
    .filter((link): link is SidebarLink => link !== null);
};
