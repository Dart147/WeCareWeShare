/**
 * Spotify Episode Fetcher
 * 
 * This script fetches all episodes from your Spotify podcast
 * and saves them to a JSON file.
 * 
 * Usage:
 *   1. Set environment variables SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
 *   2. Run: npx ts-node scripts/fetch-episodes.ts
 *      Or: npx tsx scripts/fetch-episodes.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Your podcast show ID (from the Spotify URL)
const SHOW_ID = '2r2drOqJuUMAY2ubsHS9E7';

// Spotify API credentials (set these as environment variables)
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Types
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  html_description: string;
  release_date: string;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyEpisodesResponse {
  items: SpotifyEpisode[];
  next: string | null;
  error?: {
    message: string;
  };
}

interface Episode {
  spotifyId: string;
  title: string;
  description: string;
  descriptionShort: string;
  season: number | null;
  episode: number | null;
  school: string | null;
  releaseDate: string;
  durationMs: number;
  spotifyUrl: string;
}

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing Spotify credentials!');
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
  console.error('\nExample:');
  console.error('  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy npx tsx scripts/fetch-episodes.ts');
  process.exit(1);
}

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data: SpotifyTokenResponse = await response.json();
  
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description || data.error}`);
  }
  
  return data.access_token;
}

/**
 * Fetch all episodes from the podcast
 */
async function fetchAllEpisodes(accessToken: string): Promise<SpotifyEpisode[]> {
  const episodes: SpotifyEpisode[] = [];
  let nextUrl: string | null = `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?limit=50&market=TW`;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: SpotifyEpisodesResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to fetch episodes: ${data.error?.message || 'Unknown error'}`);
    }

    episodes.push(...data.items);
    nextUrl = data.next;
    
    console.log(`📥 Fetched ${episodes.length} episodes...`);
  }

  return episodes;
}

/**
 * Parse season and episode number from title
 * Examples:
 *   "S5E10 - Little Nature Explorer" → { season: 5, episode: 10 }
 *   "Season 5 Episode 10: Title" → { season: 5, episode: 10 }
 */
function parseSeasonEpisode(title: string): { season: number | null; episode: number | null } {
  // Pattern 1: S5E10 or S5 E10
  const pattern1 = /S(\d+)\s*E(\d+)/i;
  const match1 = title.match(pattern1);
  if (match1) {
    return { season: parseInt(match1[1]), episode: parseInt(match1[2]) };
  }

  // Pattern 2: Season 5 Episode 10
  const pattern2 = /Season\s*(\d+)\s*Episode\s*(\d+)/i;
  const match2 = title.match(pattern2);
  if (match2) {
    return { season: parseInt(match2[1]), episode: parseInt(match2[2]) };
  }

  // Pattern 3: EP10 or Ep.10 (episode only, assume season 1)
  const pattern3 = /EP\.?\s*(\d+)/i;
  const match3 = title.match(pattern3);
  if (match3) {
    return { season: 1, episode: parseInt(match3[1]) };
  }

  // No pattern found
  return { season: null, episode: null };
}

/**
 * Transform Spotify episode data to our format
 */
function transformEpisode(spotifyEpisode: SpotifyEpisode): Episode {
  const { season, episode } = parseSeasonEpisode(spotifyEpisode.name);
  
  return {
    spotifyId: spotifyEpisode.id,
    title: spotifyEpisode.name,
    description: spotifyEpisode.description,
    descriptionShort: spotifyEpisode.description
      .replace(/<[^>]*>/g, '')
      .substring(0, 100) + '...',
    season,
    episode,
    school: null,
    releaseDate: spotifyEpisode.release_date,
    durationMs: spotifyEpisode.duration_ms,
    spotifyUrl: spotifyEpisode.external_urls.spotify,
  };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🎵 Fetching episodes from Spotify...\n');

  try {
    console.log('🔑 Getting access token...');
    const accessToken = await getAccessToken();
    console.log('✅ Access token obtained\n');

    const spotifyEpisodes = await fetchAllEpisodes(accessToken);
    console.log(`\n✅ Total episodes fetched: ${spotifyEpisodes.length}\n`);

    const episodes = spotifyEpisodes.map(transformEpisode);

    // Load existing data to preserve manual entries (like school)
    const outputPath = path.join(__dirname, '../src/data/episodes.json');
    let existingEpisodes: Episode[] = [];
    
    try {
      const existingData = fs.readFileSync(outputPath, 'utf-8');
      existingEpisodes = JSON.parse(existingData);
      console.log(`📂 Found existing data with ${existingEpisodes.length} episodes`);
    } catch {
      console.log('📂 No existing data found, creating new file');
    }

    // Merge: preserve manual data (school) from existing entries
    const mergedEpisodes = episodes.map(newEp => {
      const existing = existingEpisodes.find(e => e.spotifyId === newEp.spotifyId);
      if (existing) {
        return {
          ...newEp,
          school: existing.school,
        };
      }
      return newEp;
    });

    // Ensure the data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(mergedEpisodes, null, 2));
    console.log(`\n💾 Saved to: ${outputPath}`);

    // Summary
    const needsSchool = mergedEpisodes.filter(e => !e.school).length;
    const needsSeasonEpisode = mergedEpisodes.filter(e => e.season === null).length;
    
    console.log('\n📊 Summary:');
    console.log(`   Total episodes: ${mergedEpisodes.length}`);
    console.log(`   Need school info: ${needsSchool}`);
    console.log(`   Need season/episode parsing: ${needsSeasonEpisode}`);
    
    if (needsSchool > 0) {
      console.log('\n⚠️  Remember to manually add "school" for each episode!');
    }
    if (needsSeasonEpisode > 0) {
      console.log('⚠️  Some episodes could not parse season/episode from title.');
      console.log('   Check your title format and update parseSeasonEpisode() if needed.');
    }

  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
