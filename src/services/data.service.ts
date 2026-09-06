import { Injectable } from '@angular/core';
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import { environment } from '../environments/environment';
import { AppUser, NewsArticle, Project, Publication, TeamMember } from '../models';

/** Appwrite caps listDocuments at 100 documents per request. */
const MAX_PAGE_SIZE = 100;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private client = new Client();
  private account: Account;
  private databases: Databases;
  private storage: Storage;

  constructor() {
    this.client
      .setEndpoint(environment.appwrite.endpoint)
      .setProject(environment.appwrite.projectId);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // ========================
  //     AUTH
  // ========================

  async login(email: string, password: string): Promise<void> {
    try {
      await this.account.createEmailPasswordSession(email, password);
    } catch (e: any) {
      console.error('Appwrite login error:', e);
      // Re-throw the actual error so the component can handle it specifically
      throw e;
    }
  }

  async logout(): Promise<void> {
    try {
       await this.account.deleteSession('current');
    } catch (e) {
      console.error('Logout error', e);
    }
  }

  async getCurrentUser(): Promise<AppUser | null> {
    try {
      const user = await this.account.get();
      return { email: user.email };
    } catch {
      return null;
    }
  }

  // ========================
  //     READ
  // ========================

  /**
   * Fetch every document in a collection, transparently paging through
   * Appwrite's per-request limit (default 25, max 100).
   */
  private async listAllDocuments(collectionId: string, queries: string[] = []): Promise<any[]> {
    const documents: any[] = [];
    let total = 0;

    do {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        collectionId,
        [...queries, Query.limit(MAX_PAGE_SIZE), Query.offset(documents.length)]
      );
      documents.push(...res.documents);
      total = res.total;
    } while (documents.length < total);

    return documents;
  }

  async getProjects(): Promise<Project[]> {
    try {
      return await this.listAllDocuments(
        environment.appwrite.collections.projects,
        [Query.orderDesc('createdAt')]
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await this.databases.getDocument(
        environment.appwrite.databaseId,
        environment.appwrite.collections.projects,
        id
      ) as unknown as Project;
    } catch {
      return null;
    }
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        environment.appwrite.collections.projects,
        [Query.equal('slug', slug), Query.limit(1)]
      );
      return res.documents.length > 0 ? (res.documents[0] as unknown as Project) : null;
    } catch (error) {
      console.error('getProjectBySlug failed:', error);
      return null;
    }
  }

  /**
   * Resolve a route parameter that may be either a document ID or a slug.
   * Slug lookup is tried first (it never throws); document ID lookup is the
   * fallback for legacy links. Replaces the fragile "20 chars, no hyphen" heuristic.
   */
  async resolveProject(idOrSlug: string): Promise<Project | null> {
    const bySlug = await this.getProjectBySlug(idOrSlug);
    if (bySlug) return bySlug;
    return this.getProjectById(idOrSlug);
  }

  async getNews(): Promise<NewsArticle[]> {
    try {
      return await this.listAllDocuments(
        environment.appwrite.collections.news,
        [Query.orderDesc('date')]
      );
    } catch {
      return [];
    }
  }

  async getNewsById(id: string): Promise<NewsArticle | null> {
    try {
      return await this.databases.getDocument(
        environment.appwrite.databaseId,
        environment.appwrite.collections.news,
        id
      ) as unknown as NewsArticle;
    } catch {
      return null;
    }
  }

  async getPublications(): Promise<Publication[]> {
    try {
      return await this.listAllDocuments(
        environment.appwrite.collections.publications,
        [Query.orderDesc('createdAt')]
      );
    } catch {
      return [];
    }
  }

  async getPublicationById(id: string): Promise<Publication | null> {
    try {
      return await this.databases.getDocument(
        environment.appwrite.databaseId,
        environment.appwrite.collections.publications,
        id
      ) as unknown as Publication;
    } catch {
      return null;
    }
  }

  async getTeam(): Promise<TeamMember[]> {
    try {
      return await this.listAllDocuments(
        environment.appwrite.collections.team,
        [Query.orderDesc('createdAt')]
      );
    } catch {
      return [];
    }
  }

  // ========================
  //     WRITE (Admin panel)
  // ========================

  async uploadFile(file: File): Promise<string> {
    const res = await this.storage.createFile(
      environment.appwrite.bucketId,
      ID.unique(),
      file
    );
    // Construct the file view URL
    const fileUrl = this.storage.getFileView(
      environment.appwrite.bucketId,
      res.$id
    );
    return fileUrl.href;
  }

  async createProject(data: any): Promise<Project> {
    data.createdAt = new Date().toISOString();
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.projects,
      ID.unique(),
      data
    ) as unknown as Project;
  }

  async addTeamMember(data: any): Promise<TeamMember> {
    data.createdAt = new Date().toISOString();
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.team,
      ID.unique(),
      data
    ) as unknown as TeamMember;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await this.databases.deleteDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.team,
      id
    );
  }

  async addNews(data: any): Promise<NewsArticle> {
    data.createdAt = new Date().toISOString();
    if (!data.date) data.date = data.createdAt;
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.news,
      ID.unique(),
      data
    ) as unknown as NewsArticle;
  }

  async addPublication(data: any): Promise<Publication> {
    data.createdAt = new Date().toISOString();
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.publications,
      ID.unique(),
      data
    ) as unknown as Publication;
  }

  async updateProject(id: string, data: any): Promise<Project> {
    return await this.databases.updateDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.projects,
      id,
      data
    ) as unknown as Project;
  }

  async updateNews(id: string, data: any): Promise<NewsArticle> {
    return await this.databases.updateDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.news,
      id,
      data
    ) as unknown as NewsArticle;
  }

  async updatePublication(id: string, data: any): Promise<Publication> {
    return await this.databases.updateDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.publications,
      id,
      data
    ) as unknown as Publication;
  }

  async updateTeamMember(id: string, data: any): Promise<TeamMember> {
    return await this.databases.updateDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.team,
      id,
      data
    ) as unknown as TeamMember;
  }

  async deleteProject(id: string): Promise<void> {
    await this.databases.deleteDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.projects,
      id
    );
  }

  async deleteNews(id: string): Promise<void> {
    await this.databases.deleteDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.news,
      id
    );
  }

  async deletePublication(id: string): Promise<void> {
    await this.databases.deleteDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.publications,
      id
    );
  }

  // ========================
  //     HELPERS
  // ========================

  /**
   * Best-effort deletion of a storage file referenced by its public view URL.
   * Used to avoid orphaned files when images are replaced/removed or when a
   * document creation fails after its files were already uploaded.
   */
  async deleteStorageFile(fileUrl: string): Promise<void> {
    const fileId = this.extractFileIdFromUrl(fileUrl);
    if (!fileId) return;
    try {
      await this.storage.deleteFile(environment.appwrite.bucketId, fileId);
    } catch (e) {
      // Non-fatal: the document operation succeeded; log for follow-up.
      console.warn('Could not delete storage file:', fileId, e);
    }
  }

  private extractFileIdFromUrl(url: string): string | null {
    const match = url.match(/\/files\/([^/]+)\/(?:view|download)/);
    return match ? match[1] : null;
  }

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
