import { useEffect, useRef, useState } from 'react';

const featuredPanelsData = [
  { img: "/images/asim.jpg", video: "/videos/a.mp4", hoverTitle: "Asim Azhar", hoverSubtitle: "Jhoom", audio: "/audio/asim.mp3" },
  { img: "/images/atif.webp", video: "/videos/atif.mp4", hoverTitle: "Atif Aslam", hoverSubtitle: "Tajdar-e-Haram", audio: "/audio/atif.mp3" },
  { img: "/images/hassan.jpg", video: "/videos/hassan.mp4", hoverTitle: "Hassan Raheem", hoverSubtitle: "Joona", audio: "/audio/hassan.mp3" },
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnPk1Uw-TaihlYQIz-nw212TEyTpniPFd9VmufYOTE0nf2PfoKnVCxOCvPbuo55Oxod1Lt25py3-mCR6irZFm-Clds3Asrtg2dW-0qnWf5YTAzKmMVA2sZ9NXVa5fPr5oCNkZiBdcEuI3CkuHNQ1NtRIsYK68eWipv5O1IHGBWOTh7awPmBNNT4OJGvP2TwrBOPUBKv8IB8HfI0Tr7Nl6Z6ACRksgyCtbvIUCCAGgDC-SteH8rOav49wGifQE5sUrJ48jtJy5UWcIG", video: "https://cdn.pixabay.com/video/2025/01/14/252568_large.mp4", hoverTitle: "Pakistani Male Artists", hoverSubtitle: "Pakistani Male Artists", isCenter: true, audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { img: "/images/havi.jpg", video: "/videos/havi.mp4", hoverTitle: "Havi", hoverSubtitle: "Taare", audio: "/audio/havi.mp3" },
  { img: "/images/kavish.jpg", video: "/videos/kavish.mp4", hoverTitle: "Kavish", hoverSubtitle: "Bachpan", audio: "/audio/kavish.mp3" },
  { img: "/images/ali.jpg", video: "/videos/z.mp4", hoverTitle: "Ali Zafar", hoverSubtitle: "Sajna", audio: "/audio/ali.mp3" }
];

const worksArr = [
  { title: "Asim Azhar", subtitle: "Jhoom", video: "/videos/a.mp4", audio: "/audio/asim.mp3" },
  { title: "Atif Aslam", subtitle: "Tajdar-e-Haram", video: "/videos/atif.mp4", audio: "/audio/atif.mp3" },
  { title: "Hassan Raheem", subtitle: "Joona", video: "/videos/hassan.mp4", audio: "/audio/hassan.mp3" },
  { title: "Havi", subtitle: "Taare", video: "/videos/havi.mp4", audio: "/audio/havi.mp3" },
  { title: "Kavish", subtitle: "Bachpan", video: "/videos/kavish.mp4", audio: "/audio/kavish.mp3" },
  { title: "Ali Zafar", subtitle: "Sajna", video: "/videos/z.mp4", audio: "/audio/ali.mp3" }
];

export default function App() {
  const [activeView, setActiveView] = useState('featured'); // 'featured', 'secondary'

  // Featured State
  const [featuredLayoutHidden, setFeaturedLayoutHidden] = useState(false);
  const [panelHiddenStates, setPanelHiddenStates] = useState(Array(7).fill(false));
  const [featuredContentHidden, setFeaturedContentHidden] = useState(false);
  
  // Secondary State
  const [secondaryLayoutHidden, setSecondaryLayoutHidden] = useState(true);
  const [secondaryStateClass, setSecondaryStateClass] = useState('state-hidden');

  // Text state
  const [hoverTitle, setHoverTitle] = useState("Asim Azhar");
  const [hoverSubtitle, setHoverSubtitle] = useState("Song: Ghalat Fehmi");
  const [textFadeStyle, setTextFadeStyle] = useState({ opacity: 1 });

  // Slice state
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [sliceTitleOpacity, setSliceTitleOpacity] = useState(1);
  const [sliceTitle, setSliceTitle] = useState(worksArr[0].title);
  
  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);

  const prevWork = worksArr[(currentWorkIndex - 1 + worksArr.length) % worksArr.length];
  const nextWork = worksArr[(currentWorkIndex + 1) % worksArr.length];
  const currentWork = worksArr[currentWorkIndex];

  useEffect(() => {
    if (activeView === 'secondary' && audioRef.current) {
      audioRef.current.src = currentWork.audio;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
    } else if (activeView === 'featured' && audioRef.current) {
      audioRef.current.pause();
    }
  }, [activeView, currentWorkIndex]);

  const switchToSecondary = () => {
    if (activeView === 'secondary') return;
    setActiveView('secondary');
    
    // Animate out featured
    setPanelHiddenStates(prev => {
      const newStates = [...prev];
      newStates.forEach((_, i) => {
        setTimeout(() => setPanelHiddenStates(p => { const np = [...p]; np[i] = true; return np; }), i * 50);
      });
      return prev;
    });
    setFeaturedContentHidden(true);

    // Animate in secondary after 800ms
    setTimeout(() => {
      setFeaturedLayoutHidden(true);
      setSecondaryLayoutHidden(false);
      setTimeout(() => {
        setSecondaryStateClass('state-visible');
      }, 50);
    }, 800);
  };

  const switchToFeatured = () => {
    if (activeView === 'featured') return;
    setActiveView('featured');

    // Animate out secondary
    setSecondaryStateClass('state-hidden');
    
    // Animate in featured after 900ms
    setTimeout(() => {
      setSecondaryLayoutHidden(true);
      setFeaturedLayoutHidden(false);
      
      setPanelHiddenStates(prev => {
        const newStates = [...prev];
        newStates.forEach((_, i) => {
          setTimeout(() => setPanelHiddenStates(p => { const np = [...p]; np[i] = false; return np; }), i * 50);
        });
        return prev;
      });
      setFeaturedContentHidden(false);
    }, 900);
  };

  const handleNextSlice = () => {
    const nextIdx = (currentWorkIndex + 1) % worksArr.length;
    updateSliceVideos(nextIdx);
  };

  const handlePrevSlice = () => {
    const prevIdx = (currentWorkIndex - 1 + worksArr.length) % worksArr.length;
    updateSliceVideos(prevIdx);
  };

  const updateSliceVideos = (idx) => {
    setCurrentWorkIndex(idx);
    const work = worksArr[idx];
    setSliceTitleOpacity(0);
    setTimeout(() => {
      setSliceTitle(work.title);
      setSliceTitleOpacity(1);
    }, 300);
  };

  const handleVideoReady = (videoElement) => {
    if (!videoElement) return;
    const videosTo30Sec = ['/videos/a.mp4', '/videos/atif.mp4', '/videos/hassan.mp4', '/videos/kavish.mp4'];
    if (videosTo30Sec.includes(videoElement.src)) {
      // Use setTimeout to ensure video is fully ready for seeking
      setTimeout(() => {
        if (videoElement.seekable && videoElement.seekable.length > 0) {
          videoElement.currentTime = 30;
        }
      }, 100);
    }
  };

  const onPanelEnter = (title, subtitle, audioSrc, e) => {
    if (activeView !== 'featured') return;
    const v = e.currentTarget.querySelector('video');
    if (v) { 
      const videosTo30Sec = ['/videos/a.mp4', '/videos/atif.mp4', '/videos/hassan.mp4', '/videos/kavish.mp4'];
      const shouldStart30Sec = videosTo30Sec.includes(v.src);
      
      if (shouldStart30Sec && v.seekable && v.seekable.length > 0) {
        v.currentTime = 30;
      } else if (shouldStart30Sec) {
        // If not seekable yet, wait a bit and try again
        setTimeout(() => {
          if (v.seekable && v.seekable.length > 0) {
            v.currentTime = 30;
          }
        }, 100);
      } else {
        v.currentTime = 0;
      }
      v.play().catch(()=>{}); 
    }
    
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
    }

    if (title && subtitle) {
      setTextFadeStyle({ opacity: 0 });
      setTimeout(() => {
        setHoverTitle(title);
        setHoverSubtitle(subtitle);
        setTextFadeStyle({ opacity: 1 });
      }, 300);
    }
  };

  const onPanelLeave = (e) => {
    if (activeView !== 'featured') return;
    const v = e.currentTarget.querySelector('video');
    if (v) v.pause();
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Reset text to default "Pakistani Male Artists"
    setTextFadeStyle({ opacity: 0 });
    setTimeout(() => {
      setHoverTitle("Pakistani Male Artists");
      setHoverSubtitle("Pakistani Male Artists");
      setTextFadeStyle({ opacity: 1 });
    }, 300);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <>
      <audio ref={audioRef} loop />
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 bg-transparent">
        {activeView === 'secondary' && (
          <div className="flex items-center">
            <span className="material-symbols-outlined nav-arrow" onClick={handlePrevSlice}>arrow_back_ios</span>
          </div>
        )}
        <div className={`text-3xl font-signature text-[#f5f5f5] tracking-normal ${ activeView === 'featured' ? 'mx-auto' : ''}`}>
          Top Pakistani Artists
        </div>
        {activeView === 'secondary' && (
          <div className="flex items-center">
            <span className="material-symbols-outlined nav-arrow" onClick={handleNextSlice}>arrow_forward_ios</span>
          </div>
        )}
        {activeView === 'featured' && <div></div>}
      </header>

      {/* Featured Layout */}
      {!featuredLayoutHidden && (
        <main id="featured-layout" className="flex-grow flex flex-col items-center justify-center pt-16 pb-16 relative transition-all duration-1000 overflow-hidden w-full h-full">
          <div id="featured-panels" className="panel-container">
            {featuredPanelsData.map((p, i) => (
              <div 
                key={i} 
                className={`archival-panel ${p.isCenter ? 'center-panel hero-gradient relative shadow-xl flex items-center justify-center overflow-hidden' : ''} ${panelHiddenStates[i] ? 'state-hidden' : ''}`}
                onMouseEnter={(e) => onPanelEnter(p.hoverTitle, p.hoverSubtitle, p.audio, e)}
                onMouseLeave={onPanelLeave}
              >
                <div className="panel-image" style={{ backgroundImage: `url('${p.img}')` }}></div>
                {!p.isCenter && <video className="panel-video" loop muted playsInline preload="auto" src={p.video} onLoadedMetadata={(e) => handleVideoReady(e.currentTarget)}></video>}
                {p.isCenter && p.centerChar && <span className="relative text-7xl font-headline text-surface leading-none select-none italic z-10 pointer-events-none">{p.centerChar}</span>}
              </div>
            ))}
          </div>
          <div id="featured-content" className={`mt-8 flex flex-col items-center text-center max-w-2xl px-6 ${featuredContentHidden ? 'state-hidden' : ''}`}>
            <h1 id="locked-title" className="text-fade font-headline text-5xl md:text-6xl text-on-surface mb-1 tracking-tight" style={textFadeStyle}>{hoverTitle}</h1>
          </div>
        </main>
      )}

      {/* Secondary Layout */}
      {!secondaryLayoutHidden && (
        <div id="secondary-layout" className={secondaryStateClass}>
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div id="slice-container" className="immersive-slice-container">
              {/* Continuous slice logic mappings based on HTML sizes */}
              {[
                { w: "70px", h: "75%", l: "calc(50% + 400px)" },
                { w: "100px", h: "85%", l: "calc(50% + 280px)" },
                { w: "150px", h: "95%", l: "calc(50% + 125px)" },
                { w: "180px", h: "100%", l: "50%" },
                { w: "150px", h: "95%", l: "calc(50% - 125px)" },
                { w: "100px", h: "85%", l: "calc(50% - 280px)" },
                { w: "70px", h: "75%", l: "calc(50% - 400px)" }
              ].map((style, i) => (
                <div className="video-slice" style={{ width: style.w, height: style.h }} key={i}>
                  <video autoPlay loop muted playsInline style={{ left: style.l }} src={currentWork.video} onCanPlay={(e) => handleVideoReady(e.currentTarget)}></video>
                </div>
              ))}
            </div>
            
            <div className="editorial-text-overlay">
              <h2 id="slice-title" className="font-display text-5xl text-on-surface tracking-widest text-center transition-opacity duration-300" style={{ opacity: sliceTitleOpacity }}>{sliceTitle}</h2>
              <div className="flex items-center gap-4 mt-4 opacity-30">
                <div className="h-px w-8 bg-on-surface"></div>
                <span className="material-symbols-outlined text-xs">music_note</span>
                <div className="h-px w-8 bg-on-surface"></div>
              </div>
            </div>

            <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-start gap-4 pointer-events-none">
              <span className="font-label text-[0.55rem] uppercase tracking-widest opacity-40 vertical-text h-32 border-r border-white/20 pr-2">{prevWork.title}</span>
              <span className="material-symbols-outlined text-on-surface opacity-30 scale-75">arrow_back</span>
            </div>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4 pointer-events-none">
              <span className="font-label text-[0.55rem] uppercase tracking-widest opacity-40 vertical-text h-32 border-l border-white/20 pl-2">{nextWork.title}</span>
              <span className="material-symbols-outlined text-on-surface opacity-30 scale-75">arrow_forward</span>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-12 pb-8 bg-transparent pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          <span className="material-symbols-outlined text-on-surface cursor-pointer hover:text-primary transition-colors" onClick={toggleMute}>{isMuted ? 'volume_off' : 'volume_up'}</span>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            id="btn-state-secondary" 
            className={`flex items-center justify-center w-12 h-12 border border-white/20 rounded-full hover:bg-white/10 transition-all ${activeView === 'secondary' ? 'active-footer-btn' : ''}`}
            onClick={switchToSecondary}
          >
            <span className="material-symbols-outlined text-on-surface text-sm">horizontal_rule</span>
          </button>
          <button 
            id="btn-state-featured" 
            className={`flex items-center justify-center w-12 h-12 border border-white/60 rounded-full transition-all ${activeView === 'featured' ? 'active-footer-btn' : ''}`}
            onClick={switchToFeatured}
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
          </button>
        </div>
      </footer>
    </>
  );
}
