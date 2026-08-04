export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  demo_url?: string | null;
  github_url?: string | null;
  tags: string[];
  featured?: boolean;
  created_at?: string;
}

// Initial default projects
let PROJECTS_STORE: ProjectItem[] = [];

const DELETED_IDS: Set<string> = new Set();

export function getProjectsStore(): ProjectItem[] {
  return PROJECTS_STORE.filter((p) => !DELETED_IDS.has(p.id));
}

export function addProjectToStore(project: ProjectItem): ProjectItem {
  DELETED_IDS.delete(project.id);
  PROJECTS_STORE = [project, ...PROJECTS_STORE.filter((p) => p.id !== project.id)];
  return project;
}

export function updateProjectInStore(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
  let updated: ProjectItem | null = null;
  PROJECTS_STORE = PROJECTS_STORE.map((p) => {
    if (p.id === id) {
      updated = { ...p, ...updates };
      return updated;
    }
    return p;
  });
  return updated;
}

export function deleteProjectFromStore(id: string): boolean {
  DELETED_IDS.add(id);
  const initialLen = PROJECTS_STORE.length;
  PROJECTS_STORE = PROJECTS_STORE.filter((p) => p.id !== id);
  return true;
}
