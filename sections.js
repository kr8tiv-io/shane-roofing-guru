// Shared content sections injected below the splash on every concept.
// Themes itself from each page's CSS variables (--bg, --fg, --accent, --mute, --ink).
// Adds About/Stats, Climate/Storms, Services, Contact — varied subtly per concept.

(function(){
  // Free up scrolling — splashes default to overflow:hidden / height:100%
  document.documentElement.style.overflow = 'hidden auto';
  document.documentElement.style.height = 'auto';
  document.body.style.overflow = 'hidden';
  document.body.style.overflowY = 'auto';
  document.body.style.height = 'auto';
  document.body.style.minHeight = '100vh';
  document.body.style.cursor = ''; // restore default cursor outside splash

  // Make the existing UI float over the splash but scroll under sections
  const fixedEls = [...document.querySelectorAll('.ui, .frame, .stage, .scrim, .lens, .ret, .cur, .scan, .scanline, .gridbg, .tearbar, .signal, .lamp, .label, .swatches, .hint, .eye, .channel, .zoom, .tideline, .depth, .elev, .fold')];
  // Pin canvas so the splash stays as ambient background until sections cover it
  // (We don't change canvases — they're already position:fixed.)

  // Detect light vs dark theme from --bg
  function pickColor(name, fallback){
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function luminance(hex){
    hex = hex.replace('#','');
    if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
    const r=parseInt(hex.substr(0,2),16)/255, g=parseInt(hex.substr(2,2),16)/255, b=parseInt(hex.substr(4,2),16)/255;
    return 0.299*r + 0.587*g + 0.114*b;
  }
  const bg = pickColor('--bg', '#0E0E0E');
  const fg = pickColor('--fg') || pickColor('--ink', '#F2EFEA');
  const accent = pickColor('--accent', '#FF5A1F');
  const mute = pickColor('--mute', '#6B6B6B');
  const isLight = luminance(bg) > 0.5;
  const surface = isLight ? '#FFFFFF' : (luminance(bg) > 0.1 ? '#0E0E0E' : '#16161A');
  const surfaceAlt = isLight ? '#F5F1E8' : (luminance(bg) > 0.1 ? '#181818' : '#0a0a0d');
  const border = isLight ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.08)';
  const subText = isLight ? 'rgba(0,0,0,.65)' : 'rgba(255,255,255,.7)';

  // Inject CSS for sections
  const style = document.createElement('style');
  style.textContent = `
    /* register an angle property so the conic-gradient tracer actually interpolates
       (without @property, the keyframe would snap rather than animate smoothly) */
    @property --sd-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
`;
  style.textContent += `
    .sd-section{position:relative;z-index:6;background:${bg};color:${fg};padding:120px 6vw;border-top:1px solid ${border};font-family:"Space Grotesk",system-ui,sans-serif;}
    .sd-section .sd-eyebrow{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:${accent};margin-bottom:24px;display:flex;align-items:center;gap:14px}
    .sd-section .sd-eyebrow .ln{flex:1;height:1px;background:${border}}
    .sd-section h2{font-family:"Archivo Black",sans-serif;font-size:clamp(36px,6vw,96px);line-height:.95;letter-spacing:-.025em;text-transform:uppercase;margin-bottom:32px;max-width:14ch;position:relative;isolation:isolate;--sd-mx:50%;--sd-my:50%;--sd-glow:0;will-change:filter,transform;transition:filter .8s cubic-bezier(.22,.8,.22,1),transform .8s cubic-bezier(.22,.8,.22,1);transform:translateZ(0)}
    .sd-section h2 i{font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:300;color:${accent}}
    .sd-section h2 .or{color:${accent};font-style:normal;font-family:"Archivo Black",sans-serif}
    /* GPU-accelerated bloom on every section title — slow ramp-up driven by --sd-glow,
       and a mouse-following spotlight via --sd-mx / --sd-my that gets painted as a radial
       glow behind the letters. drop-shadow stays on the compositor (it's an accelerated filter). */
    .sd-section h2::before, .sd-testi-h2::before, .sd-cta-headline::before, .sd-climate-text h2::before{
      content:"";position:absolute;inset:-12% -8%;z-index:-1;pointer-events:none;
      background:radial-gradient(circle 280px at var(--sd-mx,50%) var(--sd-my,50%), rgba(255,140,40,calc(.55*var(--sd-glow,0))) 0%, rgba(255,90,31,calc(.32*var(--sd-glow,0))) 28%, transparent 70%);
      filter:blur(28px);
      transition:opacity 1.1s cubic-bezier(.22,.8,.22,1);
      mix-blend-mode:screen;
      will-change:transform,opacity;
    }
    .sd-section h2:hover, .sd-testi-h2:hover, .sd-cta-headline:hover, .sd-climate-text h2:hover{
      filter:drop-shadow(0 0 18px rgba(255,140,40,.45)) drop-shadow(0 0 36px rgba(255,90,31,.28));
    }
    /* same trick for the testimonials banner H2 + CTA bigtext + climate H2 */
    .sd-testi-h2, .sd-cta-headline, .sd-climate-text h2{position:relative;isolation:isolate;--sd-mx:50%;--sd-my:50%;--sd-glow:0;will-change:filter,transform;transition:filter .8s cubic-bezier(.22,.8,.22,1)}
    .sd-lede{font-size:clamp(16px,1.5vw,21px);line-height:1.5;color:${subText};max-width:680px;margin-bottom:48px}
    .sd-lede b{color:${fg}}

    /* §02 ABOUT */
    .sd-about{display:grid;grid-template-columns:1.1fr 1fr;gap:80px;align-items:start}
    .sd-about-stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:${border};border:1px solid ${border}}
    .sd-stat{background:${bg};padding:32px 28px}
    .sd-stat .k{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${mute};margin-bottom:14px}
    .sd-stat .v{font-family:"Archivo Black",sans-serif;font-size:clamp(40px,4vw,64px);line-height:.95;letter-spacing:-.02em}
    .sd-stat .v small{display:block;font-family:"JetBrains Mono",monospace;font-weight:400;font-size:11px;letter-spacing:.14em;color:${mute};margin-top:8px;text-transform:uppercase}
    .sd-stat:hover{background:${accent};color:${bg};transition:background .2s}
    .sd-stat:hover .k,.sd-stat:hover .v small{color:${bg};opacity:.85}

    /* §03 CLIMATE */
    .sd-climate{}
    .sd-climate-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:${border};border:1px solid ${border};margin-top:32px}
    .sd-card{background:${bg};padding:36px 28px;display:flex;flex-direction:column;gap:14px;min-height:260px;transition:background .2s,transform .2s;position:relative;overflow:hidden}
    .sd-card:hover{background:${surface}}
    .sd-card .num{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.18em;color:${mute}}
    .sd-card .ttl{font-family:"Archivo Black",sans-serif;font-size:24px;letter-spacing:-.01em;text-transform:uppercase;line-height:1.05}
    .sd-card .ttl em{font-style:normal;color:${accent}}
    .sd-card .desc{font-family:"JetBrains Mono",monospace;font-size:12px;line-height:1.55;color:${subText};margin-top:auto;letter-spacing:.02em}
    .sd-card .stat{font-family:"Archivo Black",sans-serif;font-size:36px;color:${accent};line-height:1;margin-top:8px}

    /* §04 SERVICES */
    .sd-services{position:relative;overflow:hidden}
    /* background video — sits behind the headline + lede on the right side, blends into bg with chunky uneven-square edge */
    .sd-svc-bgvid{
      position:absolute;
      top:14%;
      right:100px;            /* shifted left 100px from the right edge */
      width:36%;
      height:62%;
      object-fit:cover;
      z-index:0;
      pointer-events:none;
      opacity:.22;
      mix-blend-mode:screen;
      filter:contrast(1.04) saturate(.65) brightness(.95);
      /* asymmetric ellipse — slightly biased right so the LEFT edge has more fall-off and dissolves cleanly into the bg */
      -webkit-mask-image: radial-gradient(ellipse 58% 60% at 56% 50%, #000 0%, rgba(0,0,0,.92) 22%, rgba(0,0,0,.62) 46%, rgba(0,0,0,.28) 72%, rgba(0,0,0,.08) 90%, transparent 100%);
      -webkit-mask-size: 100% 100%;
      -webkit-mask-repeat: no-repeat;
      mask-image: radial-gradient(ellipse 58% 60% at 56% 50%, #000 0%, rgba(0,0,0,.92) 22%, rgba(0,0,0,.62) 46%, rgba(0,0,0,.28) 72%, rgba(0,0,0,.08) 90%, transparent 100%);
      mask-size: 100% 100%;
      mask-repeat: no-repeat;
    }
    /* keep all readable / clickable content above the video */
    .sd-services > .sd-eyebrow,
    .sd-services > h2,
    .sd-services > .sd-lede,
    .sd-services > .sd-svc-list{position:relative;z-index:1}
    @media (max-width:880px){
      .sd-svc-bgvid{width:46%;height:42%;top:8%;right:2%;opacity:.16}
    }
    /* list bg is transparent so the video bleeds faintly through behind each row */
    .sd-svc-list{border-top:1px solid ${border};margin-top:32px;background:transparent;position:relative;z-index:1}
    .sd-svc{display:grid;grid-template-columns:80px 1fr 2fr 80px;gap:24px;align-items:center;padding:28px 0;border-bottom:1px solid ${border};transition:padding .25s,background .25s;cursor:pointer;position:relative}
    .sd-svc:hover{padding:28px 24px;background:${surfaceAlt}}
    /* tracer bead sweeping along the bottom edge of each service row — a thin amber comet */
    .sd-svc::before{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg, transparent 0%, transparent 38%, rgba(255,140,40,.0) 44%, rgba(255,180,90,.85) 50%, rgba(255,140,40,.0) 56%, transparent 62%, transparent 100%);background-size:240% 100%;background-position:-120% 0;animation:sd-svc-sweep 8.5s cubic-bezier(.45,.0,.55,1) infinite;pointer-events:none;opacity:.55;mix-blend-mode:screen}
    .sd-svc:hover::before{opacity:1;animation-duration:3.5s;filter:drop-shadow(0 0 6px rgba(255,140,40,.6))}
    /* stagger sweeps so the rows feel alive but not in lockstep */
    .sd-svc:nth-child(2)::before{animation-delay:-1.2s}
    .sd-svc:nth-child(3)::before{animation-delay:-2.6s;animation-duration:10s}
    .sd-svc:nth-child(4)::before{animation-delay:-4.1s;animation-duration:9s}
    .sd-svc:nth-child(5)::before{animation-delay:-5.7s}
    .sd-svc:nth-child(6)::before{animation-delay:-7.0s;animation-duration:11s}
    .sd-svc:nth-child(7)::before{animation-delay:-8.5s;animation-duration:8s}
    .sd-svc:nth-child(8)::before{animation-delay:-3.0s;animation-duration:9.5s}
    @keyframes sd-svc-sweep{0%{background-position:-120% 0}100%{background-position:220% 0}}
    .sd-svc .num{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.18em;color:${mute}}
    .sd-svc .name{font-family:"Archivo Black",sans-serif;font-size:clamp(22px,2.4vw,38px);text-transform:uppercase;letter-spacing:-.015em;line-height:1}
    .sd-svc .name em{font-style:italic;color:${accent};font-family:"Space Grotesk",sans-serif;font-weight:300}
    .sd-svc .blurb{font-family:"JetBrains Mono",monospace;font-size:12px;color:${subText};letter-spacing:.02em;line-height:1.5}
    .sd-svc .arrow{font-family:"JetBrains Mono",monospace;font-size:14px;color:${mute};text-align:right;transition:color .2s,transform .2s}
    .sd-svc:hover .arrow{color:${accent};transform:translateX(6px)}
    .sd-svc:hover .name{letter-spacing:.005em}

    /* §05 CTA */
    .sd-cta-wrap{padding:140px 6vw 100px}
    .sd-cta-headline{font-family:"Archivo Black",sans-serif;font-size:clamp(60px,11vw,200px);line-height:.85;letter-spacing:-.03em;text-transform:uppercase;margin-bottom:48px}
    .sd-cta-headline i{font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:300;color:${accent}}
    .sd-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:end}
    .sd-cta-row .left{font-family:"JetBrains Mono",monospace;font-size:14px;line-height:1.7;color:${subText};letter-spacing:.02em;max-width:520px}
    .sd-cta-row .left b{display:block;color:${fg};font-family:"Archivo Black",sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px}
    .sd-cta-row .right{display:flex;flex-direction:column;align-items:flex-end;gap:24px}
    .sd-bigcta{display:inline-flex;align-items:center;gap:18px;background:${accent};color:${bg};padding:24px 36px;text-decoration:none;font-family:"Archivo Black",sans-serif;font-size:18px;letter-spacing:.05em;text-transform:uppercase;transition:transform .2s,box-shadow .2s}
    .sd-bigcta:hover{transform:translate(-3px,-3px);box-shadow:6px 6px 0 ${fg}}
    .sd-bigcta::after{content:"→";font-size:22px}
    .sd-coverage{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${mute};text-align:right;line-height:1.6}
    .sd-coverage b{color:${fg}}

    /* §03 — FLAG VIDEO sits to the LEFT of the writing, on the same row, no overlap */
    .sd-climate-intro{position:relative;display:flex;align-items:center;gap:24px;margin-bottom:48px;flex-wrap:nowrap}
    .sd-climate-text{flex:1 1 0;min-width:280px;display:flex;flex-direction:column;gap:24px}
    .sd-climate-text h2{font-family:"Archivo Black",sans-serif;font-size:clamp(36px,5vw,82px);line-height:.95;letter-spacing:-.025em;text-transform:uppercase;margin:0;position:relative;z-index:2}
    .sd-climate-text h2 i{font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:300;color:${accent}}
    .sd-climate-text .sd-lede{margin:0;max-width:680px}
    .sd-flag-video{display:block;width:clamp(380px,44vw,720px);aspect-ratio:16/9;object-fit:cover;mix-blend-mode:${isLight?'multiply':'screen'};opacity:.92;filter:contrast(1.08) saturate(1.15) brightness(${isLight?'.9':'1.05'});mask-image:linear-gradient(180deg,#000 0%,#000 50%,rgba(0,0,0,.55) 82%,transparent 100%);-webkit-mask-image:linear-gradient(180deg,#000 0%,#000 50%,rgba(0,0,0,.55) 82%,transparent 100%);border-radius:2px;flex:0 0 auto;position:relative;z-index:1}
    @media (max-width:880px){.sd-climate-intro{flex-wrap:wrap;gap:20px}.sd-flag-video{width:100%}}

    /* §02.8 — SELECTED WORK · GSAP-driven horizontal scroll gallery */
    .sd-jobs-sec{position:relative;height:100vh;min-height:640px;overflow:hidden;background:${bg};border-top:1px solid ${border};border-bottom:1px solid ${border}}
    .sd-jobs-head{position:absolute;left:6vw;top:36px;right:6vw;display:flex;justify-content:space-between;align-items:flex-start;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${mute};z-index:5;pointer-events:none}
    .sd-jobs-head .ttl{font-family:"Archivo Black",sans-serif;font-size:clamp(28px,4vw,52px);letter-spacing:-.02em;color:${fg};line-height:.9;text-transform:uppercase;margin-bottom:6px}
    .sd-jobs-head .ttl i{font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:300;color:${accent}}
    .sd-jobs-head .progress{display:flex;flex-direction:column;align-items:flex-end;gap:6px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.18em;color:${mute}}
    .sd-jobs-head .progress b{color:${accent}}
    .sd-jobs-track{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;gap:24px;padding:0 6vw;will-change:transform}
    .sd-job{position:relative;flex:0 0 auto;width:clamp(240px,22vw,360px);height:54vh;min-height:340px;background:#0b0b0b;overflow:hidden;border:1px solid ${border};box-shadow:0 30px 60px -30px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04) inset}
    .sd-job img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.10) saturate(.82) brightness(.92) blur(.3px);transition:filter .55s cubic-bezier(.2,.8,.2,1),transform .9s cubic-bezier(.2,.8,.2,1)}
    .sd-job:hover img{filter:contrast(1.05) saturate(1) brightness(1) blur(0);transform:scale(1.04)}
    .sd-job-num{position:absolute;top:14px;left:14px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,255,255,.78);background:rgba(0,0,0,.55);padding:5px 8px;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(6px);z-index:4}
    .sd-job-type{position:absolute;top:14px;right:14px;font-family:"Archivo Black",sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:${accent};background:rgba(0,0,0,.6);padding:6px 9px;border:1px solid ${accent};backdrop-filter:blur(6px);z-index:4}
    .sd-job-cap{position:absolute;left:0;right:0;bottom:0;padding:18px 18px 16px;background:linear-gradient(transparent,rgba(0,0,0,.92));z-index:4;color:#fff;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;display:flex;justify-content:space-between;align-items:flex-end;gap:14px;opacity:.85;transition:opacity .3s}
    .sd-job:hover .sd-job-cap{opacity:1}
    .sd-job-cap b{font-family:"Archivo Black",sans-serif;font-size:12px;color:#fff;letter-spacing:.04em;display:block;margin-bottom:4px;text-transform:uppercase}
    .sd-job-cap b em{color:${accent};font-style:normal}
    .sd-job-cap .yr{flex:0 0 auto;color:rgba(255,255,255,.7)}
    /* cleanup overlay layers — disguise blur, give intentional editorial look */
    .sd-job-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.13) 2px 3px);mix-blend-mode:multiply;pointer-events:none;z-index:2;opacity:.78}
    .sd-job-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,.55) 100%);pointer-events:none;z-index:2}
    /* halftone-grain dot overlay — softens blur, looks like editorial print */
    .sd-job::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.09) .8px,transparent 1px);background-size:3px 3px;mix-blend-mode:overlay;pointer-events:none;z-index:2}
    /* warm tint wash to unify mismatched lighting across photos */
    .sd-job::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,90,31,.10) 0%,transparent 32%,transparent 68%,rgba(31,70,138,.12) 100%);mix-blend-mode:soft-light;pointer-events:none;z-index:2}
    .sd-job:hover::after{background:linear-gradient(135deg,rgba(255,90,31,.18) 0%,transparent 35%,transparent 65%,rgba(31,70,138,.18) 100%)}
    /* light rays — fan of sunbeams emanating from top-right corner, screen-blended */
    .sd-job-rays{position:absolute;inset:0;background:repeating-conic-gradient(from -32deg at 100% 0%, transparent 0deg, transparent 11deg, rgba(255,210,150,.18) 11deg, rgba(255,235,200,.22) 13deg, rgba(255,210,150,.18) 15deg, transparent 15deg, transparent 28deg);mix-blend-mode:screen;pointer-events:none;z-index:2;opacity:.55;transition:opacity .45s cubic-bezier(.2,.8,.2,1),filter .45s;filter:blur(.5px)}
    .sd-job-rays::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0%, rgba(255,220,160,.20) 0%, transparent 35%);mix-blend-mode:screen;pointer-events:none}
    .sd-job:hover .sd-job-rays{opacity:.95;filter:blur(0)}
    /* CREW special card — stronger color treatment, ID-card vibe */
    .sd-job-crew img{filter:contrast(1.15) saturate(.7) brightness(.85)}
    .sd-job-crew::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,90,31,.18),transparent 35%,transparent 65%,rgba(255,90,31,.18));mix-blend-mode:screen;pointer-events:none;z-index:2}
    .sd-job-crew::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 1px,rgba(255,90,31,.10) 1px 2px);mix-blend-mode:screen;pointer-events:none;z-index:2}
    .sd-job-crew .sd-job-type{color:#fff;background:${accent};border-color:${accent}}
    /* GPU-composited light tracer ring around each job card — subtle, slow at rest, brighter on hover.
       Uses @property --sd-angle so the conic-gradient angle interpolates smoothly. */
    .sd-job-tracer{position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;z-index:3;opacity:.28;background:conic-gradient(from var(--sd-angle,0deg), transparent 0deg, rgba(255,140,40,.85) 18deg, rgba(255,215,170,.95) 28deg, rgba(255,140,40,.85) 38deg, transparent 60deg, transparent 360deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;animation:sd-tracer-rot 9s linear infinite;transition:opacity .35s,filter .35s;filter:blur(.4px)}
    .sd-job:hover .sd-job-tracer{opacity:.85;animation-duration:4.5s;filter:blur(0) drop-shadow(0 0 6px rgba(255,140,40,.55))}
    /* stagger so cards aren't synchronised */
    .sd-job:nth-child(3n+1) .sd-job-tracer{animation-delay:-1.2s}
    .sd-job:nth-child(3n+2) .sd-job-tracer{animation-delay:-3.7s;animation-duration:11s}
    .sd-job:nth-child(3n)   .sd-job-tracer{animation-delay:-5.5s;animation-duration:8s}
    /* CREW card uses pure orange to match its frame */
    .sd-job-crew .sd-job-tracer{background:conic-gradient(from var(--sd-angle,0deg), transparent 0deg, rgba(255,90,31,.95) 18deg, rgba(255,160,90,1) 28deg, rgba(255,90,31,.95) 38deg, transparent 60deg, transparent 360deg);opacity:.55}
    .sd-jobs-hint{position:absolute;left:50%;bottom:36px;transform:translateX(-50%);font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.4em;color:${mute};text-transform:uppercase;z-index:5;animation:sd-jobs-pulse 2.4s ease-in-out infinite;pointer-events:none}
    @keyframes sd-jobs-pulse{0%,100%{opacity:.3}50%{opacity:1}}
    @media (max-width:780px){
      .sd-jobs-sec{height:auto;min-height:640px}
      .sd-jobs-track{position:relative;flex-wrap:nowrap;overflow-x:auto;scroll-snap-type:x mandatory;padding:120px 6vw 60px;gap:14px;-webkit-overflow-scrolling:touch}
      .sd-job{scroll-snap-align:start;width:80vw;height:54vh;min-height:340px}
      .sd-jobs-head{position:relative;left:auto;top:auto;right:auto;padding:36px 6vw 0}
      .sd-jobs-sec.is-gsap-mobile{height:100svh;overflow:hidden}
      .sd-jobs-sec.is-gsap-mobile .sd-jobs-head{position:absolute;left:6vw;right:6vw;top:30px;padding:0}
      .sd-jobs-sec.is-gsap-mobile .sd-jobs-track{position:absolute;left:0;top:0;bottom:0;overflow:visible;scroll-snap-type:none;padding:130px 6vw 70px;align-items:center}
      .sd-jobs-sec.is-gsap-mobile .sd-job{width:min(82vw,360px);height:52svh;min-height:320px}
    }

    /* §02.7 — TESTIMONIALS + BBB ACCREDITATION (early social proof) */
    .sd-testi-sec{padding:140px 6vw 120px;position:relative;overflow:hidden}
    .sd-testi-sec::before{content:"";position:absolute;left:-10%;top:-10%;right:-10%;bottom:-10%;background:radial-gradient(ellipse at 30% 40%,rgba(255,90,31,.08),transparent 55%),radial-gradient(ellipse at 80% 70%,rgba(255,165,60,.06),transparent 55%);pointer-events:none;animation:sd-testi-drift 24s ease-in-out infinite}
    @keyframes sd-testi-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(2%,-1.5%)}}
    .sd-testi-sec::after{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px);background-size:18px 18px;pointer-events:none;mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%);-webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%)}
    .sd-testi-sec > *{position:relative;z-index:1}
    .sd-testi-h2{font-family:"Archivo Black",sans-serif;font-size:clamp(40px,7vw,128px);line-height:.88;letter-spacing:-.03em;text-transform:uppercase;margin:0 0 20px;max-width:18ch}
    .sd-testi-h2 i{font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:300;color:${accent}}
    .sd-testi-stats{display:flex;gap:32px;margin-bottom:42px;flex-wrap:wrap;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${mute}}
    .sd-testi-stats span{display:inline-flex;align-items:baseline;gap:8px}
    .sd-testi-stats b{font-family:"Archivo Black",sans-serif;font-size:22px;letter-spacing:-.01em;color:${accent};text-transform:none}
    .sd-testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;margin-bottom:72px;align-items:start}
    .sd-testi-peer-tag{display:inline-block;font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:${accent};border:1px solid ${accent};padding:3px 7px;margin-bottom:4px;align-self:flex-start}
    .sd-testi{position:relative;background:${surface};border:1px solid ${border};padding:42px 28px 24px;display:flex;flex-direction:column;gap:14px;height:100%;transition:border-color .35s cubic-bezier(.2,.8,.2,1),transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .35s,background .25s;will-change:transform;isolation:isolate}
    .sd-testi:hover{border-color:${accent};box-shadow:0 30px 60px -20px rgba(0,0,0,.55),0 0 0 1px ${accent} inset;background:${surfaceAlt||surface}}
    /* gentle ALTERNATING tilt on hover only — clean rest, life on touch */
    .sd-testi:nth-child(odd):hover { transform:translateY(-8px) scale(1.018) rotate(-.55deg) }
    .sd-testi:nth-child(even):hover{ transform:translateY(-8px) scale(1.018) rotate(.55deg) }
    .sd-testi::before{content:"\\201C";position:absolute;top:-6px;right:14px;font-family:"DM Serif Display","Times New Roman",serif;font-size:140px;line-height:1;color:${accent};opacity:.45;pointer-events:none;z-index:0;transition:opacity .35s,transform .55s cubic-bezier(.2,.8,.2,1)}
    .sd-testi:hover::before{opacity:.85;transform:translate(4px,-4px) rotate(-3deg)}
    /* GPU-composited light tracer — conic gradient masked to a 1px ring runs around each card.
       Uses @property --sd-angle so the keyframe interpolates the angle (otherwise it'd jump). */
    .sd-testi-tracer{position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;z-index:0;opacity:.5;background:conic-gradient(from var(--sd-angle,0deg), transparent 0deg, ${accent} 22deg, #ffd1b5 32deg, ${accent} 42deg, transparent 64deg, transparent 360deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;animation:sd-tracer-rot 6s linear infinite;transition:opacity .35s,filter .35s;filter:blur(.4px) saturate(1.2)}
    .sd-testi:hover .sd-testi-tracer{opacity:1;animation-duration:3s;filter:blur(0) saturate(1.4) drop-shadow(0 0 6px rgba(255,90,31,.55))}
    .sd-testi:nth-child(2) .sd-testi-tracer{animation-delay:-1.5s}
    .sd-testi:nth-child(3) .sd-testi-tracer{animation-delay:-3.0s}
    .sd-testi:nth-child(4) .sd-testi-tracer{animation-delay:-4.5s}
    @keyframes sd-tracer-rot { to { --sd-angle: 360deg } }
    /* keep card content above tracer + quote glyph */
    .sd-testi > *:not(.sd-testi-tracer){position:relative;z-index:1}
    .sd-testi-quote{font-family:"Space Grotesk",sans-serif;font-size:16.5px;line-height:1.55;color:${fg};font-weight:400;flex:1;position:relative}
    .sd-testi-quote b{color:${accent};font-weight:700}
    .sd-testi-meta{padding-top:16px;border-top:1px solid ${border};display:flex;justify-content:space-between;align-items:flex-end;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${mute}}
    .sd-testi-meta b{font-family:"Archivo Black",sans-serif;font-size:13px;letter-spacing:.04em;color:${fg};display:block;margin-bottom:4px;text-transform:none}
    /* number badge per card */
    .sd-testi-num{position:absolute;top:14px;left:18px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:${mute};line-height:1}
    .sd-testi-num b{display:block;color:${accent};font-family:"Archivo Black",sans-serif;font-size:18px;letter-spacing:0;margin-top:4px}
    /* credentials strip */
    .sd-creds{display:grid;grid-template-columns:auto repeat(4,1fr);gap:1px;background:${border};border:1px solid ${border}}
    @media (max-width:980px){.sd-creds{grid-template-columns:1fr 1fr}}
    .sd-creds{position:relative;overflow:hidden;transition:border-color .25s;min-width:0}
    .sd-creds-bbb,.sd-cred{min-width:0;overflow:hidden}
    @media (max-width:680px){.sd-creds{grid-template-columns:1fr!important}.sd-creds-bbb{border-right:none;border-bottom:1px solid ${border}}.sd-cred .v{font-size:clamp(22px,5vw,32px)}}
    .sd-creds:hover{border-color:${accent}}
    .sd-creds::before{content:"";position:absolute;top:-50%;left:-100%;width:60%;height:200%;background:linear-gradient(105deg,transparent,rgba(255,165,60,.12),transparent);transform:skewX(-18deg);pointer-events:none;animation:sd-cred-shimmer 7s ease-in-out infinite}
    @keyframes sd-cred-shimmer{0%,100%{left:-100%}50%{left:200%}}
    .sd-creds-bbb{background:${bg};padding:34px 32px;display:flex;align-items:center;gap:24px;border-right:1px solid ${border};position:relative}
    .sd-bbb-seal{flex:0 0 auto;width:108px;height:56px;display:block;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
    .sd-creds:hover .sd-bbb-seal{transform:rotate(-3deg) scale(1.04)}
    .sd-creds-bbb .badge{font-family:"Archivo Black",sans-serif;font-size:72px;line-height:.85;letter-spacing:-.04em;color:${accent};text-shadow:0 4px 24px rgba(255,90,31,.35);animation:sd-aplus-pulse 3s ease-in-out infinite}
    @keyframes sd-aplus-pulse{0%,100%{transform:scale(1);text-shadow:0 4px 24px rgba(255,90,31,.35)}50%{transform:scale(1.04);text-shadow:0 6px 36px rgba(255,90,31,.65)}}
    .sd-creds-bbb .lbl{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${mute};line-height:1.5}
    .sd-creds-bbb .lbl b{font-family:"Archivo Black",sans-serif;color:${fg};font-size:12px;display:block;margin-bottom:6px;letter-spacing:.1em}
    .sd-cred{background:${bg};padding:32px 28px;display:flex;flex-direction:column;gap:8px}
    .sd-cred .k{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${mute}}
    .sd-cred .v{font-family:"Archivo Black",sans-serif;font-size:clamp(28px,3vw,42px);line-height:.95;letter-spacing:-.01em;color:${fg}}
    .sd-cred .v small{font-family:"JetBrains Mono",monospace;font-weight:400;font-size:11px;color:${mute};letter-spacing:.1em;display:block;margin-top:6px;text-transform:uppercase}

    /* §03.5 — LIVE FEEDS (two windy.com webcams in TV bezels + open-meteo weather) */
    .sd-cams-sec{position:relative;padding:120px 6vw;background:${bg};border-top:1px solid ${border};border-bottom:1px solid ${border};z-index:6;overflow:hidden}
    .sd-cams-bg{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
    .sd-cams-bg video{display:block;width:100%;height:100%;object-fit:cover;filter:contrast(1.08) saturate(.7) brightness(.78) blur(1.5px);opacity:.85}
    .sd-cams-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,6,7,.30) 0%,rgba(5,6,7,.10) 35%,rgba(5,6,7,.20) 65%,rgba(5,6,7,.55) 100%),radial-gradient(ellipse at center,transparent 35%,rgba(5,6,7,.30) 100%);pointer-events:none}
    .sd-cams-grain{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:3px 3px;mix-blend-mode:overlay;opacity:.6}
    .sd-cams-sec > *:not(.sd-cams-bg):not(.sd-cams-grain){position:relative;z-index:1}
    .sd-cams-eyebrow{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:${accent};margin-bottom:18px;display:flex;align-items:center;gap:14px}
    .sd-cams-eyebrow .ln{flex:1;height:1px;background:${border}}
    .sd-cams-eyebrow .live{display:inline-flex;align-items:center;gap:8px;color:${accent}}
    .sd-cams-eyebrow .live::before{content:"";width:8px;height:8px;border-radius:50%;background:${accent};box-shadow:0 0 12px ${accent};animation:sd-live-blink 1.4s steps(2) infinite}
    @keyframes sd-live-blink{50%{opacity:.25}}
    .sd-cams-h2{font-family:"Archivo Black",sans-serif;font-size:clamp(34px,5.5vw,84px);line-height:.95;letter-spacing:-.025em;text-transform:uppercase;margin:0 0 14px;max-width:18ch}
    .sd-cams-h2 i{font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:300;color:${accent}}
    .sd-cams-lede{font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.04em;color:${subText};max-width:680px;margin:0 0 48px;line-height:1.65}
    .sd-cams-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:40px}
    @media (max-width:1000px){.sd-cams-grid{grid-template-columns:1fr;gap:20px}}
    .sd-tv{position:relative;background:linear-gradient(180deg,#1a1a1a,#0c0c0c);border-radius:16px;padding:18px 18px 22px;box-shadow:0 30px 60px -20px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04) inset,0 -2px 0 rgba(255,255,255,.06) inset}
    .sd-tv-screen{position:relative;aspect-ratio:16/9;background:#000;border-radius:6px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.8) inset,0 4px 24px rgba(0,0,0,.6) inset}
    .sd-tv-screen iframe{position:absolute;inset:-2px;width:calc(100% + 4px);height:calc(100% + 4px);border:0;background:#000}
    .sd-tv-scanlines{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.18) 2px 3px),linear-gradient(180deg,rgba(255,255,255,.04) 0%,rgba(0,0,0,0) 8%,rgba(0,0,0,0) 92%,rgba(0,0,0,.25) 100%);mix-blend-mode:multiply;z-index:2}
    .sd-tv-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.35) 100%);z-index:3}
    .sd-tv-badge{position:absolute;top:10px;left:12px;font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.32em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);padding:5px 8px;border:1px solid rgba(255,255,255,.18);z-index:4;display:inline-flex;align-items:center;gap:8px}
    .sd-tv-badge .dot{width:6px;height:6px;background:${accent};border-radius:50%;box-shadow:0 0 10px ${accent};animation:sd-live-blink 1.4s steps(2) infinite}
    .sd-tv-channel{position:absolute;top:10px;right:12px;font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.7);z-index:4}
    .sd-tv-meta{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;gap:16px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${mute}}
    .sd-tv-meta b{font-family:"Archivo Black",sans-serif;font-size:14px;letter-spacing:.06em;color:${fg};display:block;margin-bottom:4px}
    .sd-tv-meta b em{font-style:normal;color:${accent}}
    /* weather strip */
    .sd-weather{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:${border};border:1px solid ${border};border-radius:4px;overflow:hidden;font-family:"JetBrains Mono",monospace}
    @media (max-width:980px){.sd-weather{grid-template-columns:repeat(2,1fr)}}
    .sd-wx{background:${bg};padding:20px 22px;display:flex;flex-direction:column;gap:6px;transition:background .2s}
    .sd-wx:hover{background:${surfaceAlt||border}}
    .sd-wx-k{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${mute}}
    .sd-wx-v{font-family:"Archivo Black",sans-serif;font-size:clamp(22px,2.2vw,32px);letter-spacing:-.01em;color:${fg};line-height:1}
    .sd-wx-v small{font-family:"JetBrains Mono",monospace;font-weight:400;font-size:11px;color:${mute};letter-spacing:.08em;margin-left:4px}
    .sd-wx-source{margin-top:14px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${mute};display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
    .sd-wx-source a{color:${accent};text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s}
    .sd-wx-source a:hover{border-bottom-color:${accent}}

    /* §02.5 — MARQUEE OVER VIDEO */
    .sd-marquee-sec{position:relative;height:100vh;min-height:560px;overflow:hidden;background:#000;z-index:6;border-top:1px solid ${border};border-bottom:1px solid ${border}}
    .sd-mq-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(.45) brightness(.32);z-index:0}
    .sd-mq-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.25) 50%,rgba(0,0,0,.45) 100%),radial-gradient(ellipse at center,rgba(0,0,0,.0) 30%,rgba(0,0,0,.55) 90%);pointer-events:none;z-index:1}
    .sd-mq-scrim{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.12) 2px 3px);pointer-events:none;z-index:3;mix-blend-mode:multiply}
    .sd-mq-stage{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:0;z-index:4;pointer-events:none;overflow:hidden}
    .sd-mq-row{display:flex;flex-wrap:nowrap;width:max-content;white-space:nowrap;font-family:"Archivo Black",sans-serif;font-size:clamp(56px,12vw,180px);line-height:.9;letter-spacing:-.025em;text-transform:uppercase;color:#fff;will-change:transform}
    .sd-mq-row > span{flex:0 0 auto}
    .sd-mq-row.b{color:${accent};font-style:italic;font-family:"Space Grotesk",sans-serif;font-weight:700;letter-spacing:-.02em}
    .sd-mq-row span{padding-right:.5em;display:inline-flex;align-items:center;gap:.4em;animation:sd-mq-pulse 4.2s ease-in-out infinite;will-change:text-shadow}
    .sd-mq-row span::after{content:"●";font-size:.32em;color:${accent};transform:translateY(-.6em);display:inline-block;text-shadow:0 0 18px rgba(255,140,40,.9)}
    .sd-mq-row.b span::after{color:#fff;text-shadow:0 0 18px rgba(255,255,255,.9)}
    /* per-word stagger so glows pulse independently */
    .sd-mq-row span:nth-child(7n)   { animation-delay: -0.0s; animation-duration: 3.8s }
    .sd-mq-row span:nth-child(7n+1) { animation-delay: -0.6s; animation-duration: 4.4s }
    .sd-mq-row span:nth-child(7n+2) { animation-delay: -1.3s; animation-duration: 3.2s }
    .sd-mq-row span:nth-child(7n+3) { animation-delay: -2.0s; animation-duration: 5.0s }
    .sd-mq-row span:nth-child(7n+4) { animation-delay: -2.7s; animation-duration: 3.6s }
    .sd-mq-row span:nth-child(7n+5) { animation-delay: -3.4s; animation-duration: 4.6s }
    .sd-mq-row span:nth-child(7n+6) { animation-delay: -1.7s; animation-duration: 4.0s }
    @keyframes sd-mq-pulse {
      0%, 100% { text-shadow:
        0 4px 18px rgba(0,0,0,.85),
        0 0 4px rgba(0,0,0,.6),
        0 0 6px rgba(255,140,40,.18); }
      50%      { text-shadow:
        0 4px 18px rgba(0,0,0,.85),
        0 0 4px rgba(0,0,0,.6),
        0 0 38px rgba(255,165,60,.85),
        0 0 14px rgba(255,90,31,.7),
        0 0 6px rgba(255,200,120,.5); }
    }
    .sd-mq-row.b span {
      /* italic accent row — orange→white glow tone */
    }
    @keyframes sd-mq-pulse-b {
      0%, 100% { text-shadow:
        0 4px 18px rgba(0,0,0,.85),
        0 0 4px rgba(0,0,0,.6),
        0 0 6px rgba(255,90,31,.18); }
      50%      { text-shadow:
        0 4px 18px rgba(0,0,0,.85),
        0 0 4px rgba(0,0,0,.6),
        0 0 42px rgba(255,140,40,.95),
        0 0 16px rgba(255,90,31,.85); }
    }
    .sd-mq-row.b span { animation-name: sd-mq-pulse-b }
    .sd-mq-tag{position:absolute;left:6vw;top:36px;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:${accent};z-index:5;text-shadow:0 0 12px rgba(0,0,0,.9)}
    .sd-mq-foot{position:absolute;left:6vw;right:6vw;bottom:36px;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.85);z-index:5;display:flex;justify-content:space-between;text-shadow:0 0 12px rgba(0,0,0,.9)}

    /* footer */
    .sd-foot{padding:24px 6vw;border-top:1px solid ${border};display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${mute};background:${bg};position:relative;z-index:7}
    @media (pointer:coarse), (max-width:780px){
      .sd-coverage a,.sd-wx-source a,.sd-foot a{display:inline-flex;align-items:center;min-height:44px}
    }

    /* reveal animation */
    .sd-reveal{opacity:0;transform:translateY(28px);transition:opacity .9s ease,transform .9s ease}
    .sd-reveal.in{opacity:1;transform:none}

    @media (max-width:980px){
      .sd-section{padding:80px 5vw}
      .sd-about{grid-template-columns:1fr;gap:48px}
      .sd-climate-grid{grid-template-columns:1fr 1fr}
      .sd-svc{grid-template-columns:60px 1fr 60px;gap:14px}
      .sd-svc .blurb{display:none}
      .sd-cta-row{grid-template-columns:1fr;gap:32px}
      .sd-cta-row .right{align-items:flex-start}
      .sd-coverage{text-align:left}
    }
    /* tighter mobile — small phones (375 / 390 / 414) */
    @media (max-width:600px){
      .sd-section{padding:60px 4vw}
      .sd-climate-grid{grid-template-columns:1fr}
      .sd-card{padding:24px 20px;min-height:0}
      .sd-card .stat{font-size:clamp(28px,8vw,36px);overflow-wrap:anywhere;word-break:break-word}
      .sd-card .ttl{font-size:20px;overflow-wrap:anywhere}
      .sd-about-stats{grid-template-columns:1fr 1fr}
      .sd-stat{padding:22px 18px}
      .sd-stat .v{font-size:clamp(28px,7vw,40px);overflow-wrap:anywhere}
      .sd-cta-headline{font-size:clamp(44px,12vw,76px)}
      .sd-testi-h2{font-size:clamp(32px,9vw,56px)}
      .sd-climate-text h2{font-size:clamp(28px,8vw,44px)}
      .sd-eyebrow{font-size:10px;letter-spacing:.2em}
      .sd-foot{font-size:10px;letter-spacing:.1em;flex-direction:column;align-items:flex-start}
    }
  `;
  document.head.appendChild(style);

  // Container appended after splash content — push down 100vh so the splash gets the first viewport
  const wrap = document.createElement('div');
  wrap.id = 'sd-content';
  wrap.style.cssText = 'position:relative;z-index:6;margin-top:100vh;background:'+bg+';color:'+fg+';overflow-x:clip;max-width:100vw;';

  // §02 ABOUT
  const sec2 = document.createElement('section');
  sec2.className = 'sd-section sd-about-section';
  sec2.id = 'about';
  sec2.innerHTML = `
    <div class="sd-eyebrow sd-reveal">// 02 — THE OPERATOR <span class="ln"></span> NL.0432</div>
    <h2 class="sd-reveal">If Shane won't go up — <i>nobody will.</i></h2>
    <div class="sd-about">
      <div class="sd-about-text sd-reveal">
        <p class="sd-lede"><b>Shane Dooley has been roofing the Rock since 2006.</b> Born in Saint John's, raised in the trade, he's the operator other roofers call when a job goes sideways. Highly rated. Booked solid. Still climbing ladders at 7am the day after a Nor'easter.</p>
        <p class="sd-lede">No fear of steep pitch, no fear of altitude, no fear of weather. <b>If a roof can be done, Shane will do it</b> — and the work outlasts the next twenty winters.</p>
      </div>
      <div class="sd-about-stats sd-reveal">
        <div class="sd-stat"><div class="k">// EXPERIENCE</div><div class="v">20+ <small>YEARS ON THE ROCK</small></div></div>
        <div class="sd-stat"><div class="k">// JOBS</div><div class="v">1,200+<small>RES · COM · IND</small></div></div>
        <div class="sd-stat"><div class="k">// RESPONSE</div><div class="v">≤24h<small>EMERGENCY CALLOUT</small></div></div>
        <div class="sd-stat"><div class="k">// RATED</div><div class="v">A+<small>BBB ACCREDITED</small></div></div>
      </div>
    </div>
  `;

  // §03 CLIMATE
  const sec3 = document.createElement('section');
  sec3.className = 'sd-section sd-climate';
  sec3.id = 'climate';
  sec3.innerHTML = `
    <div class="sd-eyebrow sd-reveal">// 03 — THE WEATHER <span class="ln"></span> WORST-RATED CITY IN CANADA</div>
    <div class="sd-climate-intro sd-reveal">
      <video class="sd-flag-video" autoplay muted loop playsinline preload="none" data-src="flag.mp4" onerror="this.style.display='none'"></video>
      <div class="sd-climate-text">
        <h2>Saint John's <i>doesn't forgive shortcuts.</i></h2>
        <p class="sd-lede">Most foggy. Most wet. Most snow. Most wind. Most freezing rain. Environment Canada calls St. John's the worst-weather major city in the country. <b>The roof you put down here isn't the roof you'd put down anywhere else.</b></p>
      </div>
    </div>
    <div class="sd-climate-grid sd-reveal">
      <div class="sd-card">
        <div class="num">// EVENT 01</div>
        <div class="ttl">SHEILA'S <em>BRUSH</em></div>
        <div class="stat">+322cm</div>
        <div class="desc">The St. Patrick's Day blizzard. Annual snowfall on the Avalon. Shane spec's 6ft of doubled ice-and-water shield at every eave because of it.</div>
      </div>
      <div class="sd-card">
        <div class="num">// EVENT 02</div>
        <div class="ttl">HURRICANE <em>IGOR</em></div>
        <div class="stat">172km/h</div>
        <div class="desc">Cape Pine, 2010. Roofs torn from rafters across the Avalon. Shane's installs from that decade are still standing.</div>
      </div>
      <div class="sd-card">
        <div class="num">// EVENT 03</div>
        <div class="ttl"><em>SNOW</em>MAGEDDON</div>
        <div class="stat">76cm/24h</div>
        <div class="desc">January 17, 2020 — single-day snowfall record. 156 km/h gusts. State of emergency. Shane was on roofs Day 2.</div>
      </div>
      <div class="sd-card">
        <div class="num">// EVENT 04</div>
        <div class="ttl">RDF — <em>RAIN</em>, DRIZZLE, FOG</div>
        <div class="stat">121d</div>
        <div class="desc">Days of fog per year. Highest in Canada. Salt-laden moisture eats galvanized fasteners — Shane uses stainless and copper near the harbour.</div>
      </div>
    </div>
  `;

  // §04 SERVICES
  const services = [
    ['01','FLAT MEMBRANE','Modified bitumen 2-ply SBS, EPDM, TPO. Downtown row houses, commercial, mansards. Sealed seams that survive Atlantic UV + freeze-thaw.'],
    ['02','ASPHALT SHINGLE','Architectural, 210+ km/h rated, 6-nail high-wind pattern. Doubled ice-and-water shield at eaves and full valleys.'],
    ['03','STANDING SEAM METAL','Mechanically-seamed galvalume or aluminum. The roof Igor couldn\'t take. 24-gauge minimum. Stainless fasteners on the coast.'],
    ['04','COPPER & SLATE','Heritage roofs on Water St, Gower, Military Rd. Hand-soldered seams. Stays put for a hundred years.'],
    ['05','EMERGENCY REPAIR','24-hour response. Tarp, dry-in, inspect. Then a real fix when the storm passes. Insurance documentation included.'],
    ['06','ICE DAM REMOVAL','Steam-only. No hammers, no axes, no blade damage. Solve the cause: ventilation and air-sealing the ceiling plane.'],
    ['07','PRE-WINTER INSPECTION','30-point. Flashing, sealants, drains, drip edge, attic ventilation. Photo report. Booked Sept–Oct, before Sheila comes.'],
    ['08','INSULATION & VENT','R-60 ceiling, balanced soffit-ridge, air-sealed plane. The real ice-dam fix. NL building-code compliant.'],
  ];
  const sec4 = document.createElement('section');
  sec4.className = 'sd-section sd-services';
  sec4.id = 'services';
  sec4.innerHTML = `
    <video class="sd-svc-bgvid" autoplay muted loop playsinline preload="none" data-src="svc-bg.mp4" onerror="this.style.display='none'"></video>
    <div class="sd-eyebrow sd-reveal">// 04 — THE WORK <span class="ln"></span> ALL OF IT</div>
    <h2 class="sd-reveal">Every kind of roof <i>on the rock.</i></h2>
    <p class="sd-lede sd-reveal">Flat to feral, modern to heritage, residential to commercial. <b>One operator, every system, every neighbourhood.</b> From the Battery to Quidi Vidi, Long's Hill to Water Street — and beyond the bypass.</p>
    <div class="sd-svc-list sd-reveal">
      ${services.map(s => `
        <div class="sd-svc">
          <div class="num">${s[0]}</div>
          <div class="name">${s[1]}</div>
          <div class="blurb">${s[2]}</div>
          <div class="arrow">↗</div>
        </div>
      `).join('')}
    </div>
  `;

  // §05 CTA
  const sec5 = document.createElement('section');
  sec5.className = 'sd-section sd-cta-wrap';
  sec5.id = 'contact';
  sec5.innerHTML = `
    <div class="sd-eyebrow sd-reveal">// 05 — NEXT MOVE <span class="ln"></span> AVAILABLE NOW</div>
    <h1 class="sd-cta-headline sd-reveal">Booked solid.<br><i>Worth the wait.</i></h1>
    <div class="sd-cta-row sd-reveal">
      <div class="left">
        <b>// COVERAGE</b>Saint John's. Mount Pearl. Paradise. Conception Bay South. Bauline. Petty Harbour. Bay Bulls. Cape Spear. Anywhere on the Avalon — and most of the rest of the rock.
        <br><br>
        <b>// HOURS</b>7am – 7pm weekdays. Emergency callout 24/7. Booked solid most weeks; book a quote two weeks ahead for non-emergency.
      </div>
      <div class="right">
        <a class="sd-bigcta" href="tel:+17097691283">Call 709 769 1283</a>
        <a href="quote.html" style="display:inline-flex;align-items:center;gap:10px;padding:14px 20px;color:${fg};border:1px solid ${border};text-decoration:none;font-family:'Archivo Black',sans-serif;font-size:12px;letter-spacing:.14em;text-transform:uppercase;transition:all .2s;align-self:flex-end">— OR REQUEST A QUOTE ONLINE ↗</a>
        <div class="sd-coverage"><a href="tel:+17097691283" style="color:inherit;text-decoration:none;border-bottom:1px solid ${border}"><b>709 · 769 · 1283</b></a><br><a href="mailto:roofingguru@gmail.com" style="color:inherit;text-decoration:none">roofingguru@gmail.com</a><br><a href="https://www.facebook.com/profile.php?id=100057536886329" target="_blank" rel="noopener" style="color:${accent};text-decoration:none">FACEBOOK ↗</a> · BBB A+<br>EST. 2011 · BONDED &amp; INSURED · BBB SINCE 2021</div>
      </div>
    </div>
  `;

  // §02.5 — MARQUEE OVER VIDEO (sits between About and Climate)
  const secMarquee = document.createElement('section');
  secMarquee.className = 'sd-marquee-sec';
  const mqRow = (cls, items) => `<div class="sd-mq-row ${cls||''}">${[...items, ...items, ...items].map(t => `<span>${t}</span>`).join('')}</div>`;
  secMarquee.innerHTML = `
    <video class="sd-mq-video" autoplay muted loop playsinline preload="none" data-src="hero-c.mp4" data-fallback="hero.mp4"></video>
    <div class="sd-mq-overlay"></div>
    <div class="sd-mq-scrim"></div>
    <div class="sd-mq-stage">
      ${mqRow('', ['ANY ROOF','ANY WEATHER','ANY CITY','NO FEAR'])}
      ${mqRow('b', ["FROM THE BATTERY","TO QUIDI VIDI","LONG'S HILL","WATER STREET"])}
      ${mqRow('', ['BUILT FOR THE ROCK','SHANE DOOLEY','ROOFING GURU'])}
    </div>
    <div class="sd-mq-tag">— ON THE ROCK —</div>
    <div class="sd-mq-foot">
      <span>// EXHIBIT B · LIVE ROOFLINE / NL</span>
      <span>SAINT JOHN'S · NEWFOUNDLAND</span>
    </div>
  `;

  // §03.5 — LIVE FEEDS (windy.com webcam embeds + open-meteo current conditions)
  const secCams = document.createElement('section');
  secCams.className = 'sd-cams-sec';
  secCams.id = 'cams';
  const camURL = id => `https://webcams.windy.com/webcams/public/embed/player?playerType=lifetime&webcamId=${id}&loop=false&interactive=true&forceFullScreenOnOverlayPlay=false&autoplay=1&mute=1`;
  secCams.innerHTML = `
    <div class="sd-cams-bg"><video autoplay muted loop playsinline preload="none" data-src="cams-bg.mp4" onerror="this.style.display='none'"></video></div>
    <div class="sd-cams-grain"></div>
    <div class="sd-cams-eyebrow sd-reveal"><span class="live">LIVE</span> // 03.5 — FROM THE ROCK, RIGHT NOW <span class="ln"></span> WINDY · OPEN-METEO</div>
    <h2 class="sd-cams-h2 sd-reveal">What it looks like <i>out there.</i></h2>
    <p class="sd-cams-lede sd-reveal">Two live feeds from downtown Saint John's, plus the current weather pulled fresh from Open-Meteo every five minutes. <b style="color:${fg}">If it's nasty out, Shane's already on a ladder somewhere.</b></p>
    <div class="sd-cams-grid sd-reveal">
      <div class="sd-tv">
        <div class="sd-tv-screen">
          <iframe title="Live webcam: Harbourside Park in Saint John's" src="${camURL('1346454043')}" loading="lazy" allow="autoplay; fullscreen" referrerpolicy="origin"></iframe>
          <div class="sd-tv-scanlines"></div>
          <div class="sd-tv-vignette"></div>
          <div class="sd-tv-badge"><span class="dot"></span>LIVE · CAM 01</div>
          <div class="sd-tv-channel">CH 01</div>
        </div>
        <div class="sd-tv-meta">
          <span><b>HARBOURSIDE <em>PARK</em></b>SAINT JOHN'S HARBOUR · SOUTH-WEST</span>
          <span>47.566°N · 52.713°W</span>
        </div>
      </div>
      <div class="sd-tv">
        <div class="sd-tv-screen">
          <iframe title="Live webcam: George Street in Saint John's" src="${camURL('1793886254')}" loading="lazy" allow="autoplay; fullscreen" referrerpolicy="origin"></iframe>
          <div class="sd-tv-scanlines"></div>
          <div class="sd-tv-vignette"></div>
          <div class="sd-tv-badge"><span class="dot"></span>LIVE · CAM 02</div>
          <div class="sd-tv-channel">CH 02</div>
        </div>
        <div class="sd-tv-meta">
          <span><b>GEORGE <em>STREET</em></b>DOWNTOWN · SOUTH-WEST</span>
          <span>47.560°N · 52.713°W</span>
        </div>
      </div>
    </div>
    <div class="sd-weather sd-reveal" id="sd-wx">
      <div class="sd-wx"><div class="sd-wx-k">// TEMP</div><div class="sd-wx-v" data-wx="temp">—<small>°C</small></div></div>
      <div class="sd-wx"><div class="sd-wx-k">// FEELS</div><div class="sd-wx-v" data-wx="feels">—<small>°C</small></div></div>
      <div class="sd-wx"><div class="sd-wx-k">// WIND</div><div class="sd-wx-v" data-wx="wind">—<small>km/h</small></div></div>
      <div class="sd-wx"><div class="sd-wx-k">// HUMIDITY</div><div class="sd-wx-v" data-wx="hum">—<small>%</small></div></div>
      <div class="sd-wx"><div class="sd-wx-k">// CONDITION</div><div class="sd-wx-v" data-wx="cond" style="font-size:clamp(14px,1.4vw,20px);line-height:1.2">—</div></div>
    </div>
    <div class="sd-wx-source sd-reveal">
      <span>// LIVE @ 47.5615°N 52.7126°W · UPDATED <span data-wx="updated">—</span></span>
      <span>SOURCE: <a href="https://open-meteo.com" target="_blank" rel="noopener">OPEN-METEO</a> · CAMS: <a href="https://www.windy.com" target="_blank" rel="noopener">WINDY.COM</a></span>
    </div>
  `;

  // §02.7 — TESTIMONIALS + BBB CREDENTIALS (early social proof, links out to BBB profile)
  const BBB_URL = 'https://www.bbb.org/ca/nl/st-johns/profile/roofing-contractors/rrr-construction-inc-0087-67408';
  const BBB_SEAL_SVG = `
    <svg class="sd-bbb-seal" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" aria-label="BBB Accredited Business">
      <rect width="200" height="100" fill="#1F468A" rx="3"/>
      <rect x="3" y="3" width="194" height="94" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2"/>
      <text x="100" y="44" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black, Helvetica, sans-serif" font-size="32" font-weight="900" letter-spacing="2">BBB</text>
      <text x="100" y="68" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="1.6">ACCREDITED</text>
      <text x="100" y="83" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="1.6">BUSINESS</text>
    </svg>`;
  const secTesti = document.createElement('section');
  secTesti.className = 'sd-section sd-testi-sec';
  secTesti.innerHTML = `
    <div class="sd-eyebrow sd-reveal">// 02.7 — WHAT THEY SAY <span class="ln"></span> 14 YEARS · A+ BBB</div>
    <h2 class="sd-testi-h2 sd-reveal">Words from <i>the rock.</i></h2>
    <p class="sd-lede sd-reveal">The work speaks for itself — the neighbours do too. <b>14 years in business, BBB-accredited since 2021, A+ rated.</b></p>
    <div class="sd-testi-stats sd-reveal">
      <span><b>14</b> YEARS IN BUSINESS</span>
      <span><b>A+</b> BBB · ATLANTIC PROVINCES</span>
      <span><b>17</b> RECEIPTS BELOW</span>
      <span><b>4.9★</b> GOOGLE RATED</span>
    </div>
    <div class="sd-testi-grid sd-reveal">
      <div class="sd-testi">
        <span class="sd-testi-tracer"></span>
        <span class="sd-testi-num">// CASE<b>01</b></span>
        <p class="sd-testi-quote">The deck is almost finished everyone. We are just waiting on the final NLC permit, but my brother &amp; I aren't wasting the time we have. <b>Want to thank again Shane Roofing Guru for doing our roof — Shane and the bys are great.</b></p>
        <div class="sd-testi-meta"><span><b>The Newfoundland Embassy</b>Downtown St. John's</span><span>2021</span></div>
      </div>
      <div class="sd-testi">
        <span class="sd-testi-tracer"></span>
        <span class="sd-testi-num">// CASE<b>02</b></span>
        <p class="sd-testi-quote">You know you're an adult when getting your roof replaced is the best thing that's happened in a while haha. <b>Thanks Shane Dooley &amp; the guys at Shane Roofing Guru for getting er done!</b></p>
        <div class="sd-testi-meta"><span><b>Jacelle Blagdon</b>Saint John's</span><span>2017</span></div>
      </div>
      <div class="sd-testi">
        <span class="sd-testi-tracer"></span>
        <span class="sd-testi-num">// CASE<b>03</b></span>
        <p class="sd-testi-quote"><b>Shane Roofing Guru is a great local company</b> — good conscientious workers &amp; awesome workmanship!</p>
        <div class="sd-testi-meta"><span><b>Rhonda O'Brien</b>Saint John's</span><span>NL</span></div>
      </div>
      <div class="sd-testi">
        <span class="sd-testi-tracer"></span>
        <span class="sd-testi-num">// CASE<b>04</b></span>
        <span class="sd-testi-peer-tag">// PEER · TRADE</span>
        <p class="sd-testi-quote">Shane Dooley taking on the <b>13/12 pitch roof</b> at 9 Empire. Looking good brother!!</p>
        <div class="sd-testi-meta"><span><b>Catalyst Construction</b>Fellow contractor</span><span>2017</span></div>
      </div>
    </div>
    <a class="sd-creds sd-reveal" href="${BBB_URL}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">
      <div class="sd-creds-bbb">
        ${BBB_SEAL_SVG}
        <div class="badge">A+</div>
        <div class="lbl"><b>BBB Accredited</b>Atlantic Provinces<br>Since Apr 30, 2021<br><span style="color:${accent}">VIEW PROFILE ↗</span></div>
      </div>
      <div class="sd-cred"><div class="k">// IN BUSINESS</div><div class="v">14<small>YEARS — INC. 2011</small></div></div>
      <div class="sd-cred"><div class="k">// ACCREDITED</div><div class="v">2021<small>BBB · APR 30</small></div></div>
      <div class="sd-cred"><div class="k">// ENTITY</div><div class="v">CORP<small>NL CORPORATION</small></div></div>
      <div class="sd-cred"><div class="k">// CATEGORIES</div><div class="v" style="font-size:clamp(14px,1.3vw,18px);line-height:1.4">ROOFING<small>FLAT · HOME RENO · HAULING</small></div></div>
    </a>
  `;

  // §02.8 — SELECTED WORK · 17 real job photos in a GSAP-pinned horizontal scroller
  const jobs = [
    {n:'01', type:'HERITAGE RE-ROOF',         loc:'Heritage 2-storey · tear-off + re-shingle',    area:"ST. JOHN'S NL",  yr:'2020'},
    {n:'02', type:'RE-ROOF · SHINGLE',        loc:'Re-roof in progress · neighbourhood crew',     area:'AVALON',          yr:'2020'},
    {n:'03', type:'HERITAGE MANSARD RE-ROOF', loc:'Heritage mansard · scaffold + re-shingle',     area:'DOWNTOWN',        yr:'2020'},
    {n:'04', type:'FULL RE-ROOF · 3-STOREY',  loc:'Full re-roof · 3-storey historic',             area:'WATER ST',        yr:'2020'},
    {n:'05', type:'FINISHED · HERITAGE',      loc:'Finished navy heritage row',                   area:'THE BATTERY',     yr:'2020'},
    {n:'06', type:'CHURCH RE-ROOF',           loc:'Heritage church · tear-off + re-shingle',      area:'DOWNTOWN',        yr:'2020'},
    {n:'07', type:'NEW BUILD · STEEP-PITCH',  loc:'New construction · steep pitch shingle',       area:'AVALON',          yr:'2020'},
    {n:'08', type:'FINISHED · WINTER INSTALL',loc:'Finished install · winter conditions',         area:"ST. JOHN'S NL",  yr:'2020'},
    {n:'09', type:'BELL TOWER RE-ROOF',       loc:'Bell tower · heritage church re-roof',         area:'DOWNTOWN',        yr:'2020'},
    {n:'10', type:'CREW · SD-01',             loc:'On callout · harness up',                      area:'FIELD · NL',      yr:'2020', crew:true},
    {n:'11', type:'RE-ROOF · 3-STOREY',       loc:'Re-roof · 3-storey · crew on lumber',          area:'DOWNTOWN',        yr:'2020'},
    {n:'12', type:'FLAT MEMBRANE',            loc:'Flat membrane · neighbourhood pan',            area:'AVALON',          yr:'2020'},
    {n:'13', type:'NEW BUILD · CLIFFTOP',     loc:'New build · clifftop NL',                      area:'OUTPORT',         yr:'2020'},
    {n:'14', type:'FLAT MEMBRANE · ROW',      loc:'Flat membrane · jellybean row',                area:'GOWER ST',        yr:'2020'},
    {n:'15', type:'FINISHED · HERITAGE',      loc:'Finished red heritage row',                    area:'GOWER ST',        yr:'2020'},
    {n:'16', type:'CHIMNEY FLASHING',         loc:'Chimney flashing · hot-mop detail',            area:'BATTERY',         yr:'2020'},
    {n:'17', type:'FLAT MEMBRANE',            loc:'Flat membrane · downtown view',                area:'DOWNTOWN',        yr:'2020'}
  ];
  const secJobs = document.createElement('section');
  secJobs.className = 'sd-jobs-sec';
  secJobs.id = 'work';
  secJobs.innerHTML = `
    <div class="sd-jobs-head">
      <div>
        <div class="ttl">Selected <i>work.</i></div>
        <div>// 02.8 — 17 RECEIPTS · ST. JOHN'S NL</div>
      </div>
      <div class="progress">
        <span><b>17</b> JOBS · 2017–2020 SAMPLE</span>
        <span>SCROLL ↓ TO PAN →</span>
      </div>
    </div>
    <div class="sd-jobs-track" id="sd-jobs-track">
      ${jobs.map(j => `
        <div class="sd-job ${j.crew?'sd-job-crew':''}">
          <img src="jobs/job-${j.n}.jpg" loading="lazy" alt="${j.loc}">
          <div class="sd-job-scan"></div>
          <div class="sd-job-rays"></div>
          <div class="sd-job-vignette"></div>
          <div class="sd-job-tracer"></div>
          <div class="sd-job-num">// ${j.n}</div>
          <div class="sd-job-type">${j.type}</div>
          <div class="sd-job-cap">
            <span><b>${j.loc}</b>${j.area}</span>
            <span class="yr">${j.yr}</span>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="sd-jobs-hint">— SCROLL TO PAN THE FIELD —</div>
  `;

  wrap.appendChild(sec2);
  wrap.appendChild(secTesti);     // early social proof right after About
  wrap.appendChild(secJobs);      // visual proof — pinned horizontal scroller
  wrap.appendChild(secMarquee);
  wrap.appendChild(sec3);
  wrap.appendChild(secCams);
  wrap.appendChild(sec4);
  wrap.appendChild(sec5);

  // GSAP-pinned horizontal scroll for the jobs gallery. Mobile keeps the native
  // swipe gallery as a fallback until ScrollTrigger successfully wires up.
  function wireJobsScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const track = secJobs.querySelector('#sd-jobs-track');
    if (!track) return;

    const compact = window.matchMedia('(max-width: 780px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let resizeTimer = 0;

    const clearJobsScroll = () => {
      const existing = ScrollTrigger.getById('sd-jobs-scroll');
      if (existing) existing.kill(true);
      gsap.killTweensOf(track);
      gsap.set(track, { clearProps: 'transform' });
    };

    const setup = () => {
      clearJobsScroll();
      const useMobileGsap = compact.matches && !reduceMotion.matches;
      secJobs.classList.toggle('is-gsap-mobile', useMobileGsap);

      if (reduceMotion.matches) {
        ScrollTrigger.refresh();
        return;
      }

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      if (getDistance() <= 8) {
        ScrollTrigger.refresh();
        return;
      }

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          id: 'sd-jobs-scroll',
          trigger: secJobs,
          start: 'top top',
          end: () => '+=' + getDistance(),
          pin: true,
          scrub: compact.matches ? 0.35 : 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      ScrollTrigger.refresh();
    };

    const queueSetup = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 180);
    };

    setup();
    window.addEventListener('resize', queueSetup, { passive: true });
    window.addEventListener('orientationchange', queueSetup, { passive: true });
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', queueSetup);
    else if (reduceMotion.addListener) reduceMotion.addListener(queueSetup);
  }
  // wait until GSAP + ScrollTrigger are loaded by the marquee module above
  let gsapWaitTicks = 0;
  const waitForGsap = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(waitForGsap);
      // ScrollTrigger plugin needs to be registered (marquee init only does that conditionally)
      try { gsap.registerPlugin(ScrollTrigger); } catch(_){}
      wireJobsScroll();
    } else if (++gsapWaitTicks > 250) {
      clearInterval(waitForGsap);
    }
  }, 60);

  function hydrateLazyVideo(video, onReady, rootMargin = '700px 0px') {
    if (!video) return () => {};

    const ensureSrc = () => {
      if (video.dataset.loaded) return;
      if (video.dataset.src) {
        video.src = video.dataset.src;
        video.dataset.loaded = 'true';
        video.load();
      } else {
        video.dataset.loaded = 'true';
      }
    };

    const start = () => {
      ensureSrc();
      if (onReady) onReady();
      video.play().catch(() => {});
    };

    video.addEventListener('loadedmetadata', () => { if (onReady) onReady(); });
    video.addEventListener('canplay', () => { if (onReady) onReady(); });
    video.addEventListener('error', () => {
      if (video.dataset.fallback && !video.dataset.fallbackLoaded) {
        video.dataset.fallbackLoaded = 'true';
        video.src = video.dataset.fallback;
        video.load();
        video.play().catch(() => {});
      } else {
        video.style.display = 'none';
      }
    });

    if (!video.dataset.src || !('IntersectionObserver' in window)) {
      start();
      return start;
    }

    const io = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      io.disconnect();
      start();
    }, { rootMargin });
    io.observe(video);
    return start;
  }

  // ensure cams bg video autoplays and runs slow + cinematic
  const camsBgVid = secCams.querySelector('.sd-cams-bg video');
  if (camsBgVid) {
    hydrateLazyVideo(camsBgVid, () => { try { camsBgVid.playbackRate = 0.5; } catch(_){} });
  }

  // Open-Meteo live weather pull for St. John's NL — refreshes every 5 min
  const wxRoot = secCams.querySelector('#sd-wx');
  if (wxRoot) {
    const WMO = {
      0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
      45:'Fog',48:'Rime fog',
      51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
      56:'Freezing drizzle',57:'Heavy freezing drizzle',
      61:'Light rain',63:'Rain',65:'Heavy rain',
      66:'Freezing rain',67:'Heavy freezing rain',
      71:'Light snow',73:'Snow',75:'Heavy snow',
      77:'Snow grains',
      80:'Showers',81:'Heavy showers',82:'Violent showers',
      85:'Snow showers',86:'Heavy snow showers',
      95:'Thunderstorm',96:'T-storm + hail',99:'T-storm + heavy hail'
    };
    const set = (k, v) => {
      const el = secCams.querySelector(`[data-wx="${k}"]`);
      if (!el) return;
      // preserve <small> unit suffix if present
      const small = el.querySelector('small');
      el.firstChild.nodeValue = v;
      if (small && el.firstChild !== small) {} // already preserved
    };
    async function pullWx() {
      try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.5615&longitude=-52.7126&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto&wind_speed_unit=kmh&temperature_unit=celsius');
        if (!r.ok) throw new Error('wx '+r.status);
        const data = await r.json();
        const c = data.current || {};
        set('temp',  Math.round(c.temperature_2m));
        set('feels', Math.round(c.apparent_temperature));
        set('wind',  Math.round(c.wind_speed_10m));
        set('hum',   Math.round(c.relative_humidity_2m));
        const condEl = secCams.querySelector('[data-wx="cond"]');
        if (condEl) condEl.textContent = (WMO[c.weather_code] || '—').toUpperCase();
        const updEl = secCams.querySelector('[data-wx="updated"]');
        if (updEl) {
          const d = new Date();
          updEl.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} NDT`;
        }
      } catch(e) { /* keep dashes if offline */ }
    }
    pullWx();
    setInterval(pullWx, 5 * 60 * 1000);
  }

  // freeze-slow marquee video — Chrome's minimum playbackRate is ~0.0625, so 0.1 is the
  // practical "frozen but not stuck" floor. Wrap in try/catch in case browser still rejects.
  const mqVid = secMarquee.querySelector('.sd-mq-video');
  if (mqVid) {
    const slow = () => { try { mqVid.playbackRate = 0.1; } catch(_){} };
    hydrateLazyVideo(mqVid, slow);
  }

  // §03 flag video — start at 1.5s, play at 0.3x (70% slower), loop back to 1.5s
  const flagVid = sec3.querySelector('.sd-flag-video');
  if (flagVid) {
    const FLAG_START = 2.5;
    const setupFlag = () => {
      try { flagVid.playbackRate = 0.3; } catch(_){}
      if (flagVid.currentTime < FLAG_START) {
        try { flagVid.currentTime = FLAG_START; } catch(_){}
      }
    };
    flagVid.addEventListener('play', setupFlag);
    // when the loop attribute resets currentTime to 0, snap it back to 1.5s
    flagVid.addEventListener('timeupdate', () => {
      if (flagVid.currentTime < FLAG_START - 0.05) {
        try { flagVid.currentTime = FLAG_START; } catch(_){}
      }
    });
    hydrateLazyVideo(flagVid, setupFlag);
  }

  // ─── slow accelerated glow on every major title ─────────────────────────────
  // each title gets a radial spotlight that follows the cursor with smooth lerp,
  // plus a slow --sd-glow ramp from 0 → 1 over 700ms when the pointer enters and
  // 1 → 0 over 1200ms when it leaves (so the bloom feels heavy / luxurious, not snappy).
  (() => {
    const titles = document.querySelectorAll('.sd-section h2, .sd-testi-h2, .sd-cta-headline, .sd-climate-text h2');
    titles.forEach(el => {
      let tx = 50, ty = 50, cx = 50, cy = 50, glow = 0, target = 0, raf = 0;
      const tick = () => {
        // lerp position + glow toward targets
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        glow += (target - glow) * (target > glow ? 0.04 : 0.022); // ramp up faster than fall-off
        el.style.setProperty('--sd-mx', cx.toFixed(2) + '%');
        el.style.setProperty('--sd-my', cy.toFixed(2) + '%');
        el.style.setProperty('--sd-glow', glow.toFixed(3));
        if (Math.abs(target - glow) > 0.001 || Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top) / r.height) * 100;
        kick();
      });
      el.addEventListener('pointerenter', () => { target = 1; kick(); });
      el.addEventListener('pointerleave', () => { target = 0; kick(); });
    });
  })();

  // §04 services background video — 0.35x speed (50% then -30% slower), autoplay with gesture retry
  const svcBgVid = sec4.querySelector('.sd-svc-bgvid');
  if (svcBgVid) {
    const slowSvc = () => { try { svcBgVid.playbackRate = 0.35; } catch(_){} };
    const tryPlay = hydrateLazyVideo(svcBgVid, slowSvc);
    svcBgVid.addEventListener('play', slowSvc);
    // gesture-recovery — most autoplay-blocking browsers allow play() inside a user-event handler
    const gestureKick = () => {
      tryPlay();
      ['pointerdown','touchstart','keydown'].forEach(ev =>
        window.removeEventListener(ev, gestureKick, true));
    };
    ['pointerdown','touchstart','keydown'].forEach(ev =>
      window.addEventListener(ev, gestureKick, {capture:true, once:false, passive:true}));
  }

  // (warm canvas glow on marquee removed — was too distracting)

  // footer
  const foot = document.createElement('footer');
  foot.className = 'sd-foot';
  foot.innerHTML = `
    <span>© 2026 SHANE DOOLEY · ROOFING GURU</span>
    <span>SAINT JOHN'S · NL · 47.5615°N 52.7126°W</span>
    <span><a href="tel:+17097691283" style="color:inherit;text-decoration:none">709.769.1283</a> · <a href="mailto:roofingguru@gmail.com" style="color:inherit;text-decoration:none">ROOFINGGURU@GMAIL.COM</a> · <a href="https://www.facebook.com/profile.php?id=100057536886329" target="_blank" rel="noopener" style="color:${accent};text-decoration:none">FACEBOOK ↗</a></span>
  `;
  wrap.appendChild(foot);

  document.body.appendChild(wrap);

  // Scroll-triggered reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('.sd-reveal').forEach(el => io.observe(el));

  // Continuous marquee — each row scrolls indefinitely at its own speed/direction.
  // Uses GSAP for smooth seamless looping; falls back to CSS keyframes if GSAP misses.
  // Also loads ScrollTrigger here so the SELECTED WORK pinned-scroll gallery can use it.
  function loadScript(src){
    return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  }
  (async () => {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
    } catch(_){ /* fall back to CSS keyframes below */ }
    const rows = document.querySelectorAll('.sd-marquee-sec .sd-mq-row');
    if (!rows.length) return;
    // Each row's content is duplicated 3× so a full loop is -33.333%
    const tracks = [
      { dir: -1, dur: 23 },   // row 1 → drifts left  (was 19, -20% speed)
      { dir:  1, dur: 29 },   // row 2 → drifts right (was 24, -20% speed)
      { dir: -1, dur: 25 },   // row 3 → drifts left  (was 21, -20% speed)
    ];
    try {
      if (!window.gsap) throw new Error('gsap missing');
      rows.forEach((row, i) => {
        const t = tracks[i] || tracks[0];
        const start = t.dir < 0 ? 0 : -33.333;
        const end   = t.dir < 0 ? -33.333 : 0;
        gsap.set(row, { xPercent: start });
        gsap.to(row, { xPercent: end, ease: 'none', duration: t.dur, repeat: -1 });
      });
    } catch(e) {
      // CSS fallback — define keyframes inline and apply
      const css = document.createElement('style');
      css.textContent = `
        @keyframes sd-mq-l { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes sd-mq-r { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
        .sd-mq-row { animation: sd-mq-l 23s linear infinite; }
        .sd-mq-row.b { animation: sd-mq-r 29s linear infinite; }
        .sd-mq-row:nth-child(3) { animation: sd-mq-l 25s linear infinite; }
      `;
      document.head.appendChild(css);
    }
  })();
})();
