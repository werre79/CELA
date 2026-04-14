import { Injectable } from '@angular/core';
import { ConvexHttpClient } from 'convex/browser';
import { environment } from '../environments/environment';

const TOKEN_KEY = 'cela_auth_token';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private convex = new ConvexHttpClient(environment.convex.url);

  constructor() {
    // Restore session token on service init (page refresh)
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      this.convex.setAuth(stored);
    }
  }

  // ========================
  //     AUTH
  // ========================

  /**
   * Sign in with email and password via @convex-dev/auth.
   * The HTTP endpoint lives at <convexSiteUrl>/api/auth/signin
   * and returns a JWT token that we store in localStorage.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const res: any = await this.convex.action("auth:signIn" as any, {
        provider: "password",
        params: { email, password, flow: "signIn" },
      });
      if (res.tokens?.token) {
        localStorage.setItem(TOKEN_KEY, res.tokens.token);
        this.convex.setAuth(res.tokens.token);
      }
    } catch (e: any) {
      throw new Error("Invalid credentials. Try again.");
    }
  }

  async logout(): Promise<void> {
    try {
       await this.convex.action("auth:signOut" as any);
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    this.convex.clearAuth();
  }

  /**
   * Returns a stub user if token exists. A real implementation would hit a user query.
   */
  async getCurrentUser(): Promise<{ email: string } | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    return { email: 'admin' };
  }

  // ========================
  //     READ
  // ========================

  async getProjects(): Promise<any[]> {
    try {
      const docs = await this.convex.query('projects:get' as any);
      return docs.map((doc: any) => ({ $id: doc._id, ...doc }));
    } catch {
      return [];
    }
  }

  async getProjectById(id: string): Promise<any | null> {
    try {
      const doc = await this.convex.query('projects:getById' as any, { id });
      return doc ? { $id: doc._id, ...doc } : null;
    } catch {
      return null;
    }
  }

  async getProjectBySlug(slug: string): Promise<any | null> {
    try {
      const doc = await this.convex.query('projects:getBySlug' as any, { slug });
      return doc ? { $id: doc._id, ...doc } : null;
    } catch (error) {
      console.error('getProjectBySlug failed:', error);
      return null;
    }
  }

  async getNews(): Promise<any[]> {
    try {
      const docs = await this.convex.query('data:getNews' as any);
      return docs.map((doc: any) => ({ $id: doc._id, ...doc }));
    } catch {
      return [];
    }
  }

  async getPublications(): Promise<any[]> {
    try {
      const docs = await this.convex.query('data:getPublications' as any);
      return docs.map((doc: any) => ({ $id: doc._id, ...doc }));
    } catch {
      return [];
    }
  }

  async getTeam(): Promise<any[]> {
    try {
      const docs = await this.convex.query('data:getTeam' as any);
      return docs.map((doc: any) => ({ $id: doc._id, ...doc }));
    } catch {
      return [];
    }
  }

  // ========================
  //     WRITE (Admin panel)
  // ========================

  async uploadFile(file: File): Promise<string> {
    const postUrl = await this.convex.mutation('data:generateUploadUrl' as any);
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return await this.convex.query('data:getFileUrl' as any, { storageId });
  }

  async createProject(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    const id = await this.convex.mutation('projects:create' as any, data);
    return { $id: id, ...data };
  }

  async addTeamMember(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    const id = await this.convex.mutation('data:addTeamMember' as any, data);
    return { $id: id, ...data };
  }

  async deleteTeamMember(id: string): Promise<void> {
    await this.convex.mutation('data:deleteTeamMember' as any, { id });
  }

  async addNews(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    if (!data.date) data.date = data.createdAt;
    const id = await this.convex.mutation('data:addNews' as any, data);
    return { $id: id, ...data };
  }

  async addPublication(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    const id = await this.convex.mutation('data:addPublicationEx' as any, data);
    return { $id: id, ...data };
  }

  // ========================
  //     HELPERS
  // ========================

  static generateSlugFromTitle(title: string): string {
    if (!title) return '';
    const ukrMap: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e',
      'є': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y',
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
      'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya', ' ': '-'
    };
    return title.toLowerCase().split('').map(char => {
      if (char in ukrMap) return ukrMap[char];
      if (/[a-z0-9-]/.test(char)) return char;
      return '';
    }).join('').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
}
