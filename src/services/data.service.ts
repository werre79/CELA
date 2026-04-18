import { Injectable } from '@angular/core';
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import { environment } from '../environments/environment';

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

  async getCurrentUser(): Promise<{ email: string } | null> {
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

  async getProjects(): Promise<any[]> {
    try {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        environment.appwrite.collections.projects,
        [Query.orderDesc('createdAt')]
      );
      return res.documents;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getProjectById(id: string): Promise<any | null> {
    try {
      return await this.databases.getDocument(
        environment.appwrite.databaseId,
        environment.appwrite.collections.projects,
        id
      );
    } catch {
      return null;
    }
  }

  async getProjectBySlug(slug: string): Promise<any | null> {
    try {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        environment.appwrite.collections.projects,
        [Query.equal('slug', slug), Query.limit(1)]
      );
      return res.documents.length > 0 ? res.documents[0] : null;
    } catch (error) {
      console.error('getProjectBySlug failed:', error);
      return null;
    }
  }

  async getNews(): Promise<any[]> {
    try {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        environment.appwrite.collections.news,
        [Query.orderDesc('date')]
      );
      return res.documents;
    } catch {
      return [];
    }
  }

  async getNewsById(id: string): Promise<any | null> {
    try {
      return await this.databases.getDocument(
        environment.appwrite.databaseId,
        environment.appwrite.collections.news,
        id
      );
    } catch {
      return null;
    }
  }

  async getPublications(): Promise<any[]> {
    try {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        environment.appwrite.collections.publications,
        [Query.orderDesc('createdAt')]
      );
      return res.documents;
    } catch {
      return [];
    }
  }

  async getPublicationById(id: string): Promise<any | null> {
    try {
      return await this.databases.getDocument(
        environment.appwrite.databaseId,
        environment.appwrite.collections.publications,
        id
      );
    } catch {
      return null;
    }
  }

  async getTeam(): Promise<any[]> {
    try {
      const res = await this.databases.listDocuments(
        environment.appwrite.databaseId,
        environment.appwrite.collections.team,
        [Query.orderDesc('createdAt')]
      );
      return res.documents;
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

  async createProject(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.projects,
      ID.unique(),
      data
    );
  }

  async addTeamMember(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.team,
      ID.unique(),
      data
    );
  }

  async deleteTeamMember(id: string): Promise<void> {
    await this.databases.deleteDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.team,
      id
    );
  }

  async addNews(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    if (!data.date) data.date = data.createdAt;
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.news,
      ID.unique(),
      data
    );
  }

  async addPublication(data: any): Promise<any> {
    data.createdAt = new Date().toISOString();
    return await this.databases.createDocument(
      environment.appwrite.databaseId,
      environment.appwrite.collections.publications,
      ID.unique(),
      data
    );
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
