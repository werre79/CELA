export const environment = {
  production: false,
  appwrite: {
    endpoint: "YOUR_APPWRITE_ENDPOINT", // e.g. 'https://cloud.appwrite.io/v1'
    projectId: "YOUR_PROJECT_ID",
    databaseId: "YOUR_DATABASE_ID",
    collections: {
      projects: "YOUR_PROJECTS_COLLECTION_ID",
      news: "YOUR_NEWS_COLLECTION_ID",
      publications: "YOUR_PUBLICATIONS_COLLECTION_ID",
      team: "YOUR_TEAM_COLLECTION_ID",
    },
    bucketId: "YOUR_BUCKET_ID",
  }
};
