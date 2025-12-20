/**
 * Usage:
 *   1. Add your Spotify credentials to .env file
 *   2. Run: npm run fetch-episodes
 *      Or: npx tsx scripts/fetch-episodes.ts
 */

import fs from 'fs'; // File system
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv'; // Load .env

// Load environment variables from .env file
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//WCWS show ID
const SHOW_ID = '2r2drOqJuUMAY2ubsHS9E7';

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
  releaseDate: string;
  durationMs: number;
  spotifyUrl: string;
}

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing Spotify credentials!');
  console.error('Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your .env file.');
  console.error('\nSee .env.example for reference.');
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
    
    console.log(`Fetched ${episodes.length} episodes...`);
  }

  return episodes;
}

/**
 * Parse season and episode number from title
 * 
 * formats:
 *   "(S5-E10)" at end  → { season: 5, episode: 10 }
 *   "S2-EP9" at start  → { season: 2, episode: 9 }
 *   "#3 - Title"       → { season: 1, episode: 3 }  (Season 1 format)
 *   No index           → { season: null, episode: null }
 */
function parseSeasonEpisode(title: string): { season: number | null; episode: number | null } {
  // Pattern 1: (S5-E10) or (S5-EP10) - parentheses with dash
  const pattern1 = /\(S(\d+)-E(?:P)?(\d+)\)/i;
  const match1 = title.match(pattern1);
  if (match1) {
    return { season: parseInt(match1[1]), episode: parseInt(match1[2]) };
  }

  // Pattern 2: S2-EP9 or S2-E9 - no parentheses, dash separator
  const pattern2 = /S(\d+)-E(?:P)?(\d+)/i;
  const match2 = title.match(pattern2);
  if (match2) {
    return { season: parseInt(match2[1]), episode: parseInt(match2[2]) };
  }

  // Pattern 3: S5E10 or S5 E10 - no dash (fallback)
  const pattern3 = /S(\d+)\s*E(\d+)/i;
  const match3 = title.match(pattern3);
  if (match3) {
    return { season: parseInt(match3[1]), episode: parseInt(match3[2]) };
  }

  // Pattern 4: #3 - Title (Season 1 format)
  const pattern4 = /^#(\d+)\s*-/;
  const match4 = title.match(pattern4);
  if (match4) {
    return { season: 1, episode: parseInt(match4[1]) };
  }

  // No pattern found - that's okay for older episodes
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
    releaseDate: spotifyEpisode.release_date,
    durationMs: spotifyEpisode.duration_ms,
    spotifyUrl: spotifyEpisode.external_urls.spotify,
  };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('Fetching episodes from Spotify...\n');

  try {
    console.log('Getting access token...');
    const accessToken = await getAccessToken();
    console.log('Access token obtained\n');

    const spotifyEpisodes = await fetchAllEpisodes(accessToken);
    console.log(`\nTotal episodes fetched: ${spotifyEpisodes.length}\n`);

    const episodes = spotifyEpisodes.map(transformEpisode);

    // Load existing data to preserve manual entries (like school)
    const outputPath = path.join(__dirname, '../src/data/episodes.json');
    let existingEpisodes: Episode[] = [];
    
    try {
      const existingData = fs.readFileSync(outputPath, 'utf-8');
      existingEpisodes = JSON.parse(existingData);
      console.log(`Found existing data with ${existingEpisodes.length} episodes`);
    } catch {
      console.log('No existing data found, creating new file');
    }

    // Use fetched episodes directly (no manual fields to preserve)
    const mergedEpisodes = [...episodes];

    // Sort by release date (newest first)
    mergedEpisodes.sort((a, b) => {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

    // Ensure the data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(mergedEpisodes, null, 2));
    console.log(`\nSaved to: ${outputPath}`);

    // Summary
    const needsSeasonEpisode = mergedEpisodes.filter(e => e.season === null).length;
    
    console.log('\nSummary:');
    console.log(`   Total episodes: ${mergedEpisodes.length}`);
    console.log(`   Need season/episode parsing: ${needsSeasonEpisode}`);
    
    if (needsSeasonEpisode > 0) {
      console.log('Some episodes could not parse season/episode from title.');
      console.log('Check your title format and update parseSeasonEpisode() if needed.');
    }

  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();