import { useState, useEffect, useCallback } from 'react';
import { AudioTrackRelease } from '../types';

const MUSIC_VAULT_KEY = 'tears_music_distribution_vault_v1';

const INITIAL_RELEASES: AudioTrackRelease[] = [
  {
    id: 'trk-2026-001',
    title: 'Midnight on Woodward (Detroit Soul Edition)',
    artist: 'The Motown Rhythm Guild',
    featuredArtists: 'Detroit Horn Section',
    albumOrSingle: 'Single',
    genre: 'Detroit Soul & Motown',
    bpm: 104,
    musicalKey: 'E♭ Major',
    explicit: false,
    isrc: 'US-TEA-26-00101',
    upc: '859781290192',
    releaseDate: '2026-10-01',
    duration: '03:48',
    audioFileName: 'Midnight_On_Woodward_Master_24bit_48k.wav',
    artworkGradient: 'from-amber-600 via-red-700 to-purple-900',
    streamCount: 48920,
    tearRadioAirplayActive: true,
    dspDistributions: {
      spotify: 'Live & Streaming',
      appleMusic: 'Live & Streaming',
      amazonMusic: 'Live & Streaming',
      tidal: 'Live & Streaming',
      youtubeMusic: 'Live & Streaming'
    },
    royaltySplits: {
      songwriter: 50,
      producer: 30,
      vocalist: 20,
      publisher: 0
    },
    totalRoyaltiesEarned: 894.20
  },
  {
    id: 'trk-2026-002',
    title: 'Riverfront Sunrise Groove',
    artist: 'Jeanell Land & Detroit All-Stars',
    albumOrSingle: 'Single',
    genre: 'Smooth Jazz',
    bpm: 92,
    musicalKey: 'D Minor',
    explicit: false,
    isrc: 'US-TEA-26-00102',
    upc: '859781290193',
    releaseDate: '2026-10-08',
    duration: '04:15',
    audioFileName: 'Riverfront_Sunrise_Groove_Master.wav',
    artworkGradient: 'from-cyan-600 via-blue-800 to-indigo-950',
    streamCount: 31200,
    tearRadioAirplayActive: true,
    dspDistributions: {
      spotify: 'Live & Streaming',
      appleMusic: 'Live & Streaming',
      amazonMusic: 'Live & Streaming',
      tidal: 'Live & Streaming',
      youtubeMusic: 'Live & Streaming'
    },
    royaltySplits: {
      songwriter: 60,
      producer: 40,
      vocalist: 0,
      publisher: 0
    },
    totalRoyaltiesEarned: 561.60
  },
  {
    id: 'trk-2026-003',
    title: 'Sovereign Frequency (Highway 75 Night Ride)',
    artist: 'S.T.E.A.R.Safe Sound Lab',
    albumOrSingle: 'Single',
    genre: 'Urban R&B',
    bpm: 118,
    musicalKey: 'F# Minor',
    explicit: false,
    isrc: 'US-TEA-26-00103',
    upc: '859781290194',
    releaseDate: '2026-10-14',
    duration: '03:22',
    audioFileName: 'Sovereign_Frequency_I75_Master.wav',
    artworkGradient: 'from-purple-700 via-rose-800 to-black',
    streamCount: 19400,
    tearRadioAirplayActive: true,
    dspDistributions: {
      spotify: 'Delivered',
      appleMusic: 'Live & Streaming',
      amazonMusic: 'Delivered',
      tidal: 'Live & Streaming',
      youtubeMusic: 'Delivered'
    },
    royaltySplits: {
      songwriter: 50,
      producer: 50,
      vocalist: 0,
      publisher: 0
    },
    totalRoyaltiesEarned: 349.20
  }
];

export function useMusicDistributionStore() {
  const [releases, setReleases] = useState<AudioTrackRelease[]>(() => {
    try {
      const saved = localStorage.getItem(MUSIC_VAULT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RELEASES;
  });

  const [activeTrack, setActiveTrack] = useState<AudioTrackRelease | null>(releases[0] || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(MUSIC_VAULT_KEY, JSON.stringify(releases));
    } catch {}
  }, [releases]);

  const addTrackRelease = useCallback((track: Omit<AudioTrackRelease, 'id' | 'isrc' | 'upc' | 'streamCount' | 'dspDistributions' | 'totalRoyaltiesEarned'>) => {
    const randomSuffix = Math.floor(Math.random() * 90000 + 10000);
    const newIsrc = `US-TEA-26-${randomSuffix}`;
    const newUpc = `85978${Math.floor(Math.random() * 9000000 + 1000000)}`;

    const newRelease: AudioTrackRelease = {
      ...track,
      id: `trk-2026-${Date.now()}`,
      isrc: newIsrc,
      upc: newUpc,
      streamCount: 1,
      tearRadioAirplayActive: true,
      dspDistributions: {
        spotify: 'Delivered',
        appleMusic: 'Delivered',
        amazonMusic: 'Delivered',
        tidal: 'Delivered',
        youtubeMusic: 'Delivered'
      },
      totalRoyaltiesEarned: 0.00
    };

    setReleases(prev => [newRelease, ...prev]);
    setActiveTrack(newRelease);
    return newRelease;
  }, []);

  const toggleTearRadioAirplay = useCallback((id: string) => {
    setReleases(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, tearRadioAirplayActive: !r.tearRadioAirplayActive };
      }
      return r;
    }));
  }, []);

  const dispatchDspDelivery = useCallback((id: string, dsp: keyof AudioTrackRelease['dspDistributions']) => {
    setReleases(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          dspDistributions: {
            ...r.dspDistributions,
            [dsp]: 'Live & Streaming'
          }
        };
      }
      return r;
    }));
  }, []);

  const deleteRelease = useCallback((id: string) => {
    setReleases(prev => prev.filter(r => r.id !== id));
  }, []);

  const generateDdexXml = useCallback((track: AudioTrackRelease): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/43" MessageSchemaVersionId="ern/43">
  <MessageHeader>
    <MessageId>MSG-TEARS-${track.isrc}</MessageId>
    <MessageSender><PartyId>S.T.E.A.R.Safe Technologies Inc.</PartyId></MessageSender>
    <MessageRecipient><PartyId>Spotify / Apple Music Global Ingest</PartyId></MessageRecipient>
    <MessageCreatedDateTime>${new Date().toISOString()}</MessageCreatedDateTime>
  </MessageHeader>
  <ResourceList>
    <SoundRecording>
      <SoundRecordingType>MusicalWorkSoundRecording</SoundRecordingType>
      <SoundRecordingId><ISRC>${track.isrc}</ISRC></SoundRecordingId>
      <ReferenceTitle><TitleText>${track.title}</TitleText></ReferenceTitle>
      <Duration>PT${track.duration.replace(':', 'M')}S</Duration>
      <Genre><GenreText>${track.genre}</GenreText></Genre>
      <BPM>${track.bpm}</BPM>
      <Key>${track.musicalKey}</Key>
    </SoundRecording>
  </ResourceList>
  <ReleaseList>
    <Release>
      <ReleaseId><ICPN>${track.upc}</ICPN></ReleaseId>
      <ReferenceTitle><TitleText>${track.title}</TitleText></ReferenceTitle>
      <ReleaseResourceReferenceList>
        <ReleaseResourceReference>${track.isrc}</ReleaseResourceReference>
      </ReleaseResourceReferenceList>
      <PLine><Year>2026</Year><PLineText>℗ 2026 T.E.A.R.S. Channel Records / S.T.E.A.R.Safe</PLineText></PLine>
      <CLine><Year>2026</Year><CLineText>© 2026 Jeanell Land</CLineText></CLine>
      <OriginalReleaseDate>${track.releaseDate}</OriginalReleaseDate>
    </Release>
  </ReleaseList>
</ern:NewReleaseMessage>`;
  }, []);

  return {
    releases,
    activeTrack,
    setActiveTrack,
    isPlayingAudio,
    setIsPlayingAudio,
    addTrackRelease,
    toggleTearRadioAirplay,
    dispatchDspDelivery,
    deleteRelease,
    generateDdexXml
  };
}
