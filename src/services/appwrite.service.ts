import { Injectable } from '@angular/core';
import { Client, Databases, Query, ID } from 'appwrite'; // <-- Перевірте, чи є тут 'ID'

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {
  private client = new Client();
  private databases: Databases;

  // --- ВАШІ ID ---
  private PROJECT_ID = '6963fcc6000b0653b9c1';
  private DB_ID = '6963fe89001222d6a894';
  
  // ID Колекцій
  private PROJECTS_COLLECTION = 'projects';
  private NEWS_COLLECTION = 'news';
  private PUBS_COLLECTION = 'publications';
  private REQUESTS_COLLECTION = 'requests'; // <-- Переконайтесь, що цей рядок є

  constructor() {
    this.client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(this.PROJECT_ID);

    this.databases = new Databases(this.client);
  }

  // --- МЕТОДИ ОТРИМАННЯ ДАНИХ ---

  async getProjects() {
    try {
      const response = await this.databases.listDocuments(
        this.DB_ID,
        this.PROJECTS_COLLECTION,
        [Query.orderDesc('$createdAt')]
      );
      return response.documents;
    } catch (error) {
      console.error('Appwrite Error (Projects):', error);
      return [];
    }
  }

  async getProjectById(documentId: string) {
    try {
      return await this.databases.getDocument(
        this.DB_ID,
        this.PROJECTS_COLLECTION,
        documentId
      );
    } catch (error) {
      console.error('Appwrite Error (Project Detail):', error);
      return null;
    }
  }

  async getNews() {
    try {
      const response = await this.databases.listDocuments(
        this.DB_ID,
        this.NEWS_COLLECTION,
        [Query.orderDesc('date')]
      );
      return response.documents;
    } catch (error) {
      console.error('Appwrite Error (News):', error);
      return [];
    }
  }

  async getPublications() {
    try {
      const response = await this.databases.listDocuments(
        this.DB_ID,
        this.PUBS_COLLECTION,
        [Query.orderDesc('$createdAt')]
      );
      return response.documents;
    } catch (error) {
      console.error('Appwrite Error (Publications):', error);
      return [];
    }
  }

  // --- ОСЬ ЦІЄЇ ФУНКЦІЇ ВАМ НЕ ВИСТАЧАЄ ---
  async sendRequest(data: { name: string, email: string, message: string }) {
    try {
      return await this.databases.createDocument(
        this.DB_ID,
        this.REQUESTS_COLLECTION,
        ID.unique(),
        data
      );
    } catch (error) {
      console.error('Помилка відправки форми:', error);
      throw error;
    }
  }
}