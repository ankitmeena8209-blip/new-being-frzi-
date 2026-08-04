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
let PROJECTS_STORE: ProjectItem[] = [
  {
    id: "1",
    title: "Being FRZI Portfolio",
    description: "Ultra-sleek portfolio & web platform with Framer Motion, dynamic typography, and Supabase integration.",
    category: "Fullstack",
    image_url: "/images/face-card.png",
    demo_url: "https://being-frzi.vercel.app",
    github_url: "https://github.com/ankitmeena8209-blip/new-being-frzi-",
    tags: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Supabase"],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "AI Creative Studio",
    description: "High-performance generative asset generator and smart prompt engineering workflow tool.",
    category: "AI/ML",
    image_url: "/images/hero-ankit.png",
    demo_url: "https://github.com/ankitmeena8209-blip",
    github_url: "https://github.com/ankitmeena8209-blip",
    tags: ["React", "Python", "OpenAI", "FastAPI"],
    featured: true,
    created_at: new Date().toISOString(),
  },
];

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
