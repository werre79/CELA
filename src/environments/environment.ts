export const environment = {
  production: false,
  // Official public contact points (single source of truth)
  contactEmail: 'cepa.org@gmail.com',
  // TODO: replace with the real Google Form link before launch
  supportFormUrl: 'https://forms.gle/REPLACE_WITH_REAL_FORM',
  appwrite: {
    endpoint: "https://fra.cloud.appwrite.io/v1",
    projectId: "69df9a2200326ec63d6d",
    databaseId: "69e32f92002143d724ef",
    collections: {
      projects: "69e32f940018fbac9e90",
      news: "69e32f9600074e6fc73a",
      publications: "69e32f970013b5484863",
      team: "69e32f980019a6ee3c4b",
    },
    bucketId: "69e32f93002813ec0da7",
  }
};
