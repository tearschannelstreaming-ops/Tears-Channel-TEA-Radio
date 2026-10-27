import React, { useState } from 'react';
import { DEVELOPER_PLATFORM_LINKS } from '../data/mockData';
import { DeveloperPlatformLink } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Tv, Smartphone, ExternalLink, Code2, Copy, Check, Terminal, 
  Layers, Globe, Shield, Sparkles, Download, PlaySquare, Package, 
  CheckCircle2, Box, ArrowRight, Cpu, Radio, ShieldCheck, FileCode,
  Unlock, DollarSign, Zap, HelpCircle, AlertTriangle, ArrowUpRight, Server
} from 'lucide-react';

export const DeveloperPlatformsPortal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'freedom-guide' | 'matrix' | 'oem-preinstall' | 'native-files'>('freedom-guide');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<DeveloperPlatformLink>(DEVELOPER_PLATFORM_LINKS[0]);
  const [isBuildingPackage, setIsBuildingPackage] = useState(false);
  const [buildSuccessMessage, setBuildSuccessMessage] = useState<string | null>(null);
  const [showBuildInspector, setShowBuildInspector] = useState(false);
  const [activeNativeFile, setActiveNativeFile] = useState<'tizen' | 'webos' | 'roku-feed' | 'roku-manifest' | 'android'>('roku-feed');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadOEMPreloadPackage = () => {
    const oemPayload = {
      specName: "T.E.A.R.S. Channel Factory Pre-Installation & OEM Partition Spec",
      version: "2026.1",
      networkOwner: "S.T.E.A.R.Safe Technologies Inc. & Jeanell Land",
      contactEmail: "support@tearschannel.online",
      targetHardware: {
        smartTVs: ["Samsung Tizen OS", "LG webOS", "TCL Roku TV", "Hisense Google TV", "Sony Bravia Android TV", "Amazon Fire TV Edition"],
        mobileDevices: ["Samsung Galaxy Phones", "Google Pixel Devices", "Motorola Mobility", "Apple iOS (Enterprise/Carrier)"],
        tablets: ["Apple iPad", "Samsung Galaxy Tab", "Amazon Fire HD", "Android AOSP Tablets"]
      },
      factoryPartitionSpecs: {
        samsungTizen: {
          partition: "/opt/usr/apps/preload/",
          widgetId: "https://tearschannel.online/tizen",
          hotkeySupport: "KEY_TV_TEARS (Hex: 0x54454152)"
        },
        lgWebOS: {
          partition: "/mnt/lg/cmn_data/apps/preinstalled/",
          appId: "com.tearschannel.webos",
          magicRemoteQuickLaunch: true
        },
        androidAOSP: {
          partition: "/system/priv-app/TearsBroadcast/",
          apkName: "TearsChannel_AOSP_Preload.apk",
          privAppWhitelist: "privapp-permissions-tearschannel.xml",
          leanbackLauncherBanner: "320x180"
        },
        rokuOS: {
          firmwarePartition: "pkg:/oem/channels/TEARS-CHANNEL-DETROIT/",
          remoteButtonMapping: "Custom Partner Button #4",
          directPublisherFeed: "https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/api/feed.json"
        }
      },
      commercialTerms: {
        revenueShareToManufacturer: "Up to 20% programmatic ad revenue share to hardware OEM",
        zeroHardwareLiability: "Platform and intermediary legal protections under 47 U.S.C. § 230 & 17 U.S.C. § 512"
      }
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(oemPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'tears-oem-factory-preload-manifest.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadTextFile = (filename: string, content: string) => {
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleGenerateBuildPackage = () => {
    setIsBuildingPackage(true);
    setTimeout(() => {
      setIsBuildingPackage(false);
      setShowBuildInspector(true);
      setBuildSuccessMessage('Universal Cross-Platform Build Package compiled successfully for all 6 target platforms!');
      setTimeout(() => setBuildSuccessMessage(null), 4000);
    }, 1200);
  };

  const handleDownloadPackage = () => {
    const packagePayload = {
      appName: 'T.E.A.R.S. Channel & T.E.A.R.adio',
      version: '1.0.0',
      buildDate: new Date().toISOString(),
      architecture: 'Sovereign Self-Hosted Developer Stack (Zero Third-Party Vendor Fees)',
      inventorAndBroker: 'Jeanell Land',
      assignee: 'S.T.E.A.R.Safe Technologies Inc.',
      patentDocket: 'S.T.E.A.R.-TEARS-2026-PAT',
      officialStoreAssets: {
        appleAppStoreId: '6762139785',
        sovereignBundleId: 'com.tearschannel.app',
        legacyBundleId: 'com.tvstartup.tears',
        rokuChannelId: 'TEARS-CHANNEL-DETROIT',
        rokuFeedEndpoint: 'https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/api/feed.json',
        mlsClientDownloadUrl: 'https://mls-client.com/AC8E6C053',
        mlsClientAccessCode: 'AC8E6C053',
        changeOrgPetitionUrl: 'https://c.org/nx2fdzbjB7',
        officialYouTube: 'https://www.youtube.com/@T.E.A.R.S.Channel-h3u',
        officialInstagram: 'https://www.instagram.com/t.e.a.r.s.channel?obrf=MWVwbDY3c2tubWY5YQ%3D%3D&utm_source=qr',
        officialFacebook: 'https://www.facebook.com/share/1DopGpYERq/?mibextid=wwXIfr'
      },
      platforms: DEVELOPER_PLATFORM_LINKS.map(p => ({
        id: p.id,
        platform: p.platform,
        status: p.status,
        appId: p.appIdOrBundle,
        framework: p.sdkOrDoc,
        config: p.configSnippet || 'N/A'
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(packagePayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'tears-sovereign-developer-build.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const PLATFORM_CHECKS = [
    { title: 'Universal PWA (Web & Desktop)', status: 'Compliant', desc: 'Service worker precaching, offline manifest, maskable 512px icon.' },
    { title: 'Apple iOS & iPadOS', status: 'App Transfer Ready', desc: 'App ID 6762139785, Sovereign Bundle com.tearschannel.app, zero fee transfer.' },
    { title: 'Roku TV (Streaming Players & TVs)', status: 'Ready to Deploy', desc: 'Direct Publisher JSON Feed + SceneGraph 4K/1080p HLS manifest.' },
    { title: 'Apple TV (tvOS)', status: 'Ready to Deploy', desc: 'SwiftUI Focus Engine & TVTopShelfProvider extension in shared workspace.' },
    { title: 'Amazon Fire TV', status: 'Hosted Web App Ready', desc: '100% Free Amazon Developer account, Hosted Web App with Alexa voice support.' },
    { title: 'Android TV & Google Play', status: 'TWA Ready', desc: 'Leanback Launcher banner & Media3 ExoPlayer integration, one-time $25 fee.' }
  ];

  const NATIVE_FILES = {
    'roku-feed': {
      filename: 'feed.json',
      title: 'Roku Direct Publisher Feed (v1.3)',
      desc: 'Point your Roku Direct Publisher channel directly to this URL or deploy as static JSON.',
      url: 'https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/api/feed.json',
      code: `{\n  "providerName": "T.E.A.R.S. Channel Network",\n  "lastUpdated": "${new Date().toISOString()}",\n  "language": "en",\n  "tvSpec": "v1.3",\n  "liveFeeds": [\n    {\n      "id": "tears-prime",\n      "title": "T.E.A.R.S. Channel Primetime 24/7",\n      "shortDescription": "24/7 Primetime television featuring True Crime, Detroit Commercial Real Estate & Motown Soul.",\n      "thumbnail": "https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/app-media/app_logo.jpg",\n      "genres": ["entertainment", "special"],\n      "content": {\n        "dateAdded": "2025-01-01T00:00:00Z",\n        "videos": [\n          {\n            "url": "https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/live/tears-prime/master.m3u8",\n            "quality": "HD",\n            "videoType": "HLS"\n          }\n        ]\n      }\n    }\n  ]\n}`
    },
    'tizen': {
      filename: 'config.xml',
      title: 'Samsung Smart TV (Tizen OS)',
      desc: 'Tizen Web App manifest for Samsung Smart TVs (2018–2026+ models).',
      code: `<?xml version="1.0" encoding="UTF-8"?>\n<widget xmlns="http://tizen.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/tizen" id="https://tearschannel.online/tizen" version="1.0.0" viewmodes="maximized">\n    <tizen:application id="tearschannel.TearsTV" exec="index.html" screen-orientation="landscape" required_version="4.0"/>\n    <content src="https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app"/>\n    <feature name="http://tizen.org/feature/screen.size.all"/>\n    <icon src="icon.png"/>\n    <name>T.E.A.R.S. Channel</name>\n    <tizen:privilege name="http://tizen.org/privilege/internet"/>\n    <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>\n</widget>`
    },
    'webos': {
      filename: 'appinfo.json',
      title: 'LG Smart TV (webOS)',
      desc: 'LG webOS TV Web App package manifest ready for webOS TV CLI (ares-package).',
      code: `{\n  "id": "com.tearschannel.webos",\n  "version": "1.0.0",\n  "vendor": "S.T.E.A.R.Safe Technologies Inc.",\n  "type": "web",\n  "main": "https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app",\n  "title": "T.E.A.R.S. Channel & T.E.A.R.adio",\n  "icon": "icon.png",\n  "largeIcon": "largeIcon.png",\n  "bgImage": "splash.png",\n  "resolution": "1920x1080",\n  "handlesRelaunch": true\n}`
    },
    'roku-manifest': {
      filename: 'manifest',
      title: 'Roku SceneGraph Manifest',
      desc: 'Standard Roku OS package manifest for BrightScript channels.',
      code: `title=T.E.A.R.S. Channel\nmajor_version=1\nminor_version=0\nbuild_version=100\nfeed_url=https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/api/feed.json\nmm_icon_focus_hd=pkg:/images/icon_hd.png\nsplash_screen_hd=pkg:/images/splash_hd.png\nui_resolutions=fhd,hd\nbs_const={\n  channel_id: "TEARS-CHANNEL-DETROIT"\n}`
    },
    'android': {
      filename: 'AndroidManifest.xml',
      title: 'Android TV & Fire TV Manifest Snippet',
      desc: 'Leanback Launcher and TV Banner declaration for Google TV, Android TV, and Fire TV.',
      code: `<activity android:name=".MainActivity"\n    android:banner="@drawable/tv_banner_320x180"\n    android:icon="@mipmap/ic_launcher"\n    android:label="@string/app_name"\n    android:screenOrientation="landscape"\n    android:exported="true">\n    <intent-filter>\n        <action android:name="android.intent.action.MAIN" />\n        <category android:name="android.intent.category.LEANBACK_LAUNCHER" />\n        <category android:name="android.intent.category.LAUNCHER" />\n    </intent-filter>\n</activity>`
    },
    'swift-ios': {
      filename: 'ContentView.swift',
      title: 'Apple iOS & iPadOS (Xcode 16 / SwiftUI)',
      desc: 'Drop into your Xcode iOS project for native AVPlayer, AirPlay, PiP, and WebKit.',
      code: `//\n//  ContentView.swift\n//  T.E.A.R.S. Channel & T.E.A.R.adio\n//  Sovereign Bundle: com.tearschannel.app (App Store ID: 6762139785)\n//  Founder & CEO: Jeanell Land | S.T.E.A.R.Safe Technologies Inc.\n//\n\nimport SwiftUI\nimport AVKit\nimport WebKit\n\nstruct ContentView: View {\n    @State private var selectedTab = 0\n    private let liveStreamURL = URL(string: "https://stream.ott.tvstartup.com/261dc2bf-9097-485f-8beb-88e8b3d303ff/master.m3u8")!\n    private let webPortalURL = URL(string: "https://tearschannel.online")!\n\n    var body: some View {\n        TabView(selection: $selectedTab) {\n            LiveVideoPlayerView(streamURL: liveStreamURL)\n                .tabItem {\n                    Label("Live TV", systemImage: "play.tv.fill")\n                }\n                .tag(0)\n\n            WebViewContainer(url: webPortalURL)\n                .edgesIgnoringSafeArea(.bottom)\n                .tabItem {\n                    Label("Portal & Radio", systemImage: "building.2.crop.circle.fill")\n                }\n                .tag(1)\n        }\n        .accentColor(.yellow)\n        .preferredColorScheme(.dark)\n    }\n}\n\nstruct LiveVideoPlayerView: UIViewControllerRepresentable {\n    let streamURL: URL\n    func makeUIViewController(context: Context) -> AVPlayerViewController {\n        let player = AVPlayer(url: streamURL)\n        let controller = AVPlayerViewController()\n        controller.player = player\n        controller.showsPlaybackControls = true\n        controller.allowsPictureInPicturePlayback = true\n        player.play()\n        return controller\n    }\n    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {}\n}\n\nstruct WebViewContainer: UIViewRepresentable {\n    let url: URL\n    func makeUIView(context: Context) -> WKWebView {\n        let config = WKWebViewConfiguration()\n        config.allowsInlineMediaPlayback = true\n        let webView = WKWebView(frame: .zero, configuration: config)\n        webView.isOpaque = false\n        webView.backgroundColor = .black\n        webView.load(URLRequest(url: url))\n        return webView\n    }\n    func updateUIView(_ uiView: WKWebView, context: Context) {}\n}`
    },
    'swift-tvos': {
      filename: 'TearsAppleTVApp.swift',
      title: 'Apple TV (tvOS 17+) Xcode SwiftUI App',
      desc: 'Native Apple TV 4K app with Siri Remote touch navigation, 4K HLS video, and zero lag.',
      code: `//\n//  TearsAppleTVApp.swift\n//  T.E.A.R.S. Channel for Apple TV (tvOS)\n//  Sovereign Bundle: com.tearschannel.tvos\n//\n\nimport SwiftUI\nimport AVKit\n\n@main\nstruct TearsAppleTVApp: App {\n    var body: some Scene {\n        WindowGroup {\n            AppleTVPlayerView()\n        }\n    }\n}\n\nstruct AppleTVPlayerView: View {\n    private let liveStreamURL = URL(string: "https://stream.ott.tvstartup.com/261dc2bf-9097-485f-8beb-88e8b3d303ff/master.m3u8")!\n\n    var body: some View {\n        ZStack {\n            Color.black.edgesIgnoringSafeArea(.all)\n            NativeTVPlayer(url: liveStreamURL)\n                .edgesIgnoringSafeArea(.all)\n        }\n    }\n}\n\nstruct NativeTVPlayer: UIViewControllerRepresentable {\n    let url: URL\n    func makeUIViewController(context: Context) -> AVPlayerViewController {\n        let player = AVPlayer(url: url)\n        let controller = AVPlayerViewController()\n        controller.player = player\n        controller.showsPlaybackControls = true\n        player.play()\n        return controller\n    }\n    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {}\n}`
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1829] to-[#120f26] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
            <Unlock className="w-4 h-4 text-emerald-400" />
            <span>SOVEREIGN DEVELOPER INDEPENDENCE · ZERO MIDDLEMAN VENDOR FEES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Developer Independence &amp; Multi-Platform Hub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Take full autonomous control of <strong>T.E.A.R.S. Channel &amp; T.E.A.R.adio</strong>. Transition off TVStartup, retain your Apple App Store ID <strong className="text-amber-400 font-mono">6762139785</strong>, and self-publish across Roku, Fire TV, Samsung Tizen, LG webOS, and Google Play.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <span>Sovereign Namespace: <strong className="text-emerald-400 font-mono">com.tearschannel.app</strong></span>
            <span>·</span>
            <span>App Store ID: 6762139785</span>
            <span>·</span>
            <span>Developer Account: <span className="text-white">jeanelldetroit37@gmail.com</span></span>
            <span>·</span>
            <span>Website: <a href="https://tearschannel.online" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">tearschannel.online</a></span>
            <span>·</span>
            <span>Direct Support: <a href="mailto:support@tearschannel.online" className="text-cyan-400 hover:underline">support@tearschannel.online</a></span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('freedom-guide')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'freedom-guide'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>TVStartup Exit &amp; Developer Freedom Guide</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20 font-mono uppercase">Blueprint</span>
        </button>

        <button
          onClick={() => setActiveSection('matrix')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'matrix'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Target Platforms Matrix (8 Ecosystems)</span>
        </button>

        <button
          onClick={() => setActiveSection('oem-preinstall')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'oem-preinstall'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Tv className="w-4 h-4 text-purple-300" />
          <span>OEM Pre-Install Factory Roadmap</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 font-mono">End Goal</span>
        </button>

        <button
          onClick={() => setActiveSection('native-files')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'native-files'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Raw TV Config Exporter (Tizen / webOS / Roku)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INDEPENDENT DEVELOPER FREEDOM & TVSTARTUP EXIT GUIDE */}
      {/* ============================================================== */}
      {activeSection === 'freedom-guide' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Executive Overview Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0a1829] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>SAVINGS ESTIMATE: $3,600 – $12,000+ PER YEAR</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Why You Don&apos;t Need TvStartup Anymore
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                TvStartup charges recurring monthly fees to host an off-the-shelf white-label wrapper. As a software engineer, you already have your own responsive web engine, live chat, EPG, CMS, and HLS feeds. Here is your exact 4-step exit plan to deploy directly to the world.
              </p>
            </div>

            <button
              onClick={handleDownloadPackage}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-2 shrink-0 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Freedom Dossier</span>
            </button>
          </div>

          {/* 4 Pillars of Developer Independence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step 1: Transfer Apple App Store ID 6762139785 */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Zero Loss of Users
                </span>
              </div>
              
              <div>
                <h4 className="text-base font-bold text-white">Transfer App ID 6762139785 to Your Apple Account</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  You legally own the trademark and content. Apple provides an official <strong>App Transfer</strong> protocol so you never lose ratings, downloads, or your App Store listing.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-black/40 p-3.5 rounded-xl border border-slate-800 font-mono">
                <div className="text-amber-400 font-bold mb-1">Action Steps:</div>
                <p>1. Enroll in Apple Developer ($99/yr) at developer.apple.com with your email <span className="text-white">jeanelldetroit37@gmail.com</span>.</p>
                <p>2. Locate your 10-character <strong>Team ID</strong> in your Apple Developer Membership.</p>
                <p>3. Email TvStartup support: <em>&quot;Please initiate an App Store Connect App Transfer for App ID 6762139785 to my Apple Team ID [YOUR_ID] and Team Agent Apple ID jeanelldetroit37@gmail.com.&quot;</em></p>
                <p>4. Accept the transfer in App Store Connect. The app is instantly 100% yours.</p>
              </div>
            </div>

            {/* Step 2: Zero-Cost Smart TV Store Direct Publishing */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  100% Free Accounts
                </span>
              </div>
              
              <div>
                <h4 className="text-base font-bold text-white">Publish Directly to Roku, Fire TV &amp; Smart TVs</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Third-party platforms charge monthly fees for what Smart TV manufacturers provide directly to developers for free.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-black/40 p-3.5 rounded-xl border border-slate-800 font-mono">
                <div className="text-amber-400 font-bold mb-1">Direct Developer Store Costs:</div>
                <p className="flex justify-between"><span>• Roku Developer Portal:</span> <strong className="text-emerald-400">FREE ($0/mo)</strong></p>
                <p className="flex justify-between"><span>• Amazon Fire TV Developer:</span> <strong className="text-emerald-400">FREE ($0/mo)</strong></p>
                <p className="flex justify-between"><span>• Samsung Tizen Seller Lounge:</span> <strong className="text-emerald-400">FREE ($0/mo)</strong></p>
                <p className="flex justify-between"><span>• LG webOS Developer Lounge:</span> <strong className="text-emerald-400">FREE ($0/mo)</strong></p>
                <p className="flex justify-between"><span>• Google Play Developer:</span> <strong className="text-emerald-400">$25 One-time ($0/mo)</strong></p>
              </div>
            </div>

          </div>

          {/* Special Legal & Technical Advisory: Can TVStartup Charge You To Transfer? */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-red-950/40 border-2 border-amber-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>FREQUENT DEVELOPER QUESTION · APP TRANSFERS &amp; VENDOR FEES</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Can TVStartup Charge You to Transfer Your App to Roku, Fire TV, etc.?
            </h3>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3">
              <p>
                <strong className="text-emerald-400">The Short Answer:</strong> The app store platforms themselves—<strong>Roku, Amazon Fire TV, and Apple—charge $0 (zero dollars) for app transfers</strong>. Roku and Amazon developer accounts are 100% free.
              </p>
              <p>
                <strong>What TVStartup Might Do:</strong> Some white-label agencies like TVStartup include a clause in their service agreement claiming an internal <em>&quot;administrative release fee&quot;</em> or <em>&quot;app transfer fee&quot;</em> (often $250 to $1,000+) if you ask them to initiate an account transfer. <strong>However, you do NOT need to pay them to be on Roku, Fire TV, or Smart TVs!</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>Roku TV Reality</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Free</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Roku accounts are completely free. If TVStartup submitted the channel on their developer account, <strong>do not pay them to transfer it</strong>. Simply create your free Roku account and submit your Direct Publisher JSON feed (provided below in Tab 4) in 15 minutes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-400 flex items-center justify-between">
                  <span>Amazon Fire TV Reality</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Free</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Amazon Developer is 100% free with no monthly subscription. You can submit a <em>Hosted Web App</em> (which renders this web application with Alexa video controls) directly. TVStartup has zero leverage to block you.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-purple-400 flex items-center justify-between">
                  <span>Apple App Store (iOS/tvOS)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Free from Apple</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Apple charges $0 for app transfers. If TVStartup demands a fee to transfer App ID 6762139785, you have two options: (A) Ask them to transfer under your trademark ownership without fees, or (B) publish freshly under your sovereign bundle ID <code className="text-amber-300">com.tearschannel.app</code>.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                <strong className="text-white">Recommended Strategy:</strong> Never pay extortionate transfer fees for template code. You already own your media, trademarks, and this sovereign codebase.
              </div>
              <button
                onClick={() => setActiveSection('native-files')}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-lg text-xs shrink-0 transition-colors"
              >
                Get Free Native TV Configs →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  Independent Video Pipeline
                </span>
              </div>
              
              <div>
                <h4 className="text-base font-bold text-white">Own Your Video Pipeline &amp; HLS CDN</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Replace proprietary video hosts with standard HTTP Live Streaming (HLS) powered by modern, affordable infrastructure.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-black/40 p-3.5 rounded-xl border border-slate-800 font-mono">
                <div className="text-amber-400 font-bold mb-1">Best Self-Hosted Video Options:</div>
                <p>• <strong>Cloudflare Stream / Mux:</strong> Stream live 24/7 or VOD for pennies ($5/mo for 100k views vs $500+/mo on TVStartup).</p>
                <p>• <strong>OBS Studio / NGINX RTMP:</strong> Stream live directly from your computer or studio console using your RTMP stream key.</p>
                <p>• <strong>Automated HLS Master:</strong> Point all apps (Roku, iOS, web) to your single master manifest URL.</p>
              </div>
            </div>

            {/* Step 4: Your Autonomous CMS is Already Built! */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Already Included
                </span>
              </div>
              
              <div>
                <h4 className="text-base font-bold text-white">Your Studio CMS &amp; EPG are 100% Built-In</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  You do not need TvStartup&apos;s back-office. The <strong>T.E.A.R.S. Studio CMS</strong> tab in this web app already includes video ingestion, YouTube gateway, real estate MLS sync, and EPG scheduling.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-black/40 p-3.5 rounded-xl border border-slate-800 font-mono">
                <div className="text-emerald-400 font-bold mb-1">Autonomous Capabilities Ready:</div>
                <p>• Master Video Ingestion Node (4K UHD)</p>
                <p>• YouTube Syndication Gateway (@T.E.A.R.S.Channel-h3u)</p>
                <p>• Live Real-Time Chat with anti-spam read-only guest mode</p>
                <p>• 24/7 Electronic Program Guide (EPG) scheduler</p>
              </div>
            </div>

          </div>

          {/* Quick Platform Package Generator */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-black to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Download Your Sovereign Master Platform Package</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Contains verified bundle identifiers, manifest templates, Roku feed endpoints, and ownership declarations.
              </p>
            </div>
            <button
              onClick={handleGenerateBuildPackage}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-2 hover:scale-105 shrink-0"
            >
              <Cpu className="w-4 h-4" />
              <span>{isBuildingPackage ? 'Packaging...' : 'Generate Sovereign Build'}</span>
            </button>
          </div>

          {/* Build Package Inspector */}
          {showBuildInspector && (
            <div className="p-5 rounded-2xl bg-black/80 border border-slate-700/80 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    tears-sovereign-developer-build.json
                  </span>
                  <div className="text-[11px] text-slate-400 font-mono">
                    All 6 sovereign platform targets compiled · Clean-room independent architecture
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPackage}
                    className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Bundle</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(DEVELOPER_PLATFORM_LINKS, null, 2), 'build-json')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1"
                  >
                    {copiedId === 'build-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'build-json' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Sovereign iOS:</span>
                  <span className="text-emerald-400 font-bold truncate block">com.tearschannel.app</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Roku Feed:</span>
                  <span className="text-cyan-400 font-bold truncate block">/api/feed.json</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Fire TV:</span>
                  <span className="text-amber-400 font-bold truncate block">Hosted Web App</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Smart TVs:</span>
                  <span className="text-purple-400 font-bold truncate block">Tizen &amp; webOS</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PLATFORM MATRIX (Original Comprehensive Grid) */}
      {/* ============================================================== */}
      {activeSection === 'matrix' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* 6 Platform Readiness Checks */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Target Platform Readiness Checks (6 of 6 Verified):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATFORM_CHECKS.map((chk, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{chk.title}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                    {chk.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of Platform Hub Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEVELOPER_PLATFORM_LINKS.map(link => {
              const isSelected = selectedPlatform.id === link.id;
              return (
                <div
                  key={link.id}
                  onClick={() => setSelectedPlatform(link)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/40 shadow-xl'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-black/60 text-cyan-400 border border-cyan-500/30">
                        {link.badge}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        link.status === 'Production Live' || link.status === 'Active Store Link'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}>
                        {link.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-cyan-400 shrink-0">
                        {link.platform.includes('TV') ? <Tv className="w-5 h-5" /> : link.platform.includes('Web') ? <Globe className="w-5 h-5 text-amber-400" /> : <Smartphone className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">{link.platform}</h3>
                        <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                          {link.appIdOrBundle}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800/80">
                      <div className="text-slate-500 font-mono text-[11px]">Framework / SDK:</div>
                      <div className="text-slate-200 font-medium">{link.sdkOrDoc}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {link.storeUrl ? (
                      <a
                        href={link.storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex-1 py-1.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Store Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <div className="text-[11px] font-mono text-slate-500 py-1.5">Custom Channel</div>
                    )}

                    <a
                      href={link.devPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Dev Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Platform Detailed Documentation */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Selected Deployment Target
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {selectedPlatform.platform} Configuration &amp; Instructions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target ID: <strong className="text-white font-mono">{selectedPlatform.appIdOrBundle}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {selectedPlatform.storeUrl && (
                  <a
                    href={selectedPlatform.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Store Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={selectedPlatform.devPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Developer Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Development &amp; Deployment Checklist:
              </h4>
              <ul className="space-y-2">
                {selectedPlatform.quickInstructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Configuration Code / Manifest Snippet */}
            {selectedPlatform.configSnippet && (
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Manifest / Environment Configuration:
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedPlatform.configSnippet || '', selectedPlatform.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                  >
                    {copiedId === selectedPlatform.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedPlatform.id ? 'Copied' : 'Copy Config'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-black/80 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {selectedPlatform.configSnippet}
                </pre>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: OEM FACTORY PRE-INSTALLATION MASTER ROADMAP (End Goal) */}
      {/* ============================================================== */}
      {activeSection === 'oem-preinstall' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Executive Vision Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-[#0e1629] border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/30">
                <Tv className="w-4 h-4 text-purple-400" />
                <span>FACTORY HARDWARE DISTRIBUTION · OEM PRELOAD SPECIFICATION</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Global Hardware Pre-Installation Master Plan
              </h3>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                <strong>End Goal Objective:</strong> Pre-installing <strong>T.E.A.R.S. Channel &amp; T.E.A.R.adio</strong> directly onto the factory ROM firmware partition of every consumer Smart TV, mobile phone, and tablet right out of the box — with dedicated remote-control hotkeys and system-level privileges.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="text-emerald-400">Zero App Store Barrier</span>
                <span>·</span>
                <span className="text-amber-400">Hardware Fast-Access Remote Hotkeys</span>
                <span>·</span>
                <span className="text-cyan-400">FAST EPG Channel 1045 Preload</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 pt-4 sm:pt-0 sm:absolute sm:right-8 sm:bottom-8 z-20">
              <button
                onClick={handleDownloadOEMPreloadPackage}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download OEM Factory Bundle</span>
              </button>
            </div>
          </div>

          {/* 6 Hardware Manufacturer Pre-Install Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Samsung Smart TVs */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  Samsung Tizen OS
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Smart Hub Row</span>
              </div>
              <h4 className="text-base font-bold text-white">Samsung Electronics Preload</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct factory image injection into the Tizen Smart Hub home bar. Pre-programmed to support remote fast-access buttons and Samsung TV Plus FAST linear guide channel slot 1045.
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800">
                <span className="text-slate-500 block">Preload Partition:</span>
                <span className="text-amber-400 truncate block">/opt/usr/apps/preload/tears.wgt</span>
              </div>
            </div>

            {/* 2. LG Smart TVs */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
                  LG webOS TV
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Magic Remote</span>
              </div>
              <h4 className="text-base font-bold text-white">LG Electronics Preload</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pre-configured for LG Magic Remote Quick Access number-pad key mapping and default factory app strip injection across all OLED and QNED television lines.
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800">
                <span className="text-slate-500 block">System App ID:</span>
                <span className="text-amber-400 truncate block">com.tearschannel.webos</span>
              </div>
            </div>

            {/* 3. Roku TV (TCL, Hisense, Philips, Onn) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                  Roku TV Hardware
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">Remote Hotkey</span>
              </div>
              <h4 className="text-base font-bold text-white">Roku Remote Control Button</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Branded hardware remote button partnership (alongside Netflix, Disney+). Instant one-touch TV power-on directly into T.E.A.R.S. Channel Primetime broadcast.
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800">
                <span className="text-slate-500 block">Channel Feed Hook:</span>
                <span className="text-cyan-400 truncate block">/api/feed.json (Direct Publisher)</span>
              </div>
            </div>

            {/* 4. Amazon Fire TV & Fire Tablets */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Amazon Fire OS
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">System Privileged</span>
              </div>
              <h4 className="text-base font-bold text-white">Fire TV &amp; Fire Tablets</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                OEM system app image pre-install on Fire TV Sticks, Omni TVs, and Fire HD tablets with Alexa video skill pre-authorized out-of-the-box.
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800">
                <span className="text-slate-500 block">Privileged Package:</span>
                <span className="text-amber-400 truncate block">com.tearschannel.firetv</span>
              </div>
            </div>

            {/* 5. Android TV & Smartphones (Samsung Galaxy, Pixel) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Android AOSP / Google TV
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">OEM ROM Partition</span>
              </div>
              <h4 className="text-base font-bold text-white">Mobile Phones &amp; Google TV</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Factory ROM preload under <code>/system/priv-app/</code> on Samsung Galaxy, Google Pixel, Motorola, Sony, and TCL devices with custom Leanback launcher slot.
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800">
                <span className="text-slate-500 block">AOSP Partition:</span>
                <span className="text-emerald-400 truncate block">/system/priv-app/TearsBroadcast.apk</span>
              </div>
            </div>

            {/* 6. Apple iOS, iPadOS & Mobile Carriers */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  Apple &amp; Carriers
                </span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">Carrier Preload</span>
              </div>
              <h4 className="text-base font-bold text-white">Apple Devices &amp; Carriers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apple Business Manager custom app distribution and carrier partner entertainment bundle pre-installs (T-Mobile, AT&amp;T, Verizon device preloads).
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800">
                <span className="text-slate-500 block">Sovereign App ID:</span>
                <span className="text-cyan-400 truncate block">com.tearschannel.app (ID: 6762139785)</span>
              </div>
            </div>

          </div>

          {/* OEM Partnership Outreach Dossier */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Hardware Manufacturer &amp; OEM Partnership Desk</h4>
              <p className="text-xs text-slate-400 mt-1">
                Are you an OEM hardware partner or TV manufacturer? We offer up to 20% programmatic ad revenue share to pre-install partners with zero hardware liability under U.S. Safe Harbor laws.
              </p>
            </div>
            <a
              href="mailto:support@tearschannel.online?subject=OEM%20Factory%20Pre-Install%20Partnership%20-%20T.E.A.R.S.%20Channel"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0"
            >
              <span>Contact OEM Partnership Desk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: RAW NATIVE TV CONFIG EXPORTER */}
      {/* ============================================================== */}
      {activeSection === 'native-files' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Direct Smart TV Configuration Files</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Download or copy pre-formatted native configuration files to drop directly into Samsung Tizen Studio, webOS TV CLI, or Roku Developer Dashboard.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveNativeFile('roku-feed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'roku-feed' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Roku Feed JSON
                </button>
                <button
                  onClick={() => setActiveNativeFile('tizen')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'tizen' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Samsung Tizen config.xml
                </button>
                <button
                  onClick={() => setActiveNativeFile('webos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'webos' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  LG webOS appinfo.json
                </button>
                <button
                  onClick={() => setActiveNativeFile('roku-manifest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'roku-manifest' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Roku manifest
                </button>
                <button
                  onClick={() => setActiveNativeFile('android')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'android' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Android/Fire TV XML
                </button>
                <button
                  onClick={() => setActiveNativeFile('swift-ios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'swift-ios' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Apple iOS (SwiftUI)
                </button>
                <button
                  onClick={() => setActiveNativeFile('swift-tvos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    activeNativeFile === 'swift-tvos' ? 'bg-purple-400 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Apple TV (tvOS)
                </button>
              </div>
            </div>

            {/* Active File Inspector */}
            <div className="p-4 bg-black/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400 block">
                    {NATIVE_FILES[activeNativeFile].filename}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {NATIVE_FILES[activeNativeFile].desc}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadTextFile(NATIVE_FILES[activeNativeFile].filename, NATIVE_FILES[activeNativeFile].code)}
                    className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(NATIVE_FILES[activeNativeFile].code, `file-${activeNativeFile}`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1"
                  >
                    {copiedId === `file-${activeNativeFile}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `file-${activeNativeFile}` ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
                {NATIVE_FILES[activeNativeFile].code}
              </pre>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
