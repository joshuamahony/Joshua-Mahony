import { escapeHtml } from './format';

type Home = typeof import('../data/homepage.json');
const e = escapeHtml;
const lines = (s:string) => e(s).replace(/\n/g,'<br>');
const safeUrl=(raw:string) => { if(/^\/(?!\/)[^\s<>\"']*$/.test(raw)) return e(raw); try { const url=new URL(raw); return ['https:','http:'].includes(url.protocol)?e(raw):'#'; } catch{return '#';} };
const mailto=(email:string,subject?:string) => 'mailto:'+encodeURIComponent(email)+(subject?'?subject='+encodeURIComponent(subject):'');
function section(doc:string, start:string, end:string, apply:(s:string)=>string) {
  const i=doc.indexOf(start);
  const j=doc.indexOf(end,i+start.length);
  if(i<0||j<0)throw new Error('Homepage template missing section: '+start);
  return doc.slice(0,i)+apply(doc.slice(i,j+end.length))+doc.slice(j+end.length);
}
function swap(s:string,pattern:RegExp,value:string,tag:string){
  if(!pattern.test(s))throw new Error('Homepage field missing: '+tag);
  return s.replace(pattern,value);
}
export function applyHomepageData(html:string, data:Home){
 let out=html;
 out=section(out,'<section class="hero"','</section>',s=>{
   s=swap(s,/(<span class="eyebrow">)[\s\S]*?(<\/span>)/,'$1'+e(data.hero.eyebrow)+'$2','hero eyebrow');
   s=swap(s,/(<h1 id="hero-title">)[\s\S]*?(<\/h1>)/,'$1'+e(data.hero.name)+' <span class="hero-role"><span class="hero-dash">—</span> '+e(data.hero.role)+'</span>$2','hero title');
   s=swap(s,/(<div class="hero-copy">[\s\S]*?<\/h1>\s*<p>)[\s\S]*?(<\/p>)/,'$1'+e(data.hero.introduction)+'$2','hero description');
   if(data.hero.headshot){s=swap(s,/(<img class="portrait-photo" src=")[^"]+(")/,'$1'+safeUrl(data.hero.headshot)+'$2','headshot');}
   return s;
 });
 out=section(out,'<section class="about','</section>',s=>{
   s=swap(s,/(<h2 class="section-heading" id="about-title">)[\s\S]*?(<\/h2>)/,'$1'+e(data.about.headline)+'$2','about heading');
   s=swap(s,/(<div class="about-copy">[\s\S]*?<\/h2>\s*<p>)[\s\S]*?(<\/p>)/,'$1'+e(data.about.paragraph1)+'$2','about p1');
   s=swap(s,/(<div class="about-copy">[\s\S]*?<\/h2>\s*<p>[\s\S]*?<\/p>\s*<p>)[\s\S]*?(<\/p>)/,'$1'+e(data.about.paragraph2)+'$2','about p2');
   const expertise=data.about.expertise.map((x,i)=>'<div class="expertise-row"><div><h3>'+e(x.title)+'</h3><p>'+e(x.description)+'</p></div></div>').join('\n');
   s=swap(s,/(<div class="expertise" aria-label="Areas of expertise">)[\s\S]*?(<\/div>\s*<\/div>\s*<!-- Professional highlights)/,'$1'+expertise+'</div>\n        </div>\n        <!-- Professional highlights','expertise');
   const stats=data.stats.map(x=>'<div class="stat"><strong>'+e(x.value)+'</strong><span>'+e(x.label)+'</span></div>').join('');
   s=swap(s,/(<div class="stats-strip" aria-label="Professional highlights">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,'$1'+stats+'</div>\n      </div>\n    </section>','stats');
   return s;
 });
 out=section(out,'<section class="broadcasts','</section>',s=>{
   const rendered=data.broadcasts.map((v,i)=>{
     const theme='theme-'+(i%6+1);
     const image=v.thumbnail?'<img src="'+safeUrl(v.thumbnail)+'" alt="" loading="lazy" decoding="async" sizes="(max-width: 520px) 100vw, (max-width: 760px) 50vw, 33vw" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />':'';
     return '<article class="video-card" data-type="'+e(v.type)+'"><a class="video-thumb '+theme+'" href="'+safeUrl(v.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Watch '+e(v.title)+'">'+image+'<span class="play-button" aria-hidden="true"></span></a><div class="video-info"><div class="video-meta"><span class="network">'+e(v.network)+'</span><span class="bullet">·</span><time>'+e(v.date||'DATE TO ADD')+'</time></div><h3>'+e(v.title)+'</h3><p>'+e(v.summary)+'</p></div></article>';
   }).join('\n');
   s=swap(s,/(<div class="video-grid" id="video-grid">)[\s\S]*?(<\/div>\s*<p class="placeholder-note">)/,'$1'+rendered+'</div>\n        <p class="placeholder-note">','video grid');
   return s;
 });
 out=section(out,'<section class="services','</section>',s=>{
   const servicePages=['/broadcast-commentator/','/financial-market-analysis/','/financial-content-creator/'];
   const services=data.services.map((v,i)=>'<article class="service-card"><h3>'+e(v.title)+'</h3><p>'+e(v.description)+'</p><a href="'+e(servicePages[i]||'/#contact')+'">Explore this service ↗</a></article>').join('');
   return swap(s,/(<div class="service-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,'$1'+services+'</div>\n      </div>\n    </section>','services');
 });
 out=section(out,'<section class="contact"','</section>',s=>{
   s=swap(s,/(<h2 class="section-heading" id="contact-title">)[\s\S]*?(<\/h2>)/,'$1'+e(data.contact.headline)+'$2','contact headline');
   s=swap(s,/(<h2 class="section-heading" id="contact-title">[\s\S]*?<\/h2><p>)[\s\S]*?(<\/p>)/,'$1'+e(data.contact.description)+'$2','contact intro');
   s=swap(s,/<a class="email-link"[^>]*>[\s\S]*?<\/a>/,'<a class="email-link" href="'+e(mailto(data.contact.email))+'">'+e(data.contact.email)+' ↗</a>','email');
   s=swap(s,/(<div class="social-links" aria-label="Social media">)[\s\S]*?(<\/div>)/,'$1<a href="'+safeUrl(data.contact.linkedin)+'" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="'+safeUrl(data.contact.x)+'" target="_blank" rel="noopener noreferrer">X / Twitter ↗</a><a href="'+safeUrl(data.contact.youtube)+'" target="_blank" rel="noopener noreferrer">YouTube ↗</a>$2','social');
   return s;
 });
 return out;
}
