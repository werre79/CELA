const sdk = require('node-appwrite');

// =======================================================
// CONFIGURATION
// Replace these with your actual Appwrite project details
// =======================================================
const endpoint = 'https://fra.cloud.appwrite.io/v1';
const projectId = '69df9a2200326ec63d6d';
const apiKey = process.env.APPWRITE_API_KEY || 'YOUR_API_KEY'; // DO NOT COMMIT ACTUAL API KEYS

// Initialize the Appwrite Client
const client = new sdk.Client();
client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

// Helper function to sleep (give attributes time to create)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function setupAppwrite() {
    console.log('🚀 Starting Appwrite Setup...');

    try {
        // 1. Create Database
        console.log('\n--- Creating Database ---');
        const dbId = sdk.ID.unique();
        const db = await databases.create(dbId, 'Cela Database');
        console.log(`✅ Database created! ID: ${db.$id}`);

        // 2. Create Storage Bucket
        console.log('\n--- Creating Storage Bucket ---');
        const bucketId = sdk.ID.unique();
        const bucket = await storage.createBucket(
            bucketId,
            'Cela Storage',
            [sdk.Permission.read(sdk.Role.any())], // Everyone can view
            false, // no file security
            true, // enable antimalware
            undefined, // max file size
            ['jpg', 'png', 'jpeg', 'webp', 'gif'] // allowed extensions
        );
        console.log(`✅ Bucket created! ID: ${bucket.$id}`);

        // 3. Create Collections
        console.log('\n--- Creating Collections ---');

        // PROJECTS
        const projectsCol = await databases.createCollection(db.$id, sdk.ID.unique(), 'Projects', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.users()),
            sdk.Permission.update(sdk.Role.users()),
            sdk.Permission.delete(sdk.Role.users()),
        ]);
        console.log(`✅ Projects Collection created! ID: ${projectsCol.$id}`);

        await databases.createStringAttribute(db.$id, projectsCol.$id, 'title', 255, true);
        await databases.createStringAttribute(db.$id, projectsCol.$id, 'slug', 255, true);
        await databases.createStringAttribute(db.$id, projectsCol.$id, 'desc', 1000, false);
        await databases.createStringAttribute(db.$id, projectsCol.$id, 'details', 100000, false);
        await databases.createStringAttribute(db.$id, projectsCol.$id, 'type', 255, false);
        await databases.createStringAttribute(db.$id, projectsCol.$id, 'image', 255, false);
        await databases.createStringAttribute(db.$id, projectsCol.$id, 'gallery', 255, false, undefined, true); // array
        await databases.createDatetimeAttribute(db.$id, projectsCol.$id, 'date', false);
        await databases.createDatetimeAttribute(db.$id, projectsCol.$id, 'createdAt', true);
        console.log('   Attributes created for Projects.');

        // NEWS
        const newsCol = await databases.createCollection(db.$id, sdk.ID.unique(), 'News', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.users()),
            sdk.Permission.update(sdk.Role.users()),
            sdk.Permission.delete(sdk.Role.users()),
        ]);
        console.log(`✅ News Collection created! ID: ${newsCol.$id}`);

        await databases.createStringAttribute(db.$id, newsCol.$id, 'title', 255, false);
        await databases.createStringAttribute(db.$id, newsCol.$id, 'desc', 5000, false);
        await databases.createDatetimeAttribute(db.$id, newsCol.$id, 'date', false);
        await databases.createStringAttribute(db.$id, newsCol.$id, 'image', 255, false);
        await databases.createDatetimeAttribute(db.$id, newsCol.$id, 'createdAt', true);
        console.log('   Attributes created for News.');

        // PUBLICATIONS
        const pubCol = await databases.createCollection(db.$id, sdk.ID.unique(), 'Publications', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.users()),
            sdk.Permission.update(sdk.Role.users()),
            sdk.Permission.delete(sdk.Role.users()),
        ]);
        console.log(`✅ Publications Collection created! ID: ${pubCol.$id}`);

        await databases.createStringAttribute(db.$id, pubCol.$id, 'title', 255, false);
        await databases.createStringAttribute(db.$id, pubCol.$id, 'category', 255, false);
        await databases.createStringAttribute(db.$id, pubCol.$id, 'desc', 2000, false);
        await databases.createStringAttribute(db.$id, pubCol.$id, 'link', 255, false);
        await databases.createDatetimeAttribute(db.$id, pubCol.$id, 'createdAt', true);
        console.log('   Attributes created for Publications.');

        // TEAM
        const teamCol = await databases.createCollection(db.$id, sdk.ID.unique(), 'Team', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.users()),
            sdk.Permission.update(sdk.Role.users()),
            sdk.Permission.delete(sdk.Role.users()),
        ]);
        console.log(`✅ Team Collection created! ID: ${teamCol.$id}`);

        await databases.createStringAttribute(db.$id, teamCol.$id, 'name', 255, false);
        await databases.createStringAttribute(db.$id, teamCol.$id, 'role', 255, false);
        await databases.createStringAttribute(db.$id, teamCol.$id, 'image', 255, false);
        await databases.createDatetimeAttribute(db.$id, teamCol.$id, 'createdAt', true);
        console.log('   Attributes created for Team.');

        console.log('\n=============================================');
        console.log('🎉 Appwrite Setup Complete! 🎉');
        console.log('=============================================');
        console.log('Please copy these IDs into your src/environments/environment.ts file:');
        console.log(`databaseId: "${db.$id}",`);
        console.log('collections: {');
        console.log(`  projects: "${projectsCol.$id}",`);
        console.log(`  news: "${newsCol.$id}",`);
        console.log(`  publications: "${pubCol.$id}",`);
        console.log(`  team: "${teamCol.$id}",`);
        console.log('},');
        console.log(`bucketId: "${bucket.$id}",`);
        console.log('=============================================');

    } catch (error) {
        console.error('❌ Error setting up Appwrite:', error);
    }
}

setupAppwrite();