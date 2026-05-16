import { useState, useEffect, useRef } from "react";

// ── Translations ───────────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "Tokyo Weather",
    subtitle: "REAL-TIME · HYPER-LOCAL · TOKYO, JAPAN",
    changeBtnLabel: cond => `${cond} Change Weather ✦`,
    gifOn: "🎬 GIF ON", gifOff: "🎬 GIF OFF",
    worldClock: "🕐 WORLD CLOCK",
    searchPlaceholder: "Search & add city clock…",
    homeLabel: "HOME",
    location: "📍 Tokyo, Japan",
    feelsLike: "Feels like",
    high: "H:", low: "L:",
    suggestionsTitle: "✦ TODAY'S SUGGESTIONS FOR TOKYO",
    humidity: "Humidity", wind: "Wind", pressure: "Pressure",
    visibility: "Visibility", uvIndex: "UV Index", sunrise: "Sunrise", sunset: "Sunset",
    hourlyTab: "📈 Hourly", dailyTab: "📅 7-Day",
    chartTitle: "24-Hour Temperature Forecast",
    tempLegend: "Temp", rainLegend: "Rain %",
    today: "Today",
    footer: lang => `🗼 Tokyo Weather · Updated ${new Date().toLocaleTimeString(lang === "ja" ? "ja-JP" : "en-US")}`,
    weatherLabels: {
      clear: "Clear Sky", clouds: "Cloudy", rain: "Rainy",
      thunderstorm: "Thunderstorm", snow: "Snowy", mist: "Misty",
    },
    tips: {
      clear: [
        { icon: "😎", text: "Wear sunglasses — UV is high today" },
        { icon: "🧴", text: "Apply SPF 50+ sunscreen before going out" },
        { icon: "💧", text: "Stay hydrated, carry a water bottle" },
        { icon: "👒", text: "A wide-brim hat will keep you cool" },
        { icon: "🌿", text: "Great day for a walk in the park" },
      ],
      clouds: [
        { icon: "🧥", text: "Bring a light jacket — it may get cool" },
        { icon: "☂️", text: "Keep a compact umbrella handy" },
        { icon: "📷", text: "Soft light is perfect for photography" },
        { icon: "☕", text: "Cozy café weather — treat yourself" },
      ],
      rain: [
        { icon: "☂️", text: "Bring your umbrella — rain expected all day" },
        { icon: "🥾", text: "Wear waterproof shoes to stay dry" },
        { icon: "🧥", text: "A raincoat beats an umbrella on a commute" },
        { icon: "🚌", text: "Allow extra travel time — roads may be slow" },
        { icon: "📚", text: "Perfect day to stay in and read a book" },
      ],
      thunderstorm: [
        { icon: "🏠", text: "Stay indoors — lightning is dangerous" },
        { icon: "🔌", text: "Unplug electronics during heavy lightning" },
        { icon: "⚡", text: "Avoid open fields and tall trees outside" },
        { icon: "🚗", text: "If driving, pull over safely and wait" },
        { icon: "📱", text: "Keep your phone charged in case of emergency" },
      ],
      snow: [
        { icon: "🧣", text: "Layer up — scarf, gloves and hat essential" },
        { icon: "🥾", text: "Wear anti-slip boots for icy pavements" },
        { icon: "🚗", text: "Drive slowly — roads may be slippery" },
        { icon: "☃️", text: "Great day for Shinjuku Gyoen in the snow" },
        { icon: "♨️", text: "Warm up with hot ramen or matcha" },
      ],
      mist: [
        { icon: "🚗", text: "Use fog lights while driving — low visibility" },
        { icon: "🚶", text: "Walk carefully near roads in thick mist" },
        { icon: "🎋", text: "Misty mornings make Arashiyama magical" },
        { icon: "☕", text: "A hot drink will cut through the chill" },
      ],
    },
    days: { Today: "Today", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
    statUnits: { ms: "m/s", hPa: "hPa", km: "km", pct: "%" },
  },
  ja: {
    appTitle: "東京天気",
    subtitle: "リアルタイム · ハイパーローカル · 東京、日本",
    changeBtnLabel: cond => `${cond} 天気を変える ✦`,
    gifOn: "🎬 GIF オン", gifOff: "🎬 GIF オフ",
    worldClock: "🕐 世界時計",
    searchPlaceholder: "都市を検索して追加…",
    homeLabel: "本拠地",
    location: "📍 東京、日本",
    feelsLike: "体感温度",
    high: "最高:", low: "最低:",
    suggestionsTitle: "✦ 東京の本日のおすすめ",
    humidity: "湿度", wind: "風速", pressure: "気圧",
    visibility: "視程", uvIndex: "UV指数", sunrise: "日の出", sunset: "日の入り",
    hourlyTab: "📈 毎時", dailyTab: "📅 7日間",
    chartTitle: "24時間気温予報",
    tempLegend: "気温", rainLegend: "降水確率",
    today: "今日",
    footer: () => `🗼 東京天気 · 更新済み ${new Date().toLocaleTimeString("ja-JP")}`,
    weatherLabels: {
      clear: "晴れ", clouds: "曇り", rain: "雨",
      thunderstorm: "雷雨", snow: "雪", mist: "霧",
    },
    tips: {
      clear: [
        { icon: "😎", text: "UV指数が高いのでサングラスを忘れずに" },
        { icon: "🧴", text: "外出前にSPF50以上の日焼け止めを塗りましょう" },
        { icon: "💧", text: "水分補給を忘れずに、水筒を持参しましょう" },
        { icon: "👒", text: "つば広の帽子で涼しく過ごしましょう" },
        { icon: "🌿", text: "公園を散歩するのに最適な一日です" },
      ],
      clouds: [
        { icon: "🧥", text: "肌寒くなることがあるので薄手のジャケットを" },
        { icon: "☂️", text: "折りたたみ傘を持参すると安心です" },
        { icon: "📷", text: "柔らかい光は写真撮影に最適です" },
        { icon: "☕", text: "カフェでゆっくり過ごす天気ですよ" },
      ],
      rain: [
        { icon: "☂️", text: "雨が一日中続くので傘を持参しましょう" },
        { icon: "🥾", text: "濡れないように防水靴を履きましょう" },
        { icon: "🧥", text: "通勤時はレインコートの方が便利です" },
        { icon: "🚌", text: "道路が混む可能性があるので余裕を持って出発を" },
        { icon: "📚", text: "家でゆっくり読書するのにぴったりな日です" },
      ],
      thunderstorm: [
        { icon: "🏠", text: "雷は危険です — 室内にいてください" },
        { icon: "🔌", text: "激しい雷の際は電子機器のプラグを抜きましょう" },
        { icon: "⚡", text: "屋外の開けた場所や高い木には近づかないで" },
        { icon: "🚗", text: "運転中は安全な場所に停車して待ちましょう" },
        { icon: "📱", text: "緊急時のためにスマホを充電しておきましょう" },
      ],
      snow: [
        { icon: "🧣", text: "重ね着を — マフラー・手袋・帽子が必須です" },
        { icon: "🥾", text: "凍った歩道用に滑り止め付きブーツを" },
        { icon: "🚗", text: "道路が滑りやすいのでゆっくり運転しましょう" },
        { icon: "☃️", text: "雪の新宿御苑を散歩するのに最適な日です" },
        { icon: "♨️", text: "温かいラーメンや抹茶で体を温めましょう" },
      ],
      mist: [
        { icon: "🚗", text: "視程が低いのでフォグランプを使いましょう" },
        { icon: "🚶", text: "濃い霧の中では道路近くを注意して歩きましょう" },
        { icon: "🎋", text: "霞がかった朝の嵐山は幻想的です" },
        { icon: "☕", text: "温かい飲み物で体を温めましょう" },
      ],
    },
    days: { Today: "今日", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", Sun: "日" },
    statUnits: { ms: "m/s", hPa: "hPa", km: "km", pct: "%" },
  },
};

// ── Weather config ─────────────────────────────────────────────────────────────
const WEATHER_THEMES = {
  clear:       { bg: "linear-gradient(160deg,#0d1b4b,#1a3a6b 40%,#0f3460 70%,#1a5276)", accent: "#f9ca24", emoji: "☀️", particles: "sun",       gif: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif" },
  clouds:      { bg: "linear-gradient(160deg,#1c2340,#2d3561 40%,#514a9d 80%,#3d3b8e)",  accent: "#c8d6e5", emoji: "☁️", particles: "cloud",     gif: "https://media.giphy.com/media/xT9IgG50Lg7rusytDq/giphy.gif" },
  rain:        { bg: "linear-gradient(160deg,#0a1628,#0f2027 40%,#203a43 75%,#2c5364)",  accent: "#74b9ff", emoji: "🌧️", particles: "rain",      gif: "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif" },
  thunderstorm:{ bg: "linear-gradient(160deg,#060614,#0c0c1d 40%,#1a1a2e 70%,#2d2d44)", accent: "#fdcb6e", emoji: "⛈️", particles: "lightning", gif: "https://media.giphy.com/media/3oEjI6hkw6nbYNQkz6/giphy.gif" },
  snow:        { bg: "linear-gradient(160deg,#1a1a3e,#2c3e6e 40%,#3f2b96 75%,#2c3e50)", accent: "#dfe6e9", emoji: "❄️", particles: "snow",      gif: "https://media.giphy.com/media/RIHOwggxABqvu/giphy.gif" },
  mist:        { bg: "linear-gradient(160deg,#1a2030,#29323c 40%,#485563 75%,#3a4a5a)", accent: "#b2bec3", emoji: "🌫️", particles: "mist",      gif: "https://media.giphy.com/media/l1J9Jzcs9OHSf51lC/giphy.gif" },
};
const WEATHER_SEQUENCE = ["clear","clouds","rain","thunderstorm","snow","mist"];

const ALL_CITIES = [
  { name:"Tokyo",tz:"Asia/Tokyo",flag:"🇯🇵" },{ name:"New York",tz:"America/New_York",flag:"🇺🇸" },
  { name:"London",tz:"Europe/London",flag:"🇬🇧" },{ name:"Paris",tz:"Europe/Paris",flag:"🇫🇷" },
  { name:"Dubai",tz:"Asia/Dubai",flag:"🇦🇪" },{ name:"Sydney",tz:"Australia/Sydney",flag:"🇦🇺" },
  { name:"Singapore",tz:"Asia/Singapore",flag:"🇸🇬" },{ name:"Mumbai",tz:"Asia/Kolkata",flag:"🇮🇳" },
  { name:"Seoul",tz:"Asia/Seoul",flag:"🇰🇷" },{ name:"Beijing",tz:"Asia/Shanghai",flag:"🇨🇳" },
  { name:"Bangkok",tz:"Asia/Bangkok",flag:"🇹🇭" },{ name:"Los Angeles",tz:"America/Los_Angeles",flag:"🇺🇸" },
  { name:"Chicago",tz:"America/Chicago",flag:"🇺🇸" },{ name:"Toronto",tz:"America/Toronto",flag:"🇨🇦" },
  { name:"Berlin",tz:"Europe/Berlin",flag:"🇩🇪" },{ name:"Rome",tz:"Europe/Rome",flag:"🇮🇹" },
  { name:"Madrid",tz:"Europe/Madrid",flag:"🇪🇸" },{ name:"Moscow",tz:"Europe/Moscow",flag:"🇷🇺" },
  { name:"Cairo",tz:"Africa/Cairo",flag:"🇪🇬" },{ name:"Nairobi",tz:"Africa/Nairobi",flag:"🇰🇪" },
  { name:"São Paulo",tz:"America/Sao_Paulo",flag:"🇧🇷" },{ name:"Mexico City",tz:"America/Mexico_City",flag:"🇲🇽" },
  { name:"Auckland",tz:"Pacific/Auckland",flag:"🇳🇿" },{ name:"Honolulu",tz:"Pacific/Honolulu",flag:"🇺🇸" },
  { name:"Istanbul",tz:"Europe/Istanbul",flag:"🇹🇷" },{ name:"Riyadh",tz:"Asia/Riyadh",flag:"🇸🇦" },
  { name:"Jakarta",tz:"Asia/Jakarta",flag:"🇮🇩" },{ name:"Karachi",tz:"Asia/Karachi",flag:"🇵🇰" },
  { name:"Lagos",tz:"Africa/Lagos",flag:"🇳🇬" },{ name:"Amsterdam",tz:"Europe/Amsterdam",flag:"🇳🇱" },
];

const MOCK_WEATHER = {
  temp:22,feels_like:21,humidity:65,wind_speed:3.2,pressure:1013,visibility:10,uv_index:4,
  sunrise:"05:24",sunset:"18:47",
  hourly:Array.from({length:24},(_,i)=>({
    hour:i,
    temp:Math.round(18+Math.sin((i/24)*Math.PI*2-1)*7+Math.random()*2),
    rain:i>=14&&i<=17?Math.round(Math.random()*35+5):0,
  })),
  daily:[
    {day:"Today",high:24,low:16,cond:"☀️",rain:0},
    {day:"Tue",high:22,low:15,cond:"🌤️",rain:10},
    {day:"Wed",high:19,low:13,cond:"🌧️",rain:80},
    {day:"Thu",high:21,low:14,cond:"⛅",rain:20},
    {day:"Fri",high:25,low:17,cond:"☀️",rain:5},
    {day:"Sat",high:26,low:18,cond:"☀️",rain:0},
    {day:"Sun",high:23,low:16,cond:"🌤️",rain:15},
  ],
};

// ── Particles ──────────────────────────────────────────────────────────────────
function Particles({ type }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id, pts = [];
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    if (type === "rain") {
      pts = Array.from({length:130},()=>({x:Math.random()*c.width,y:Math.random()*c.height,len:Math.random()*22+10,speed:Math.random()*9+8,op:Math.random()*0.5+0.2}));
      const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); pts.forEach(p=>{ ctx.beginPath();ctx.strokeStyle=`rgba(116,185,255,${p.op})`;ctx.lineWidth=1;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2,p.y+p.len);ctx.stroke();p.y+=p.speed;if(p.y>c.height){p.y=-p.len;p.x=Math.random()*c.width;}}); id=requestAnimationFrame(draw); }; draw();
    } else if (type==="snow") {
      pts=Array.from({length:90},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*4+1,speed:Math.random()*1.5+0.4,drift:Math.random()-0.5,op:Math.random()*0.6+0.3}));
      const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); pts.forEach(p=>{ ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${p.op})`;ctx.fill();p.y+=p.speed;p.x+=p.drift;if(p.y>c.height){p.y=-p.r;p.x=Math.random()*c.width;}}); id=requestAnimationFrame(draw); }; draw();
    } else if (type==="sun") {
      pts=Array.from({length:35},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2.5+0.5,speed:Math.random()*0.3+0.08,op:Math.random()*0.4+0.1}));
      const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); pts.forEach(p=>{ ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(249,202,36,${p.op})`;ctx.fill();p.y-=p.speed;if(p.y<0){p.y=c.height;p.x=Math.random()*c.width;}}); id=requestAnimationFrame(draw); }; draw();
    } else if (type==="lightning") {
      const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); if(Math.random()<0.022){let x=Math.random()*c.width,cy=0;ctx.strokeStyle="rgba(255,255,200,0.9)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,0);while(cy<c.height*0.65){ctx.lineTo(x+(Math.random()-0.5)*70,cy+=45);}ctx.stroke();} id=requestAnimationFrame(draw); }; draw();
    } else if (type==="mist") {
      pts=Array.from({length:18},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*120+60,op:Math.random()*0.07+0.02,drift:Math.random()*0.4-0.2,speed:Math.random()*0.2+0.08}));
      const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); pts.forEach(p=>{ const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(180,200,220,${p.op})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();p.x+=p.drift;p.y-=p.speed*0.3;if(p.y<-p.r){p.y=c.height+p.r;p.x=Math.random()*c.width;}}); id=requestAnimationFrame(draw); }; draw();
    } else {
      pts=Array.from({length:30},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2.5+0.5,speed:Math.random()*0.35+0.1,op:Math.random()*0.4+0.1}));
      const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); pts.forEach(p=>{ ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${p.op})`;ctx.fill();p.y-=p.speed;if(p.y<0)p.y=c.height;}); id=requestAnimationFrame(draw); }; draw();
    }
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",resize); };
  },[type]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>;
}

// ── Language toggle button (fixed top-right) ───────────────────────────────────
function LangToggle({ lang, onToggle, accent = "#6366f1" }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={lang === "en" ? "日本語に切り替え" : "Switch to English"}
      style={{
        position: "fixed", top: 12, right: 12, zIndex: 9999,
        display: "flex", alignItems: "center", gap: 6,
        background: hover
          ? `linear-gradient(135deg,${accent}44,${accent}22)`
          : "rgba(0,0,0,0.45)",
        border: `1.5px solid ${hover ? accent : "rgba(255,255,255,0.2)"}`,
        borderRadius: 40,
        padding: "6px 14px",
        cursor: "pointer",
        backdropFilter: "blur(20px)",
        boxShadow: hover
          ? `0 0 16px ${accent}44, 0 4px 12px rgba(0,0,0,0.5)`
          : "0 2px 12px rgba(0,0,0,0.4)",
        transition: "all 0.3s ease",
        transform: hover ? "scale(1.04)" : "scale(1)",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{lang === "en" ? "🇺🇸" : "🇯🇵"}</span>
      <span style={{
        fontSize: 11, fontWeight: 800, color: hover ? accent : "#fff",
        letterSpacing: 0.5, transition: "color 0.3s",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        {lang === "en" ? "EN" : "日本語"}
      </span>
      <span style={{
        fontSize: 11, color: "rgba(255,255,255,0.35)",
        fontWeight: 400, letterSpacing: 0,
      }}>→</span>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{lang === "en" ? "🇯🇵" : "🇺🇸"}</span>
      <span style={{
        fontSize: 11, fontWeight: 800, color: hover ? accent : "rgba(255,255,255,0.5)",
        letterSpacing: 0.5, transition: "color 0.3s",
      }}>
        {lang === "en" ? "日本語" : "EN"}
      </span>
    </button>
  );
}

// ── Clock card ─────────────────────────────────────────────────────────────────
function ClockCard({ name, tz, flag, accent, isDefault, homeLabel }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US",{timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}));
      setDate(now.toLocaleDateString("en-US",{timeZone:tz,weekday:"short",month:"short",day:"numeric"}));
    };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[tz]);
  return (
    <div style={{background:isDefault?`${accent}18`:"rgba(255,255,255,0.07)",border:`1px solid ${isDefault?accent+"55":"rgba(255,255,255,0.12)"}`,borderRadius:18,padding:"14px 18px",backdropFilter:"blur(14px)",position:"relative"}}>
      {isDefault && <div style={{position:"absolute",top:8,right:10,fontSize:10,color:accent,fontWeight:800,letterSpacing:1}}>{homeLabel}</div>}
      <div style={{fontSize:14,color:"rgba(255,255,255,0.6)",marginBottom:5}}>{flag} {name}</div>
      <div style={{fontSize:28,fontWeight:700,fontFamily:"'Courier New',monospace",color:"#fff",letterSpacing:2}}>{time}</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4}}>{date}</div>
    </div>
  );
}

// ── City search ────────────────────────────────────────────────────────────────
function CitySearch({ onSelect, accent, placeholder }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = q.length > 0 ? ALL_CITIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 7) : [];
  return (
    <div style={{position:"relative",flex:1,minWidth:200}}>
      <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.09)",border:`1.5px solid ${open?accent:"rgba(255,255,255,0.18)"}`,borderRadius:14,padding:"11px 16px",transition:"border-color 0.3s"}}>
        <span style={{fontSize:17}}>🔍</span>
        <input value={q} onChange={e=>{setQ(e.target.value);setOpen(true);}}
          onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),200)}
          placeholder={placeholder}
          style={{background:"none",border:"none",outline:"none",color:"#fff",fontSize:15,width:"100%"}}/>
        {q&&<span onClick={()=>{setQ("");setOpen(false);}} style={{cursor:"pointer",opacity:0.45,fontSize:16,color:"#fff"}}>✕</span>}
      </div>
      {open&&filtered.length>0&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,zIndex:200,background:"#141e30",border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,overflow:"hidden",backdropFilter:"blur(24px)",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          {filtered.map(city=>(
            <div key={city.name} onMouseDown={()=>{onSelect(city);setQ("");setOpen(false);}}
              style={{padding:"12px 18px",cursor:"pointer",fontSize:15,borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:12,color:"#fff"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.09)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:22}}>{city.flag}</span><span>{city.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Hourly chart ───────────────────────────────────────────────────────────────
function HourlyChart({ hourly, accent }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas=ref.current; if(!canvas)return;
    const dpr=window.devicePixelRatio||1;
    const rect=canvas.getBoundingClientRect();
    canvas.width=rect.width*dpr; canvas.height=rect.height*dpr;
    const ctx=canvas.getContext("2d"); ctx.scale(dpr,dpr);
    const W=rect.width,H=rect.height;
    const pad={t:32,r:16,b:50,l:44};
    const cw=W-pad.l-pad.r,ch=H-pad.t-pad.b;
    const temps=hourly.map(h=>h.temp);
    const minT=Math.min(...temps)-3,maxT=Math.max(...temps)+3;
    const pts=hourly.map((h,i)=>({x:pad.l+(i/(hourly.length-1))*cw,y:pad.t+ch-((h.temp-minT)/(maxT-minT))*ch,temp:h.temp,hour:h.hour,rain:h.rain}));
    ctx.clearRect(0,0,W,H);
    const bw=cw/hourly.length-1;
    pts.forEach(p=>{if(p.rain>0){ctx.fillStyle=`rgba(116,185,255,${p.rain/100*0.45+0.08})`;ctx.fillRect(p.x-bw/2,pad.t,bw,ch);}});
    for(let i=0;i<=4;i++){const y=pad.t+(ch/4)*i;ctx.beginPath();ctx.strokeStyle="rgba(255,255,255,0.07)";ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);ctx.stroke();ctx.setLineDash([]);const tv=Math.round(maxT-((maxT-minT)/4)*i);ctx.fillStyle="rgba(255,255,255,0.38)";ctx.font="12px sans-serif";ctx.textAlign="right";ctx.fillText(`${tv}°`,pad.l-6,y+4);}
    const grad=ctx.createLinearGradient(0,pad.t,0,pad.t+ch);grad.addColorStop(0,accent+"99");grad.addColorStop(1,accent+"08");
    ctx.beginPath();ctx.moveTo(pts[0].x,pad.t+ch);pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,pad.t+ch);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
    ctx.beginPath();pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.strokeStyle=accent;ctx.lineWidth=2.8;ctx.lineJoin="round";ctx.stroke();
    pts.forEach((p,i)=>{if(i%3===0){ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle=accent;ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y,2.8,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText(`${p.temp}°`,p.x,p.y-12);ctx.fillStyle="rgba(255,255,255,0.45)";ctx.font="11px sans-serif";const lbl=p.hour===0?"12a":p.hour<12?`${p.hour}a`:p.hour===12?"12p":`${p.hour-12}p`;ctx.fillText(lbl,p.x,pad.t+ch+18);if(p.rain>0){ctx.fillStyle="#74b9ff";ctx.font="bold 11px sans-serif";ctx.fillText(`${p.rain}%`,p.x,pad.t+ch+34);}}});
  },[hourly,accent]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit, accent }) {
  return (
    <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:"16px 14px",backdropFilter:"blur(12px)"}}>
      <div style={{fontSize:24,marginBottom:7}}>{icon}</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:"#fff"}}>{value}<span style={{fontSize:14,color:accent,marginLeft:3}}>{unit}</span></div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [weather] = useState(MOCK_WEATHER);
  const [condIdx, setCondIdx] = useState(0);
  const [unit, setUnit] = useState("C");
  const [activeTab, setActiveTab] = useState("hourly");
  const [gifLoaded, setGifLoaded] = useState(false);
  const [showGif, setShowGif] = useState(true);
  const [extraClocks, setExtraClocks] = useState([ALL_CITIES[1]]);

  const t = T[lang];
  const condKey = WEATHER_SEQUENCE[condIdx];
  const theme = WEATHER_THEMES[condKey];
  const accent = theme.accent;

  const toF = c => Math.round(c * 9 / 5 + 32);
  const displayTemp = c => unit === "C" ? `${c}°C` : `${toF(c)}°F`;

  const cycleWeather = () => { setCondIdx(i => (i + 1) % WEATHER_SEQUENCE.length); setGifLoaded(false); };
  const addClock = city => {
    if (city.name !== "Tokyo" && !extraClocks.find(c => c.name === city.name))
      setExtraClocks(prev => [...prev.slice(-3), city]);
  };
  const removeClock = name => setExtraClocks(prev => prev.filter(c => c.name !== name));

  const tips = t.tips[condKey];
  const weatherLabel = t.weatherLabels[condKey];

  return (
    <div style={{minHeight:"100vh",background:theme.bg,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",color:"#fff",position:"relative",overflowX:"hidden",transition:"background 1.4s cubic-bezier(0.4,0,0.2,1)"}}>
      <Particles type={theme.particles}/>

      {/* GIF overlay */}
      {showGif&&(
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
          <img src={theme.gif} alt="" onLoad={()=>setGifLoaded(true)}
            style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(1.5) blur(2px)",opacity:gifLoaded?0.13:0,transition:"opacity 1.2s ease"}}/>
        </div>
      )}

      {/* ── Language Toggle ── */}
      <LangToggle lang={lang} onToggle={() => setLang(l => l === "en" ? "ja" : "en")} accent={accent} />

      <div style={{position:"relative",zIndex:10,maxWidth:1020,margin:"0 auto",padding:"clamp(16px,4vw,36px)"}}>

        {/* ── TITLE ── */}
        <div style={{textAlign:"center",marginBottom:36,paddingTop:12}}>
          <div style={{fontSize:"clamp(44px,10vw,80px)",fontWeight:900,letterSpacing:-2,lineHeight:1.05,textShadow:`0 0 70px ${accent}66,0 2px 40px rgba(0,0,0,0.4)`,transition:"text-shadow 1s ease"}}>
            🗼 {t.appTitle}
          </div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.4)",marginTop:10,letterSpacing:lang==="ja"?2:4,fontWeight:500}}>
            {t.subtitle}
          </div>

          {/* Controls */}
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:22,flexWrap:"wrap"}}>
            <button onClick={()=>setUnit(u=>u==="C"?"F":"C")} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:30,padding:"9px 24px",color:"#fff",cursor:"pointer",fontSize:16,fontWeight:800,letterSpacing:1}}>
              °{unit==="C"?"F":"C"}
            </button>
            <button onClick={()=>setShowGif(g=>!g)} style={{background:showGif?accent+"22":"rgba(255,255,255,0.08)",border:`1.5px solid ${showGif?accent+"99":"rgba(255,255,255,0.2)"}`,borderRadius:30,padding:"9px 20px",color:showGif?accent:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:15,fontWeight:600}}>
              {showGif ? t.gifOn : t.gifOff}
            </button>
            <button onClick={cycleWeather}
              style={{background:`linear-gradient(135deg,${accent}40,${accent}18)`,border:`2px solid ${accent}`,borderRadius:30,padding:"9px 26px",color:accent,cursor:"pointer",fontSize:15,fontWeight:800,letterSpacing:0.5,boxShadow:`0 0 22px ${accent}44,0 4px 20px rgba(0,0,0,0.3)`,transition:"all 0.4s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 36px ${accent}77,0 4px 24px rgba(0,0,0,0.4)`;e.currentTarget.style.transform="scale(1.04)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 0 22px ${accent}44,0 4px 20px rgba(0,0,0,0.3)`;e.currentTarget.style.transform="scale(1)";}}>
              {t.changeBtnLabel(theme.emoji)}
            </button>
          </div>
        </div>

        {/* ── WORLD CLOCK ── */}
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:26,padding:"20px 22px",marginBottom:22,backdropFilter:"blur(18px)"}}>
          <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:14,letterSpacing:2}}>
            {t.worldClock}
          </div>
          <div style={{marginBottom:14}}>
            <CitySearch onSelect={addClock} accent={accent} placeholder={t.searchPlaceholder}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>
            <ClockCard name="Tokyo" tz="Asia/Tokyo" flag="🇯🇵" accent={accent} isDefault homeLabel={t.homeLabel}/>
            {extraClocks.map(city=>(
              <div key={city.name} style={{position:"relative"}}>
                <ClockCard {...city} accent={accent} isDefault={false} homeLabel={t.homeLabel}/>
                <div onClick={()=>removeClock(city.name)} style={{position:"absolute",top:9,right:10,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.35)",background:"rgba(0,0,0,0.35)",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HERO CARD ── */}
        <div style={{background:"rgba(255,255,255,0.09)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:30,padding:"clamp(24px,5vw,44px)",backdropFilter:"blur(22px)",marginBottom:18,display:"grid",gridTemplateColumns:"1fr auto",gap:24,alignItems:"center"}}>
          <div>
            <div style={{fontSize:16,color:"rgba(255,255,255,0.5)",marginBottom:8}}>
              {t.location} · {new Date().toLocaleDateString(lang==="ja"?"ja-JP":"en-US",{weekday:"long",month:"long",day:"numeric"})}
            </div>
            <div style={{fontSize:"clamp(80px,20vw,128px)",fontWeight:900,lineHeight:1,letterSpacing:-5,color:"#fff",textShadow:`0 0 50px ${accent}55`,transition:"text-shadow 1s ease"}}>
              {unit==="C"?weather.temp:toF(weather.temp)}°
            </div>
            <div style={{fontSize:24,color:accent,marginTop:8,fontWeight:800}}>{weatherLabel}</div>
            <div style={{fontSize:17,color:"rgba(255,255,255,0.5)",marginTop:6}}>
              {t.feelsLike} {displayTemp(weather.feels_like)} · {t.high} {displayTemp(weather.daily[0].high)} · {t.low} {displayTemp(weather.daily[0].low)}
            </div>
          </div>
          <div style={{fontSize:"clamp(80px,18vw,120px)",textAlign:"center",filter:"drop-shadow(0 0 24px rgba(255,255,255,0.15))",animation:"float 3s ease-in-out infinite"}}>
            {theme.emoji}
          </div>
        </div>

        {/* ── SMART TIPS ── */}
        <div style={{background:`linear-gradient(135deg,${accent}14,rgba(255,255,255,0.04))`,border:`1px solid ${accent}44`,borderRadius:24,padding:"20px 22px",marginBottom:20,backdropFilter:"blur(14px)"}}>
          <div style={{fontSize:13,fontWeight:800,color:accent,marginBottom:14,letterSpacing:2}}>
            {t.suggestionsTitle}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {tips.map((tip,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:40,padding:"10px 20px",display:"flex",alignItems:"center",gap:9,fontSize:15}}>
                <span style={{fontSize:20}}>{tip.icon}</span>
                <span style={{color:"rgba(255,255,255,0.9)",fontWeight:500}}>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:22}}>
          <StatCard icon="💧" label={t.humidity}    value={weather.humidity}    unit={t.statUnits.pct}  accent={accent}/>
          <StatCard icon="💨" label={t.wind}        value={weather.wind_speed}  unit={t.statUnits.ms}   accent={accent}/>
          <StatCard icon="🌡️" label={t.pressure}   value={weather.pressure}    unit={t.statUnits.hPa}  accent={accent}/>
          <StatCard icon="👁️" label={t.visibility} value={weather.visibility}  unit={t.statUnits.km}   accent={accent}/>
          <StatCard icon="☀️" label={t.uvIndex}     value={weather.uv_index}    unit=""                 accent={accent}/>
          <StatCard icon="🌅" label={t.sunrise}     value={weather.sunrise}     unit=""                 accent={accent}/>
          <StatCard icon="🌇" label={t.sunset}      value={weather.sunset}      unit=""                 accent={accent}/>
        </div>

        {/* ── TABS ── */}
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[["hourly",t.hourlyTab],["daily",t.dailyTab]].map(([tab,label])=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{background:activeTab===tab?accent+"22":"rgba(255,255,255,0.07)",border:`1.5px solid ${activeTab===tab?accent:"rgba(255,255,255,0.15)"}`,borderRadius:24,padding:"10px 24px",color:activeTab===tab?accent:"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:16,fontWeight:700,transition:"all 0.3s"}}>
              {label}
            </button>
          ))}
        </div>

        {activeTab==="hourly"&&(
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:26,padding:"24px 18px",backdropFilter:"blur(12px)",marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:17,fontWeight:700,color:"rgba(255,255,255,0.75)"}}>{t.chartTitle}</div>
              <div style={{display:"flex",gap:14,fontSize:13,color:"rgba(255,255,255,0.45)"}}>
                <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:12,height:4,borderRadius:2,background:accent,display:"inline-block"}}/> {t.tempLegend}</span>
                <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:12,height:12,borderRadius:2,background:"rgba(116,185,255,0.4)",display:"inline-block"}}/> {t.rainLegend}</span>
              </div>
            </div>
            <div style={{height:210}}><HourlyChart hourly={weather.hourly} accent={accent}/></div>
          </div>
        )}

        {activeTab==="daily"&&(
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:26,padding:"24px 22px",backdropFilter:"blur(12px)",marginBottom:24}}>
            {weather.daily.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:i<weather.daily.length-1?"1px solid rgba(255,255,255,0.07)":"none"}}>
                <div style={{width:72,fontSize:17,fontWeight:i===0?800:500,color:i===0?accent:"#fff"}}>{t.days[d.day]}</div>
                <div style={{fontSize:28}}>{d.cond}</div>
                <div style={{flex:1,height:5,margin:"0 18px",background:"rgba(255,255,255,0.1)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${d.rain}%`,height:"100%",background:"#74b9ff",borderRadius:3,transition:"width 0.6s"}}/>
                </div>
                <div style={{fontSize:15,color:"#74b9ff",width:36,textAlign:"right"}}>{d.rain>0?`${d.rain}%`:""}</div>
                <div style={{fontSize:17,textAlign:"right",width:100}}>
                  <span style={{fontWeight:800}}>{displayTemp(d.high)}</span>
                  <span style={{color:"rgba(255,255,255,0.4)",fontSize:15}}> / {displayTemp(d.low)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.2)",paddingBottom:20}}>
          {t.footer(lang)}
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        ::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
}
